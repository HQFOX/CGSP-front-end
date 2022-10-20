import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const History: NextPage = () => {
  return <h2> hello world from History page </h2>;
};

export const getStaticProps = async (ctx: any) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header']))
  }
});

export default History;
