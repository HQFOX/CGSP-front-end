import React, { useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { CheckCircle, Close } from '@mui/icons-material';
import { Container, Grid, IconButton, MenuItem, Paper, TextField, Typography } from '@mui/material';

import { StyledButton } from '../Button';
import { Loading } from '../loading/Loading';
import { CancelModal } from '../modals/CancelModal';
import { SuccessMessage } from './SuccessMessage';
import { dataFetch } from './utils';

export const EnrollRequestForm = ({
  request,
  projects,
  onCancel,
  onSubmit
}: {
  request?: EnrollRequest;
  projects: Project[];
  onCancel: () => void;
  onSubmit: () => void;
}) => {
  const [cancelModal, setCancelModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | undefined>(undefined);

  const formik = useFormik({
    initialValues: {
      id: request?.id ?? '0',
      firstName: request?.firstName ?? '',
      lastName: request?.lastName ?? '',
      telephoneNumber: request?.telephoneNumber ?? '',
      email: request?.email ?? '',
      status: request?.status ?? '',
      projectId: request?.projectId ? request.projectId : null,
      createdOn: request?.createdOn
        ? new Date(request.createdOn).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10)
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Obrigatório'),
      email: Yup.string().required('Obrigatório')
    }),
    onSubmit: async (values) => {
      setSubmitting(true);

      values = { ...values, createdOn: new Date(values.createdOn).toISOString() };

      postRequest(values);
    }
  });

  const handleClose = (confirm: boolean) => {
    setCancelModal(false);
    confirm && onCancel();
  };

  const postRequest = async (values: unknown) => {
    const endpoint = request
      ? `${process.env.NEXT_PUBLIC_API_URL}/enroll/${request.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/enroll`;

    const res = await dataFetch('POST', endpoint, values, true)
      .then((response) => {
        if (response.ok) {
          setSuccess(true);
          onSubmit();
          return response.json();
        } else {
          throw new Error('Enroll request Post ' + response.status);
        }
      })
      .catch((error) => {
        setSuccess(false);
        setError('Erro a submeter Pedido');
        console.log(error);
      });

    setSubmitting(false);

    if (res) return res as EnrollRequest;
    return undefined;
  };

  return (
    <Paper sx={{ mt: 4, minHeight: 600 }}>
      <Container>
        <Grid container pt={2}>
          <Grid item mt={4}>
            <Typography variant={'h5'}>
              {request ? 'Editar Pedido de Inscrição' : 'Criar Pedido de Inscrição'}
            </Typography>
          </Grid>
          <Grid item ml="auto">
            <IconButton
              onClick={() => {
                success ? onCancel() : setCancelModal(true);
              }}>
              <Close />
            </IconButton>
          </Grid>
        </Grid>
        {success ? (
          <SuccessMessage
            title={request ? 'Atualização Editada' : 'Nova Atualização Adicionada'}
            subtitle="Confirme na tabela de Inscrições"
          />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={4} pb={2} pt={4} columnSpacing={4}>
              <Grid item xs={6}>
                <TextField
                  id="first-name"
                  name="firstName"
                  label="Primeiro Nome"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="last-name"
                  name="lastName"
                  label="Último Nome"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="telehponeNumber"
                  name="telephoneNumber"
                  label="Número de telefone"
                  value={formik.values.telephoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.telephoneNumber && Boolean(formik.errors.telephoneNumber)}
                  helperText={formik.touched.telephoneNumber && formik.errors.telephoneNumber}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="projectId"
                  name="projectId"
                  label={'Projeto Relacionado: '}
                  select
                  value={formik.values.projectId}
                  onChange={formik.handleChange}
                  fullWidth
                  helperText="Projeto ao qual esta pessoa se deseja inscrever.">
                  {projects &&
                    projects.length > 0 &&
                    projects.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.title}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="createdOn"
                  name="createdOn"
                  label={'Data de Lançamento do Pedido'}
                  onChange={formik.handleChange}
                  value={formik.values.createdOn}
                  type="date"
                  fullWidth
                  helperText="Se este campo não for alterado a data será a de criação."
                />
              </Grid>
              <Grid item ml="auto">
                {submitting ? (
                  <Loading />
                ) : success ? (
                  <CheckCircle color={'success'} style={{ fontSize: '50px' }} />
                ) : (
                  <Typography color={'error'}>{error}</Typography>
                )}
              </Grid>
              <Grid item>
                <StyledButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  value="submit"
                  fullWidth>
                  {'Submeter'}
                </StyledButton>
              </Grid>
              <Grid item>
                <StyledButton variant="outlined" onClick={() => setCancelModal(true)} fullWidth>
                  Cancelar
                </StyledButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Container>
      <CancelModal
        open={cancelModal}
        handleClose={(confirm) => handleClose(confirm)}
        title="Cancelar Criação de Inscrição"
      />
    </Paper>
  );
};
