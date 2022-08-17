import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Projects: NextPage = () => {
  return <h2> hello world from projects page </h2>;
};

export const getStaticProps = async (ctx: any) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale, ['common', 'footer']))
  }
});

export default Projects;
