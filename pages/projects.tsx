import styled from '@emotion/styled';
import { Search, Tune, Map, MapOutlined, GridView, ViewListOutlined } from '@mui/icons-material';
import { Box, Container, Divider, Grid, TextField, Typography, Button, Paper, IconButton } from '@mui/material';
import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from '../components/dropdown/Dropdown';
import ProjectCard from '../components/projects/ProjectCard';

const StyledInput = styled.input({
  fontSize: "1rem",
  border: 0,
  borderBottom: 1,
  boxShadow: "none",
  ":focus" : {
    outline: "none"
  },
})

const StyledMain = styled.main({
  backgroundColor: "#f6f6f6"
})

const projectData: Project[] = [
  {
    title: 'Loteamento BRº de almeirim',
    location: 'Évora',
    status: 'completed'
  },
  {
    title: 'Empreendimento São José da Ponte',
    location: 'Beja',
    status: 'building',
  },
  {
    title: 'Loteamento de Guadalupe',
    location: 'Portalegre',
    status: 'open'
  },
  {
    title: 'Monte dos Clérigos',
    location: 'Évora',
    status: 'open'
  },
];

type SearchParams = {
  title: string,
  location: string,
  status: string,
  wildcard: string
}

const Projects: NextPage = () => {
  const { t, i18n } = useTranslation(['projectpage', 'common']);
  const [search, setSearch] = useState<SearchParams>({ title: "", location: t("allf"), status: t('allm'), wildcard: ""})
  const [projects, setProjects] = useState<Project[]>(projectData)
  const [projectSearchResults, setProjectSearchResults] = useState<Project[]>(projects)

  useEffect(() => {
    var results = projects;
    results = filterResultsByLocation(search.location,results)
    results = filterResultsByTitle(search.title,results)
    results = filterResultsByStatus(search.status,results)
    results = filterResultsByWildCard(search.wildcard,results)
    setProjectSearchResults(results)
  },[search])

  const filterResultsByLocation = (location: string, projects:Project[]): Project[] => {
    var result: Project[] = projects
    if(location !== t("allf")){
      result = projects.filter( project => project.location && project.location.toLowerCase().includes(location.toLowerCase()));
      return result
    }
    return result;
  }

  const filterResultsByStatus = (status: string, projects:Project[]): Project[] => {
    var result: Project[] = projects
    if(status !== t('allm')){
      result = projects.filter( project => project.status && project.status.toLowerCase().includes(status.toLowerCase()));
      return result
    }
    return result;
  }

  const filterResultsByTitle = (param: string,projects:Project[]) => {
    var result: Project[] = projects
    if(param !== ""){
      result = projects.filter( project => normalizeString(project.title.toLowerCase()).includes(normalizeString(param.toLowerCase())));
    }
    return result
  }

  const filterResultsByWildCard = (param: string,projects:Project[]) => {
    var result: Project[] = projects
    if(param !== ""){
      var resultTitle = projects.filter( project => normalizeString(project.title.toLowerCase()).includes(normalizeString(param.toLowerCase())));
      var resultLocation = projects.filter( project => project.location && normalizeString(project.location.toLowerCase()).includes(normalizeString(param.toLowerCase())));
      result = resultTitle.concat(resultLocation)
    }
    return result
  }

  const normalizeString = (value: string):string => {
    return value.normalize("NFD").replace(/\p{Diacritic}/gu, "")
  }
  const locations = (projectData: Project[]): string[] => {
    const locationSet: string[] = [t('allf')];
    projectData.map( project => {
      if(project.location && !locationSet.includes(project.location))
      {
        locationSet.push(project.location)
      }
    })
    return locationSet
  }

  const status = (projectData: Project[]): string[] => {
    const statusSet: string[] = [t('allm')];
    projectData.map( project => {
      if(project.status && !statusSet.includes(t(`status.${project.status}`)))
      {
        statusSet.push(t(`status.${project.status}`))
      }
    })
    return statusSet
  }

  const handleLocationChange = (location:string) => {
    setSearch(search => ({...search, location: location}))
  }

  const handleStatusChange = (status:string) => {
    switch(status)
    {
      case t("status.completed"):
        setSearch(search => ({...search, status: "completed"}))
        break;
      case t("status.building"):
        setSearch(search => ({...search, status: "building"}))
        break;
      case t("status.open"):
        setSearch(search => ({...search, status: "open"}))
        break;
      default:
        setSearch(search => ({...search, status: t('allm')}))
    }
  }

  const handleTitleChange = (title:string) => {
    setSearch(search => ({...search, title: title}))    
  }
  const handleWildCardChange = (wildcard:string) => {
    setSearch(search => ({...search, wildcard: wildcard}))    
  }

  return (
  <StyledMain>
    <Container sx={{ pt: 10, pb: 10 }}>
        <Box sx={{ pb: 15 }}>
          <Typography variant="h4" component="h1">
            {t("projectPageTitle")}
          </Typography>
          <Divider />
        </Box>
        <Paper sx={{ ml: 1, mr: 1, p:2}}>
          <Grid container spacing={2}>
            <Grid item>
              <Button size={"large"} variant={"outlined"} startIcon={<Search/>} disableRipple>
                <StyledInput placeholder={t("searchPlaceholder")} onChange={(e) => handleWildCardChange(e.target.value)} value={search.wildcard}/>
              </Button>
            </Grid>
            <Grid item sx={{ml:'auto'}}>
              <IconButton aria-label='map view'><MapOutlined/></IconButton>
            </Grid>
            <Grid item>
              <IconButton aria-label='grid view'><GridView/></IconButton>
            </Grid>
            <Grid item>
              <IconButton aria-label='grid view'><ViewListOutlined/></IconButton>
            </Grid>
            <Grid item>
              <Typography sx={{mr: 1, verticalAlign: "middle"}} component={"span"} variant="body1">{t("projectStatusFilterLabel")}: </Typography>
              <Dropdown label={"Status"} displayValue={search.status} options={status(projectData)} valueChange={handleStatusChange}/>
            </Grid>
            <Grid item>
              <Typography sx={{mr: 1, verticalAlign: "middle"}} component={"span"} variant="body1">{t("locationFilterLabel")}: </Typography>
              <Dropdown label={"Location"} displayValue={search.location} options={locations(projectData)} valueChange={handleLocationChange}/>
            </Grid>
            <Grid item>
              <Button startIcon={<Tune/>}>{t("filters")}</Button>
            </Grid>
          </Grid>
        </Paper>
        <Grid container>
          {projectSearchResults.map((project, i) => (
            <Grid key={i} item xs={12} md={6} p={1}>
              <ProjectCard key={i} project={project} />
            </Grid>
          ))}
        </Grid>
      </Container>
  </StyledMain>
  );
}

export const getStaticProps = async (ctx: any) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header','projectpage']))
  }
});

export default Projects;
