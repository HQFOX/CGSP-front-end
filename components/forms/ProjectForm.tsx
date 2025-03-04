/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useRef, useState } from 'react';

import { FormikErrors, useFormik } from 'formik';
import { LatLngTuple } from 'leaflet';
import * as Yup from 'yup';

import {
  ArrowBackIos,
  ArrowForwardIos,
  CheckCircle,
  Close,
  ExpandMore,
  OpenInNew
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Chip,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepButton,
  Stepper,
  TextField,
  Typography
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { StyledButton } from '../Button';
import { CGSPDropzone } from '../dropzone/Dropzone';
import { Loading } from '../loading/Loading';
import { CancelModal } from '../modals/CancelModal';
import { districtCenterCoordinates } from '../projects/projectInventory/ProjectInventory';
import { SuccessMessage } from './SuccessMessage';
import { AbstractFile } from './types';
import { getPresignedUrl, submitFile, useFetch } from './utils';

const Map = dynamic(() => import('../map/Map'), {
  ssr: false
});

const districtList = ['Évora', 'Beja', 'Portalegre', 'Setúbal', 'Aveiro', 'Braga'];

const steps = ['Detalhes', 'Localização', 'Tipologias', 'Fotografias'];

interface TypologyDetailsForm extends Omit<TypologyDetails, 'plant'> {
  index: number;
  plant?: AbstractFile;
}

const getErrorMessage = (errors: FormikErrors<any>, t?: any) => {
  const result = [];
  for (const key of Object.keys(errors)) {
    result.push(`Erro no campo ${t(`projectDetails.${key}`)}. `);
  }
  return result;
};

export const ProjectForm = ({
  project,
  onCancel,
  onSubmit
}: {
  project?: Project;
  onCancel?: () => void;
  onSubmit?: () => void;
}) => {
  const { t } = useTranslation(['projectpage', 'common']);

  const [files, setFiles] = useState<AbstractFile[]>(project?.files ?? []);

  const [typologyIndex, setTypologyIndex] = useState(0);
  const [cancelModal, setCancelModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | undefined>(undefined);

  const [activeStep, setActiveStep] = React.useState(0);

  const [centerCoordinates, setCenterCoordinates] = useState<LatLngTuple>([
    38.56633674453089, -7.925327404275489
  ]);

  const ref = useRef(null);

  const formik = useFormik({
    initialValues: {
      id: project?.id ?? '0',
      title: project?.title ?? '',
      assignmentStatus: project?.assignmentStatus ?? 'WAITING',
      constructionStatus: project?.constructionStatus ?? 'ALLOTMENTPERMIT',
      coverPhoto: (project?.coverPhoto as AbstractFile | undefined) ?? undefined,
      district: project?.district ?? '',
      county: project?.county ?? '',
      lots: project ? project.lots : 0,
      assignedLots: project ? project.assignedLots : 0,
      createdOn: project?.createdOn
        ? new Date(project.createdOn).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      typologies: (project?.typologies?.map((value, index) => ({ ...value, index: index })) ??
        []) as TypologyDetailsForm[],
      latitude: project?.coordinates ? project.coordinates[0] : 38.56633674453089,
      longitude: project?.coordinates ? project.coordinates[1] : -7.925327404275489,
      files: [] as { filename: string }[]
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Obrigatório'),
      district: Yup.string().required('Obrigatório'),
      lots: Yup.number().typeError('Este valor tem que ser um número').required('Obrigatório'),
      assignedLots: Yup.number()
        .typeError('Este valor tem que ser um número')
        .required('Obrigatório'),
      typologies: Yup.array().of(
        Yup.object().shape({
          typology: Yup.string(),
          bedroomNumber: Yup.number().typeError('Este valor tem que ser um número').nullable(),
          bathroomNumber: Yup.number().typeError('Este valor tem que ser um número').nullable(),
          garageNumber: Yup.number().typeError('Este valor tem que ser um número').nullable(),
          totalLotArea: Yup.number().typeError('Este valor tem que ser um número').nullable(),
          livingArea: Yup.number().typeError('Este valor tem que ser um número').nullable(),
          price: Yup.number().typeError('Este valor tem que ser um número').nullable()
        })
      ),
      latitude: Yup.number().required('Obrigatório'),
      longitude: Yup.number().required('Obrigatório')
    }),
    onSubmit: async (values) => {
      setSubmitting(true);

      values = { ...values, createdOn: new Date(values.createdOn).toISOString() };

      if (values.coverPhoto) {
        submitFile(values.coverPhoto);
      }

      Promise.all(files.map(async (file) => submitFile(file))).then(async () => {
        Promise.all(values.typologies.map((typ) => typ.plant && submitFile(typ.plant))).then(
          async () => {
            const formatValue = {
              title: values.title,
              assignmentStatus: values.assignmentStatus,
              constructionStatus: values.constructionStatus,
              district: values.district,
              county: values.county,
              lots: values.lots,
              assignedLots: values.assignedLots,
              typologies: values.typologies,
              coordinates: [values.latitude, values.longitude],
              coverPhoto: values.coverPhoto,
              files: files.map((file) => {
                return { filename: file.filename };
              }),
              createdOn: values.createdOn
            };

            postProject(formatValue);
          }
        );
      });
    }
  });

  const onCoordinateChange = async (values: LatLngTuple) => {
    const geoApiInfo = await fetch(`https://json.geoapi.pt/gps/${values[0]},${values[1]}`).then(
      (res) => (res.ok ? res.json() : undefined)
    );

    if (geoApiInfo) {
      formik.setValues({
        ...formik.values,
        latitude: values[0],
        longitude: values[1],
        district: geoApiInfo.distrito,
        county: geoApiInfo.concelho
      });
      setCenterCoordinates(values);
    }
  };

  const handleTypologyDelete = (index: number | undefined) => {
    formik.setValues({
      ...formik.values,
      typologies: formik.values.typologies.filter((value) => value.index != index)
    });
  };

  const handleTypologyAdd = (option: string) => {
    const newIndex = typologyIndex + 1;
    const newTypology = { index: newIndex, typology: option };
    setTypologyIndex(newIndex);
    formik.setValues({
      ...formik.values,
      typologies: [
        ...formik.values.typologies,
        {
          ...newTypology,
          bedroomNumber: undefined,
          bathroomNumber: undefined,
          garageNumber: undefined,
          totalLotArea: undefined,
          livingArea: undefined,
          price: undefined,
          plant: undefined
        } as TypologyDetailsForm
      ]
    });
  };

  const onTypologyChange = (
    _e: React.SyntheticEvent,
    value: (string | undefined)[],
    reason: string
  ) => {
    if (
      reason === 'selectOption' ||
      (reason === 'createOption' && typeof value[value.length - 1] === 'string')
    ) {
      handleTypologyAdd(value[value.length - 1] as string);
    }
  };

  const handleAddFile = async (newFiles: File[]) => {
    newFiles.map((file) =>
      getPresignedUrl(file).then((value) => value && setFiles([...files, value]))
    );
  };

  const handleDeleteFile = (file: AbstractFile) => {
    setFiles(files.filter((item) => item != file));
  };

  const handleAddCover = async (newFiles: File[]) => {
    newFiles.map((file) =>
      getPresignedUrl(file).then((value) => {
        if (value) {
          formik.setValues({
            ...formik.values,
            coverPhoto: value
          });
        }
      })
    );
  };

  const handleDeleteCover = () => {
    formik.setValues({
      ...formik.values,
      coverPhoto: undefined
    });
  };

  const handleAddPlant = async (newFiles: File[], index: number) => {
    newFiles.map((file) =>
      getPresignedUrl(file).then((value) => {
        if (value) {
          const updatedTypologies = formik.values.typologies;

          updatedTypologies[index] = { ...updatedTypologies[index], plant: value };

          formik.setValues({
            ...formik.values,
            typologies: updatedTypologies
          });
        }
      })
    );
  };

  const handleDeletePlant = (index: number) => {
    const updatedTypologies = formik.values.typologies;

    const updatedTypology = updatedTypologies[index];

    delete updatedTypology.plant;

    updatedTypologies[index] = updatedTypology;

    formik.setValues({
      ...formik.values,
      typologies: updatedTypologies
    });
  };

  const handleClose = (confirm: boolean) => {
    setCancelModal(false);
    confirm && onCancel?.();
  };

  const handleDistrictChange = (district: string | null) => {
    if (district && district != formik.values.district) {
      formik.setValues({
        ...formik.values,
        district: district
      });
      if (districtList.includes(district)) {
        const newCoordinates = districtCenterCoordinates[district];
        if (newCoordinates) {
          setCenterCoordinates(newCoordinates);
        }
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1) % steps.length);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % steps.length);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const postProject = async (values: unknown) => {
    const endpoint = project
      ? `${process.env.NEXT_PUBLIC_API_URL}/project/${project.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/project`;

    const res = await useFetch('POST', endpoint, values, true)
      .then((response) => {
        if (response.ok) {
          setSuccess(true);
          onSubmit?.();
          return response.json();
        } else {
          throw new Error('Project Post ' + response.status);
        }
      })
      .catch(() => {
        setSuccess(false);
        setError('Erro a submeter Projeto');
      });

    setSubmitting(false);

    if (res) return res as Project;
  };

  return (
    <Paper sx={{ mt: 4 }}>
      <Container style={{ minHeight: 800 }}>
        <Grid container pt={2}>
          <Grid item mt={4}>
            <Typography variant={'h4'}>
              {project ? 'Editar Projeto' : 'Adicionar Projeto'}
            </Typography>
          </Grid>
          { onCancel ? (<Grid item ml="auto">
             <IconButton
              onClick={() => {
                success ? onCancel() : setCancelModal(true);
              }}
            >
              <Close />
            </IconButton>
          </Grid>) : <></>}
        </Grid>
        {success ? (
          <SuccessMessage title={project ? 'Projeto Editado' : 'Novo Projeto Adicionado'} />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={4} pb={2} pt={4} columnSpacing={4}>
              <Grid item xs={12}>
                <Stepper nonLinear activeStep={activeStep}>
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepButton onClick={handleStep(index)}>{label}</StepButton>
                    </Step>
                  ))}
                </Stepper>
              </Grid>
              {activeStep === 0 && (
                <React.Fragment>
                  <Grid item xs={12}>
                    <Typography variant={'h6'}>Detalhes do Projeto</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="title"
                      name="title"
                      label={'Nome do projeto'}
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      error={formik.touched.title && Boolean(formik.errors.title)}
                      helperText={formik.errors.title}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl sx={{ width: '100%' }}>
                      <InputLabel id="assignment-status-select-dropdown-label">
                        Estado de Atribuição
                      </InputLabel>
                      <Select
                        label="Assignment Status"
                        labelId="assignment-status-select-dropdown-label"
                        id="assignment-status-select-dropdown"
                        name="assignmentStatus"
                        value={formik.values.assignmentStatus}
                        error={
                          formik.touched.assignmentStatus && Boolean(formik.errors.assignmentStatus)
                        }
                        onChange={formik.handleChange}
                        sx={{ width: '100%' }}
                      >
                        <MenuItem value={'WAITING'}>{t('assignmentStatus.WAITING')}</MenuItem>
                        <MenuItem value={'ONGOING'}>{t('assignmentStatus.ONGOING')}</MenuItem>
                        <MenuItem value={'CONCLUDED'}>{t('assignmentStatus.CONCLUDED')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl sx={{ width: '100%' }}>
                      <InputLabel id="construction-status-select-dropdown-label">
                        Estado de Construção
                      </InputLabel>
                      <Select
                        label="Construction Status"
                        labelId="construction-status-select-dropdown-label"
                        id="construction-status-select-dropdown"
                        name="constructionStatus"
                        value={formik.values.constructionStatus}
                        error={
                          formik.touched.constructionStatus &&
                          Boolean(formik.errors.constructionStatus)
                        }
                        onChange={formik.handleChange}
                        sx={{ width: '100%' }}
                      >
                        <MenuItem value={'ALLOTMENTPERMIT'}>
                          {t('constructionStatus.ALLOTMENTPERMIT')}
                        </MenuItem>
                        <MenuItem value={'BUILDINGPERMIT'}>
                          {t('constructionStatus.BUILDINGPERMIT')}
                        </MenuItem>
                        <MenuItem value={'CONCLUDED'}>{t('constructionStatus.CONCLUDED')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id="lots"
                      name="lots"
                      label={'Lotes'}
                      value={formik.values.lots}
                      onChange={formik.handleChange}
                      error={formik.touched.lots && Boolean(formik.errors.lots)}
                      helperText={formik.errors.lots}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id="assignedLots"
                      name="assignedLots"
                      label={'Lotes Atribuídos'}
                      value={formik.values.assignedLots}
                      onChange={formik.handleChange}
                      error={formik.touched.assignedLots && Boolean(formik.errors.assignedLots)}
                      helperText={formik.errors.assignedLots}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="createdOn"
                      name="createdOn"
                      label={'Data de Anunciamento do Projeto'}
                      onChange={formik.handleChange}
                      value={formik.values.createdOn}
                      type="date"
                      fullWidth
                      helperText="Se este campo não for alterado a data será a de criação."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6">Adicionar Foto de Capa</Typography>
                    <CGSPDropzone
                      maxContent={1}
                      files={formik.values.coverPhoto ? [formik.values.coverPhoto] : undefined}
                      onAddFile={handleAddCover}
                      onDeleteFile={handleDeleteCover}
                    />
                  </Grid>
                </React.Fragment>
              )}
              {activeStep == 1 && (
                <React.Fragment>
                  <Grid item xs={12}>
                    <Typography variant={'h6'}>Localização</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Autocomplete
                      id="district"
                      freeSolo
                      options={districtList}
                      value={formik.values.district}
                      onChange={(_e, value) => handleDistrictChange(value)}
                      fullWidth
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={'Distrito'}
                          error={formik.touched.district && Boolean(formik.errors.district)}
                          helperText={formik.touched.district && formik.errors.district}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="county"
                      name="county"
                      label={'Concelho'}
                      value={formik.values.county}
                      onChange={formik.handleChange}
                      error={formik.touched.county && Boolean(formik.errors.county)}
                      helperText={formik.touched.county && formik.errors.county}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="latitude"
                      name="latitude"
                      label={'latitude'}
                      value={formik.values.latitude}
                      onChange={formik.handleChange}
                      error={formik.touched.latitude && Boolean(formik.errors.latitude)}
                      helperText={formik.touched.latitude && (formik.errors.latitude as ReactNode)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="longitude"
                      name="longitude"
                      label={'longitude'}
                      value={formik.values.longitude}
                      onChange={formik.handleChange}
                      error={formik.touched.longitude && Boolean(formik.errors.longitude)}
                      helperText={
                        formik.touched.longitude && (formik.errors.longitude as ReactNode)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      Arraste o Marcador ou clique duas vezes no mapa para preencher
                      automaticamente.
                    </Typography>
                    <Box id="map" style={{ height: 480 }} sx={{ pt: 2 }}>
                      <Map
                        doubleClickZoom={false}
                        scrollWheelZoom={true}
                        centerCoordinates={centerCoordinates}
                        markers={
                          formik.values.latitude && formik.values.longitude
                            ? [[formik.values.latitude, formik.values.longitude]]
                            : []
                        }
                        onCoordinateChange={onCoordinateChange}
                        changeView
                        draggable
                        zoom={13}
                        popupContent={
                          <Link
                            target="_blank"
                            href={`https://www.google.com/maps/search/?api=1&query=${formik.values.latitude}%2C${formik.values.longitude}`}
                            passHref
                          >
                            <StyledButton endIcon={<OpenInNew />}>Ver No Google Maps</StyledButton>
                          </Link>
                        }
                      />
                    </Box>
                  </Grid>
                </React.Fragment>
              )}
              {activeStep == 2 && (
                <React.Fragment>
                  <Grid item xs={12}>
                    <Typography variant={'h6'}>Tipologias</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={['T0', 'T1', 'T2', 'T3', 'T4', 'T5']}
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      isOptionEqualToValue={(_option, _value) => false}
                      freeSolo
                      value={
                        formik.values.typologies
                          .map((element) => element.typology)
                          .filter((element) => typeof element === 'string') as string[]
                      }
                      // defaultValue={formik.values.typology.map((element) => element.typology)}
                      onChange={onTypologyChange}
                      getOptionLabel={(option) => option}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          // eslint-disable-next-line react/jsx-key
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            onDelete={() =>
                              handleTypologyDelete(formik.values.typologies.at(index)?.index)
                            }
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          ref={ref}
                          {...params}
                          label={'tipologia'}
                          helperText="Adicione uma tipologia para fornecer mais detalhes. Pode selecionar uma da lista ou introduzir uma nova."
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {formik.values.typologies.map((typology, index) => {
                      return (
                        <Accordion key={'typologyDetails' + index} defaultExpanded={index == 0}>
                          <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls={`${typology}-content-${index}`}
                            id={`${typology}-header-${index}`}
                          >
                            <Typography>{typology.typology}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container rowSpacing={4} columnSpacing={4}>
                              <Grid item xs={6}>
                                <TextField
                                  id="bedroomNumber"
                                  name={`typologies[${index}].bedroomNumber`}
                                  label={'Número de quartos'}
                                  value={formik.values.typologies.at(index)?.bedroomNumber}
                                  onChange={formik.handleChange}
                                  error={
                                    formik.touched.typologies?.at(index)?.bedroomNumber &&
                                    // @ts-ignore
                                    Boolean(formik.errors.typologies?.at(index)?.bedroomNumber)
                                  }
                                  helperText={
                                    // @ts-ignore
                                    formik.errors.typologies?.at(index)?.bedroomNumber
                                  }
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  id="bathroomNumber"
                                  name={`typologies[${index}].bathroomNumber`}
                                  label={'Número de casas de banho'}
                                  value={formik.values.typologies.at(index)?.bathroomNumber}
                                  onChange={formik.handleChange}
                                  error={
                                    formik.touched.typologies?.at(index)?.bathroomNumber &&
                                    // @ts-ignore
                                    Boolean(formik.errors.typologies?.at(index)?.bathroomNumber)
                                  }
                                  helperText={
                                    // @ts-ignore
                                    formik.errors.typologies?.at(index)?.bathroomNumber
                                  }
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  id="garageNumber"
                                  name={`typologies[${index}].garageNumber`}
                                  label={'Garagens'}
                                  value={formik.values.typologies.at(index)?.garageNumber}
                                  onChange={formik.handleChange}
                                  error={
                                    formik.touched.typologies?.at(index)?.garageNumber &&
                                    // @ts-ignore
                                    Boolean(formik.errors.typologies?.at(index)?.garageNumber)
                                  }
                                  helperText={
                                    // @ts-ignore
                                    formik.errors.typologies?.at(index)?.garageNumber
                                  }
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <TextField
                                  id="totalLotArea"
                                  name={`typologies[${index}].totalLotArea`}
                                  label={'Área Total do Lote'}
                                  value={formik.values.typologies.at(index)?.totalLotArea}
                                  onChange={formik.handleChange}
                                  fullWidth
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="start">{'\u33A1'}</InputAdornment>
                                    )
                                  }}
                                  error={
                                    formik.touched.typologies?.at(index)?.totalLotArea &&
                                    // @ts-ignore
                                    Boolean(formik.errors.typologies?.at(index)?.totalLotArea)
                                  }
                                  helperText={
                                    // @ts-ignore
                                    formik.errors.typologies?.at(index)?.totalLotArea
                                  }
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <TextField
                                  id="livingArea"
                                  name={`typologies[${index}].livingArea`}
                                  label={'Área Útil'}
                                  value={formik.values.typologies.at(index)?.livingArea}
                                  onChange={formik.handleChange}
                                  fullWidth
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="start">{'\u33A1'}</InputAdornment>
                                    )
                                  }}
                                  error={
                                    formik.touched.typologies?.at(index)?.livingArea &&
                                    // @ts-ignore
                                    Boolean(formik.errors.typologies?.at(index)?.livingArea)
                                  }
                                  helperText={
                                    // @ts-ignore
                                    formik.errors.typologies?.at(index)?.livingArea
                                  }
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  id="price"
                                  name={`typologies[${index}].price`}
                                  label={'Preço'}
                                  value={formik.values.typologies.at(index)?.price}
                                  onChange={formik.handleChange}
                                  fullWidth
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="start">€</InputAdornment>
                                    )
                                  }}
                                  error={
                                    formik.touched.typologies?.at(index)?.price &&
                                    // @ts-ignore
                                    Boolean(formik.errors.typologies?.at(index)?.price)
                                  }
                                  helperText={
                                    // @ts-ignore
                                    formik.errors.typologies?.at(index)?.price
                                  }
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="h6">Adicionar Planta</Typography>
                                <CGSPDropzone
                                  maxContent={1}
                                  files={
                                    formik.values.typologies.at(index)?.plant
                                      ? ([
                                          formik.values.typologies.at(index)?.plant
                                        ] as AbstractFile[])
                                      : undefined
                                  }
                                  onAddFile={(files) => handleAddPlant(files, index)}
                                  onDeleteFile={() => handleDeletePlant(index)}
                                />
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </Grid>
                </React.Fragment>
              )}
              {activeStep == 3 && (
                <Grid item xs={12}>
                  <Typography variant="h6">Adicionar Fotos</Typography>
                  <CGSPDropzone
                    maxContent={30}
                    files={files}
                    onAddFile={handleAddFile}
                    onDeleteFile={handleDeleteFile}
                  />
                </Grid>
              )}
            </Grid>
            <Grid container rowSpacing={4} pb={2} columnSpacing={4}>
              <Grid item xs={6}>
                <StyledButton
                  variant="contained"
                  color="primary"
                  disabled={activeStep == 0}
                  onClick={handleBack}
                  startIcon={<ArrowBackIos />}
                >
                  Passo Anterior
                </StyledButton>
              </Grid>
              <Grid item textAlign="end" xs={6}>
                <StyledButton
                  variant="contained"
                  color="primary"
                  disabled={activeStep == steps.length - 1}
                  onClick={handleNext}
                  endIcon={<ArrowForwardIos />}
                >
                  Próximo Passo
                </StyledButton>
              </Grid>
              <Grid item ml="auto">
                {submitting ? (
                  <Loading />
                ) : success ? (
                  <CheckCircle color={'success'} style={{ fontSize: '50px' }} />
                ) : (
                  <Typography color={'error'}>
                    {!formik.isValid ? getErrorMessage(formik.errors, t) : error}
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <StyledButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  value="submit"
                  fullWidth
                  disabled={!formik.isValid}
                >
                  {'Submeter'}
                </StyledButton>
              </Grid>
              { onCancel && <Grid item>
                <StyledButton variant="outlined" onClick={() => setCancelModal(true)} fullWidth>
                  Cancelar
                </StyledButton>
              </Grid>}
            </Grid>
          </form>
        )}
      </Container>
      <CancelModal
        open={cancelModal}
        handleClose={(confirm) => handleClose(confirm)}
        title="Cancelar Criação de Projeto"
      />
    </Paper>
  );
};
