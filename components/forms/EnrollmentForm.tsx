import React, { useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { CheckCircle, ErrorOutline } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Grow,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material';
import { useTranslation } from 'next-i18next';

import theme from '../../theme';
import { StyledButton } from '../Button';
import { Loading } from '../loading/Loading';
import { dataFetch } from './utils';

export const SuccessMessage = ({ email }: { email: string }) => {
  const { t } = useTranslation(['projectpage']);
  return (
    <Grow in={true}>
      <Stack alignContent={'center'} pt={6}>
        <CheckCircle color={'success'} style={{ fontSize: '120px', margin: 'auto' }} />
        <Typography variant="h5">{t('successMessage.success')}</Typography>
        <Typography variant="subtitle1">
          {t('successMessage.confirmation', { email: email })}
        </Typography>
        <Typography variant="subtitle1">{t('successMessage.contactSoon')}</Typography>
      </Stack>
    </Grow>
  );
};

export const ErrorMessage = () => {
  const { t } = useTranslation(['projectpage']);

  return (
    <Grow in={true}>
      <Stack alignContent={'center'} pt={6}>
        <ErrorOutline color={'error'} style={{ fontSize: '120px' }} />
        <Typography variant="h5">{t('errorMessage.error')}</Typography>
        <Typography variant="subtitle1">{t('errorMessage.reason')}</Typography>
        <Typography variant="subtitle1">{t('errorMessage.trySoon')}</Typography>
      </Stack>
    </Grow>
  );
};

const StyledBox = styled(Box)({
  flexDirection: 'column',
  textAlign: 'center',
  display: 'flex',
  width: 700,
  padding: 50,
  [theme.breakpoints.down('md')]: {
    width: 'auto',
    padding: 20
  }
});

export const EnrollmentForm = ({ project }: { project: Project }) => {
  const { t } = useTranslation(['projectpage', 'common']);

  const [submitting, setSubmitting] = useState(false);

  const [success, setSuccess] = useState(false);

  const [errorMessage] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      telephoneNumber: '',
      projectId: project.id,
      status: 'Waiting',
      subscribedUpdates: false
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Obrigatório'),
      lastName: Yup.string().notRequired(),
      email: Yup.string().email('Invalid email address').required('Obrigatório'),
      telephoneNumber: Yup.string().notRequired(),
      subscribedUpdates: Yup.boolean()
    }),
    onSubmit: async (values) => {
      setSubmitting(true);

      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/enroll`;

      await dataFetch('POST', endpoint, values, false)
        .then((response) => {
          if (response.ok) {
            setSuccess(true);
            setSubmitting(false);
            return response.json();
          } else {
            throw new Error('Enrollment Post ' + response.status);
          }
        })
        .catch((error) => {
          setSuccess(false);
          // setError("Erro a submeter Atualização");
          console.log(error);
          setSubmitting(false);
        });

      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <StyledBox>
        <Grid container columnSpacing={2}>
          <Grid item xs={12} maxHeight={150}>
            <Typography variant="h4" component={'h1'}>
              {t('preEnroll')}
            </Typography>
            <hr />
            <Typography variant="h5" component={'h2'}>
              {project.title}
            </Typography>
          </Grid>
        </Grid>
        {!success && (
          <Grid container rowSpacing={2} columnSpacing={2} mt={2}>
            <Grid item xs={12} md={6}>
              <TextField
                id="first-name"
                name="firstName"
                label={t('form.firstName')}
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="last-name"
                name="lastName"
                label={t('form.lastName')}
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="email"
                name="email"
                label={t('form.email')}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="telehponeNumber"
                name="telephoneNumber"
                label={t('form.telephoneNumber')}
                value={formik.values.telephoneNumber}
                onChange={formik.handleChange}
                error={formik.touched.telephoneNumber && Boolean(formik.errors.telephoneNumber)}
                helperText={formik.touched.telephoneNumber && formik.errors.telephoneNumber}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="subscribedUpdates"
                    onChange={formik.handleChange}
                    checked={formik.values.subscribedUpdates}
                  />
                }
                label={t('form.updateCheckbox')}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                value="submit"
                fullWidth>
                {t('form.submit')}
              </StyledButton>
              <Typography variant="body2" sx={{ marginTop: '10px' }}>
                {t('form.notice')}
              </Typography>
            </Grid>
          </Grid>
        )}
        <>
          {submitting && <Loading />}
          {errorMessage && <ErrorMessage />}
          {success && <SuccessMessage email={formik.values.email} />}
        </>
      </StyledBox>
    </form>
  );
};
