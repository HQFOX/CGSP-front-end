import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Faq: NextPage = () => {
  return <h2> hello world from FAQ page </h2>;
};

export const getStaticProps = async (ctx: any) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale, ['common', 'footer']))
  }
});

export default Faq;
