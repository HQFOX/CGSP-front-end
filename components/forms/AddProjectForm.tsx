import {
  Button,
  Chip,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
  TextField,
  Typography,
  AccordionDetails,
  Accordion,
  AccordionSummary
} from '@mui/material';
import { useFormik } from 'formik';
import { KeyboardEvent, useRef, useState } from 'react';
import * as Yup from 'yup';
import { CGSPDropzone } from '../dropzone/Dropzone';
import { ExpandMore } from '@mui/icons-material';


export const uploadImages = (path: string, files: File[]) => {
  // Todo: this is a simulation and should be replaced

  files.map((file) => {
    console.log(file);
  });
};

export const AddProjectForm = () => {
  const [file, setFile] = useState<File[]>([]);

  const ref = useRef(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      status: '',
      location: '',
      lots: '',
      assignedLots: '0',
      typology: [] as { index: '', typology: ''}[],
      typologies: [] as { bedroomNumber: '', bathroomNumber: ''}[],
      latitude: '',
      longitude: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Obrigatório'),
      status: Yup.string().required('Obrigatório'),
      location: Yup.string().required('Obrigatório'),
      lots: Yup.string().required('Obrigatório'),
      assignedLots: Yup.string(),
      typology: Yup.array().of(
        Yup.object().shape({
          index: Yup.string(),
          typology: Yup.string()
        })),
      typologies: Yup.array().of(Yup.object().shape({
        bedroomNumber: Yup.string().required('Obrigatório'),
        bathroomNumber: Yup.string().required('Obrigatório'),
      })),
      latitude: Yup.string().required('Obrigatório'),
      longitude: Yup.string().required('Obrigatório')
    }),
    onSubmit: async (values) => {
      const formatValue = {
        title: values.title,
        status: values.status,
        location: values.location,
        lots: values.lots,
        assignedLots: values.assignedLots,
        typologies: values.typologies,
        coordinates: [values.latitude, values.longitude]
      };

      const jsonData = JSON.stringify(formatValue);


      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/project`;

      const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: {
          'Content-Type': 'application/json'
        },
        // Body of the request is the JSON data we created above.
        body: jsonData
      };

      const response = await fetch(endpoint, options);

      const result = await response.json();
      console.log(result);
    }
  });

  const handleTypologyDelete = (index: string | undefined) => {
    formik.setValues({
      ...formik.values,
      typology: formik.values.typology.filter((value) => value.index != index)
    });
  };

  const handleTypologyAdd = (option: string) => {
    const newTypology = {index: formik.values.typology.length.toString(), typology: option}
    formik.setValues({ ...formik.values, typology: formik.values.typology.concat(newTypology as { index: '', typology: ''}), typologies: formik.values.typologies.concat({ bedroomNumber: '', bathroomNumber: ''}) });
  };

  const handleKeyDown = (e: KeyboardEvent<any>) => {
    e.key === 'Enter' ? handleTypologyAdd(e.target.value) : undefined;
  };

  const handleAddFile = (files: File[]) => {
    setFile([...files]);
  };

  const handleDeleteFile = () => {
    setFile([]);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container rowSpacing={4} mt={2} columnSpacing={4}>
        <Grid item>
          <Typography variant={'h4'}>Adicionar Projeto</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="title"
            name="title"
            label={'Nome do projeto'}
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          {/* <InputLabel id="status-select-dropdown">Status</InputLabel> */}
          <Select
            labelId="status-select-dropdown-label"
            id="status-select-dropdown"
            name="status"
            value={formik.values.status}
            error={formik.touched.status && Boolean(formik.errors.status)}
            onChange={formik.handleChange}
            sx={{ width: '100%' }}>
            <MenuItem value={'Status'}>Status</MenuItem>
            <MenuItem value={'Completed'}>Completo</MenuItem>
            <MenuItem value={'History'}>Histórico</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="location"
            name="location"
            label={'Localização (Cidade)'}
            value={formik.values.location}
            onChange={formik.handleChange}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="lots"
            name="lots"
            label={'Lots'}
            value={formik.values.lots}
            onChange={formik.handleChange}
            error={formik.touched.lots && Boolean(formik.errors.lots)}
            helperText={formik.touched.lots && formik.errors.lots}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="assignedLots"
            name="assignedLots"
            label={'Assigned Lots'}
            value={formik.values.assignedLots}
            onChange={formik.handleChange}
            error={formik.touched.assignedLots && Boolean(formik.errors.assignedLots)}
            helperText={formik.touched.assignedLots && formik.errors.assignedLots}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={[]}
            freeSolo
            value={formik.values.typology.map( element => element.typology)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) =>(
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  onDelete={() => handleTypologyDelete(formik.values.typology.at(index)?.index)}
                />
              ))
            }
            renderInput={(params) => (
              <TextField ref={ref} {...params} label={'typology'} onKeyDown={(e) => handleKeyDown(e)} />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          {formik.values.typology.map((typology, index) => {
            return (
              <Accordion key={'typologyDetails' + index} defaultExpanded={index == 0}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  <Typography>{typology.typology}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container rowSpacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        id="bedroomNumber"
                        name={`typologies[${index}].bedroomNumber`}
                        label={'Número de quartos'}
                        value={formik.values.typologies.at(index)?.bedroomNumber || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.typologies?.at(index)?.bedroomNumber && Boolean(formik.errors.typologies?.at(index)?.bedroomNumber)}
                        helperText={formik.touched.typologies?.at(index)?.bedroomNumber && formik.errors.typologies?.at(index)?.bedroomNumber}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="bathroomNumber"
                        name={`typologies[${index}].bathroomNumber`}
                        label={'Número de casas de banho'}
                        value={formik.values.typologies.at(index)?.bathroomNumber || ""}
                        onChange={formik.handleChange}
                        error={formik.touched.typologies?.at(index)?.bedroomNumber && Boolean(formik.errors.typologies?.at(index)?.bathroomNumber)}
                        helperText={formik.touched.typologies?.at(index)?.bedroomNumber && formik.errors.typologies?.at(index)?.bathroomNumber}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="latitude"
            name="latitude"
            label={'latitude'}
            value={formik.values.latitude}
            onChange={formik.handleChange}
            error={formik.touched.latitude && Boolean(formik.errors.latitude)}
            helperText={formik.touched.latitude && formik.errors.latitude}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="longitude"
            name="longitude"
            label={'longitude'}
            value={formik.values.longitude}
            onChange={formik.handleChange}
            error={formik.touched.longitude && Boolean(formik.errors.longitude)}
            helperText={formik.touched.longitude && formik.errors.longitude}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Adicionar Foto de Capa</Typography>
          <CGSPDropzone
            maxContent={1}
            files={file}
            onAddFile={handleAddFile}
            onDeleteFile={handleDeleteFile}
          />
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item>
          <Button type="submit" variant="contained" color="primary" value="submit" fullWidth>
            {'Submit'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
