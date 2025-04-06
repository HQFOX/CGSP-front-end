import React, { useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import type { NextPage } from 'next';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { PageContainer } from '../../components/pageContainer/PageContainer';
import { Box, Checkbox, Divider, FormControlLabel, Typography, Paper, Grid2, Container } from '@mui/material';
import { Title } from '../../components/Title';
import { Loading, StyledButton } from '../../components';
import { SuccessMessage } from '../../components/forms/SuccessMessage';
import { dataFetch } from '../../components/forms/utils';

const Unsubscribe: NextPage = ({requestId, token}: {requestId?: string, token?: string}) => {
  const { t } = useTranslation(['unsubscribe', 'common']);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/enroll/${requestId}/unsubscribe?token=${token ?? ""}`

  const formik = useFormik({
    initialValues: {
      project: false,
      allProjects: false,
    },
    validationSchema: Yup.object({
      project: Yup.boolean().required('Obrigatório')
    }),
    onSubmit: (values) => {
      setLoading(true)

      dataFetch('PUT', endpoint, values, false)
        .then((response) => {
          if(response.ok) {
            setShowSuccessMessage(true)
          }
          else {
            setShowErrorMessage(true)
          }
        })
        .catch((error) => {
          console.error("Network error:", error);
          setShowErrorMessage(true)
        })
        .finally(() => setLoading(false))
    }
  })

  const handleAllProjectsChange = (value: boolean) => {
    if(value){
      formik.setFieldValue("project", true)
    }
    formik.setFieldValue("allProjects", value)
  }

  return (
    <PageContainer>
      <Box sx={{ p: 2, pb: 4 }}>
        <Title variant="h5" component="h1" fontSize={24}>
          {t('title')}
        </Title>
        <Divider />
      </Box>
      <Paper sx={{ p: 4}} variant='outlined'>
      {!showSuccessMessage &&  <form onSubmit={formik.handleSubmit}>
        <Grid2 container p={4} rowSpacing={1} columnSpacing={1}>
          <Grid2 size={12}>
          <Typography variant="body2" color="text.secondary">{t('subtitle')}</Typography>
          </Grid2>
          <Grid2 size={12} ml={1}>
          <FormControlLabel name="project" value={formik.values.project} required control={<Checkbox onChange={formik.handleChange}/>} labelPlacement="end" label={<Typography variant="body2" color="text.secondary" component="span">{t("projectOption")}</Typography>} />
          </Grid2>
          <Grid2 size={12} ml={1}>
          <FormControlLabel name="allProjects" value={formik.values.allProjects} control={<Checkbox onChange={(e,c) => handleAllProjectsChange(c)}/>} labelPlacement="end" label={<Typography variant="body2" color="text.secondary">{t("allProjectOption")}</Typography>} />
          </Grid2>
          {showErrorMessage && <Grid2 ml="auto" alignContent="center">
            <Typography variant="body2" color="text.secondary">{t('errorMessage')}</Typography>
          </Grid2>}
          <Grid2 ml={showErrorMessage ? undefined : "auto"}>
            <StyledButton type="submit" variant="contained" color="primary" loading={loading} loadingIndicator={<Loading height="16px" icon/>}>{t("common:submit")}</StyledButton>
          </Grid2>
        </Grid2>
        </form>}
        {showSuccessMessage && 
          <Container>
            <SuccessMessage title={t("successTitle")} subtitle={t("successSubtitle")} />
          </Container>
        }
      </Paper>

    </PageContainer>
  );
};

export const getServerSideProps = async (context: { params: { requestId?: string; }; query: { token: string }; locale: string; }) => {
 const id = context.params.requestId;
 const { token } = context.query;

  return {
    props: {
      requestId: id,
      token: token ?? "",
      ...(await serverSideTranslations(context.locale, ['common', 'footer', 'header', 'unsubscribe']))
    }
  };
};

export default Unsubscribe;
