import React from "react";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Faq: NextPage = () => {
	return <h2> hello world from FAQ page </h2>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps = async (ctx: any) => ({
	props: {
		...(await serverSideTranslations(ctx.locale, ["common", "footer", "header"]))
	}
});

export default Faq;
