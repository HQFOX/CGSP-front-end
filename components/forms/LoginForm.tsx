import React, { useContext, useMemo, useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { CheckCircle, Close, Error as ErrorIcone } from '@mui/icons-material';
import { Container, Grid, IconButton, Paper, TextField, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import { AuthContext } from '../AuthContext';
import { StyledButton } from '../Button';
import { Loading } from '../loading/Loading';
import { dataFetch, getUser } from './utils';

const postLogin = async (values: { username: string; password: string }) => {
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/generateToken`;

  const res = await dataFetch('POST', endpoint, values)
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('Error Login' + response);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return res;
};

export const LoginForm = () => {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const { setUser: setCurrentUser } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Obrigatório'),
      password: Yup.string().required('Obrigatório')
    }),
    onSubmit: async (values) => {
      setError(false);
      setSubmitting(true);
      await postLogin(values).then(async (response) => {
        Cookies.remove('cgsptoken');
        response && Cookies.set('cgsptoken', response, { expires: 2 });
        const user = await getUser(values.username);

        if (user) {
          setCurrentUser(user);
          setSuccess(true);
          router.push('admin/projects/current');
        } else {
          setSuccess(false);
          setError(true);
        }
      });
      setSubmitting(false);
      setError(true);
    }
  });

  const statusIcon = useMemo(() => {
    if (submitting) return <Loading />;

    if (success) return <CheckCircle color={'success'} style={{ fontSize: '50px' }} />;
    if (error) return <ErrorIcone color={'error'} style={{ fontSize: '40px' }} />;
  }, [submitting, success, error]);

  return (
    <Paper sx={{ mt: 4, maxWidth: '40dvw' }}>
      <Container>
        <Grid container pt={2}>
          <Grid item mt={4}>
            <Typography variant={'h5'}>{'Login'}</Typography>
          </Grid>
          <Grid item ml="auto">
            <IconButton onClick={() => router.push('/')}>
              <Close />
            </IconButton>
          </Grid>
        </Grid>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={4} pb={2} pt={4}>
            <Grid item xs={12}>
              <TextField
                id="username"
                name="username"
                label={'Nome de Utilizador'}
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="password"
                name="password"
                label={'Password'}
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                fullWidth
                hidden
              />
            </Grid>
            <Grid item>{statusIcon}</Grid>
            <Grid item ml="auto">
              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                value="submit"
                fullWidth
              >
                {'Login'}
              </StyledButton>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Paper>
  );
};
