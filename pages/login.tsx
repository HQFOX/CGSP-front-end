import React from 'react';

import type { NextPage } from 'next';

import { useTranslation } from 'next-i18next/pages';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

import { LoginForm } from '../components/forms/LoginForm';
import { PageContainer } from '../components/pageContainer/PageContainer';

const Login: NextPage = () => {
	useTranslation(['projectpage', 'common']);

	return (
		<PageContainer>
			<LoginForm />
		</PageContainer>
	);
};

export const getServerSideProps = async (ctx: any) => {
	return {
		props: {
			...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header', 'projectpage']))
		}
	};
};

export default Login;
