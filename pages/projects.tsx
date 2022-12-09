import { Search, Tune } from '@mui/icons-material';
import { Box, Container, Divider, Grid, TextField, Typography, Button, Paper } from '@mui/material';
import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from '../components/dropdown/Dropdown';
import ProjectCard from '../components/projects/ProjectCard';

const projectData: Project[] = [
  {
    title: 'Loteamento BRº de almeirim',
    location: 'Évora'
  },
  {
    title: 'Empreendimento São José da Ponte',
    location: 'Beja'
  },
  {
    title: 'Loteamento de Guadalupe',
    location: 'Portalegre'
  },
  {
    title: 'Monte dos Clérigos',
    location: 'Évora'
  },
];

type SearchParams = {
  title : string,
  location : string
}

const Projects: NextPage = () => {
  const { t, i18n } = useTranslation(['projectpage', 'common']);
  const [search, setSearch] = useState<SearchParams>({ title: "", location: t("all")})
  const [projects, setProjects] = useState<Project[]>(projectData)
  const [projectSearchResults, setProjectSearchResults] = useState<Project[]>(projects)

  useEffect(() => {
    var results = projects;
    results = filterResultsByLocation(search.location,results)
    results = filterResultsByTitle(search.title,results)
    setProjectSearchResults(results)
  },[search])

  const filterResultsByLocation = (location: string, projects:Project[]): Project[] => {
    var result: Project[] = projects
    if(location !== t("all")){
      result = projects.filter( project => project.location && project.location.toLowerCase().includes(location.toLowerCase()));
      return result
    }
    return result;
  }

  const filterResultsByTitle = (param: string,projects:Project[]) => {
    var result: Project[] = projects
    if(param !== ""){
      result = projects.filter( project => project.title.toLowerCase().includes(param.toLowerCase()));
    }
    return result
  }

  const locations = (projectData: Project[]): string[] => {
    const locationSet: string[] = [t('all')];
    projectData.map( project => {
      if(project.location && !locationSet.includes(project.location))
      {
        locationSet.push(project.location)
      }
    })
    return locationSet
  }

  const handleLocationChange = (location:string) => {
    setSearch(search => ({...search, location: location}))
  }

  const handleTitleChange = (title:string) => {
    setSearch(search => ({...search, title: title}))    
  }


  return (
  <main style={{ backgroundColor: "#f6f6f6;" }}>
    <Container sx={{ pt: 10, pb: 10 }}>
        <Box sx={{ pb: 15 }}>
          <Typography variant="h4" component="h1">
            {t("projectPageTitle")}
          </Typography>
          <Divider />
        </Box>
        <Paper sx={{ p:2}}>
          <Grid container spacing={2}>
            <Grid item>
              <Button size={"large"} variant={"outlined"} startIcon={<Search/>} disableRipple>
                <input style={{ border: 0, borderBottom: 1}} placeholder={t("searchPlaceholder")} onChange={(e) => handleTitleChange(e.target.value)} value={search.title}/>
              </Button>
            </Grid>
            <Grid item sx={{ml:'auto'}}>
              <Typography component={"span"} variant="body1">Estado: </Typography>
              <Dropdown label={"Location"} displayValue={search.location} options={locations(projectData)} valueChange={handleLocationChange}/>
            </Grid>
            <Grid item>
              <Typography component={"span"} variant="body1">{t("locationFilterLabel")}: </Typography>
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
  </main>
  );
}

export const getStaticProps = async (ctx: any) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header','projectpage']))
  }
});

export default Projects;
