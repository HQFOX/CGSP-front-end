import { Button, Grid, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const AddUpdateForm = () => {
  const formik = useFormik({
    initialValues: {
      title: '',
      content: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Obrigatório'),
      content: Yup.string()
    }),
    onSubmit: async (values) => {
      const jsonData = JSON.stringify(values);

      // alert(JSON.stringify(values, null, 2));

      const endpoint = `${process.env.API_URL}/project`;

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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container rowSpacing={4}>
        <Grid item>
          <Typography variant={'h4'}>Adicionar Update</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="title"
            name="title"
            label={'title'}
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="content"
            name="content"
            label={'content'}
            value={formik.values.content}
            onChange={formik.handleChange}
            error={formik.touched.content && Boolean(formik.errors.content)}
            helperText={formik.touched.content && formik.errors.content}
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button type="submit" variant="contained" color="primary" value="submit" fullWidth>
            {'Submit'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
