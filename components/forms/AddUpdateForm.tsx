import { Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const AddUpdateForm = ({ projects }: { projects?: Project[]}) => {
  const formik = useFormik({
    initialValues: {
      id: '0',
      title: '',
      content: '',
      projectId: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Obrigatório'),
      content: Yup.string(),
      projectId: Yup.string(),
    }),
    onSubmit: async (values) => {

      const jsonData = JSON.stringify(values);

      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/update`;

      console.log(console.log(jsonData))

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
        <Grid item xs={12}>
          <TextField
            id="projectId"
            name="projectId"
            label={'projectId'}
            select
            value={formik.values.projectId}
            onChange={formik.handleChange}
            error={formik.touched.projectId && Boolean(formik.errors.projectId)}
            helperText={formik.touched.projectId && formik.errors.projectId}
            fullWidth
          >
             {projects && projects.length > 0 && projects.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.title}
            </MenuItem>
          ))}
          </TextField>
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
