import React, { Suspense, useEffect, useState } from 'react';

import { Add } from '@mui/icons-material';
import { Box, Divider, Grid2 as Grid, Typography } from '@mui/material';

import { Loading, StyledButton } from '../../components';
import { EnrollRequestTable } from '../../components/enrollrequests/EnrollRequestTable';
import { EnrollRequestForm } from '../../components/forms/EnrollRequestForm';
import { useFetch } from '../../components/forms/utils';
import { PageContainer } from '../../components/pageContainer/PageContainer';

const EnrollRequestsAdmin = () => {
  const [requests, setRequests] = useState<EnrollRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editRequest, setEditRequest] = useState<EnrollRequest | undefined>();
  const [showAddRequestForm, setShowAddRequestForm] = useState(false);
  const [showEditRequestForm, setShowEditRequestForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = useFetch('GET', `${process.env.NEXT_PUBLIC_API_URL}/enroll`, null, true).then(
        (res) => {
          if (res.ok) {
            const response = res.json() as unknown as EnrollRequest[];
            return response;
          } else {
            throw new Error('Error fetching requests ' + res.status);
          }
        }
      );

      setRequests(await data);
    };
    fetchData().catch((e) => {
      console.error('An error occurred while fetching the data: ', e);
    });

    const fetchProjects = async () => {
      const data = useFetch(
        'GET',
        `${process.env.NEXT_PUBLIC_API_URL}/project`,
        undefined,
        true
      ).then((res) => {
        if (res.ok) {
          const response = res.json() as unknown as Project[];
          return response;
        } else {
          throw new Error('Error fetching projects ' + res.status);
        }
      });

      setProjects(await data);
    };
    fetchProjects().catch((e) => {
      console.error('An error occurred while fetching the data: ', e);
    });
  }, []);

  const refreshData = async () => {
    const res = await useFetch('GET', `${process.env.NEXT_PUBLIC_API_URL}/enroll`, undefined, true);
    if (res.status == 200) {
      const request = (await res.json()) as EnrollRequest[];

      setRequests(request);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (id) {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/enroll/${id}`;

      await useFetch('DELETE', endpoint, undefined, true)
        .then((response) => {
          if (response.ok) {
            console.log(`EnrollRequest ${id} deleted`);
            refreshData();
          } else {
            throw new Error('EnrollRequest Delete ' + response.status);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleShowEnrollRequestForm = (request: EnrollRequest) => {
    setEditRequest(request);
    setShowEditRequestForm(true);
    window.document.getElementById('editprojectform')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageContainer admin>
      <Box sx={{ pb: 4 }}>
        <Typography variant="h5" component="h1">
          Tabela de Pedidos de Inscrição
        </Typography>
        <Divider />
      </Box>
      {!showAddRequestForm && (
        <Grid container mt={2} mb={2}>
          <Grid>
            <StyledButton
              startIcon={<Add />}
              variant="contained"
              onClick={() => setShowAddRequestForm(true)}
            >
              Adicionar Pedido de Inscrição
            </StyledButton>
          </Grid>
        </Grid>
      )}
      <EnrollRequestTable
        requests={requests}
        projects={projects}
        handleDelete={handleDelete}
        handleShowEditForm={handleShowEnrollRequestForm}
      />
      {showAddRequestForm && (
        <Suspense fallback={<Loading />}>
          <EnrollRequestForm
            projects={projects}
            onCancel={() => setShowAddRequestForm(false)}
            onSubmit={() => refreshData()}
          />
        </Suspense>
      )}
      <div id="editEnrollRequestForm">
        {showEditRequestForm && (
          <Suspense fallback={<Loading />}>
            <EnrollRequestForm
              request={editRequest}
              projects={projects}
              onCancel={() => setShowEditRequestForm(false)}
              onSubmit={() => refreshData()}
            />
          </Suspense>
        )}
      </div>
    </PageContainer>
  );
};

export default EnrollRequestsAdmin;
