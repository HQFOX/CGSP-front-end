import React, { useEffect } from 'react';

import type { NextPage } from 'next';

import { Box, Divider } from '@mui/material';
import { useTranslation } from 'next-i18next/pages';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import { usePathname, useSearchParams } from 'next/navigation';

import { UpdateDTO } from '../api/model';
import { getAllUpdates } from '../api/update-controller/update-controller';
import { Title } from '../components/Title';
import { PageContainer } from '../components/pageContainer/PageContainer';
import Updates from '../components/updates/Update';

const UpdatePage: NextPage<{ updates: UpdateDTO[] }> = (data) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { t } = useTranslation(['common']);

	useEffect(() => {
		// Hash part after #
		const hash = window.location.hash;
		if (hash) {
			const id = hash.slice(1);
			const el = document.getElementById(id);
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	}, [pathname, searchParams]);

	return (
		<PageContainer>
			<Box sx={{ p: 2, pb: 4 }}>
				<Title variant="h5" component="h1" fontSize={24}>
					{t('updates')}
				</Title>
				<Divider />
			</Box>
			<Box sx={{ display: 'flex', justifyContent: 'center' }}>
				<Updates updates={data.updates} />
			</Box>
		</PageContainer>
	);
};
export const getServerSideProps = async (ctx: any) => {
	const updates = await getAllUpdates();
	return {
		props: {
			updates,
			...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header', 'homepage']))
		}
	};
};

export default UpdatePage;
