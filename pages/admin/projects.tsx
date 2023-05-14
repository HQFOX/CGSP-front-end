import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ProjectAdmin: NextPage = () => {
  return <h2> hello world from project admin page </h2>;
};

export const getServerSideProps = async (ctx: any) => {
    //   const res = await fetch(`http://localhost:8080/project`);
    //   const projects = (await res.json()) as Project[];
  
    return {
      props: {
        //   projects,
        ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header']))
      }
    };
};

export default ProjectAdmin;
