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
} from '@mui/material';
import { useFormik } from 'formik';
import { KeyboardEvent, useState } from 'react';
import * as Yup from 'yup';
import { CGSPDropzone } from '../dropzone/Dropzone';

export const AddProjectForm = () => {
  const [file, setFile] = useState<File[]>();

  const formik = useFormik({
    initialValues: {
      title: '',
      status: '',
      location: '',
      typology: [] as string[],
      bedroomNumber: '',
      bathroomNumber: '',
      latitude: '',
      longitude: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Obrigatório'),
      status: Yup.string().required('Obrigatório'),
      location: Yup.string().required('Obrigatório'),
      typology: Yup.array(),
      bedroomNumber: Yup.string().required('Obrigatório'),
      bathroomNumber: Yup.string().required('Obrigatório'),
      latitude: Yup.string().required('Obrigatório'),
      longitude: Yup.string().required('Obrigatório')
    }),
    onSubmit: async (values) => {
      const formatValue = {
        title: values.title,
        status: values.status,
        location: values.location,
        typology: values.typology,
        bedroomNumber: values.bedroomNumber,
        bathroomNumber: values.bathroomNumber,
        coordinates: [values.latitude, values.longitude]
      };

      const jsonData = JSON.stringify(formatValue);

      // alert(JSON.stringify(values, null, 2));

      const endpoint = 'http://localhost:8080/project';

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

  const handleTypologyDelete = (option: string | string[]) => {
    console.log(option);
    formik.setValues({
      ...formik.values,
      typology: formik.values.typology.filter((value) => value != option)
    });
  };

  const handleTypologyAdd = (option: string) => {
    formik.setValues({ ...formik.values, typology: formik.values.typology.concat(option) })
  };

  const handleKeyDown = (e: KeyboardEvent<any>) => {
    e.key === 'Enter' ? handleTypologyAdd(e.target.value) : undefined;
  };

  const handleAddFile = (files: File[]) => {
    setFile([...files])
  }

  const handleDeleteFile = () => {
    setFile([]);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container rowSpacing={4} mt={2}>
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
        <Grid item xs={12}>
          <InputLabel id="status-select-dropdown">Status</InputLabel>
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
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={[]}
            freeSolo
            value={formik.values.typology}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  onDelete={() => handleTypologyDelete(option)}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label={'typology'} onKeyDown={(e) => handleKeyDown(e)} />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="bedroomNumber"
            name="bedroomNumber"
            label={'Número de quartos'}
            value={formik.values.bedroomNumber}
            onChange={formik.handleChange}
            error={formik.touched.bedroomNumber && Boolean(formik.errors.bedroomNumber)}
            helperText={formik.touched.bedroomNumber && formik.errors.bedroomNumber}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="bathroomNumber"
            name="bathroomNumber"
            label={'Número de casas de banho'}
            value={formik.values.bathroomNumber}
            onChange={formik.handleChange}
            error={formik.touched.bathroomNumber && Boolean(formik.errors.bathroomNumber)}
            helperText={formik.touched.bathroomNumber && formik.errors.bathroomNumber}
            fullWidth
          />
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
          <CGSPDropzone maxContent={1} files={file} onAddFile={handleAddFile}  onDeleteFile={handleDeleteFile}/>
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
