import dynamic from 'next/dynamic';

import { Loading } from '../loading';

export const DynamicEChartsWrapper = dynamic(
	() => import('./EChartsWrapper').then((m) => m.EChartsWrapper),
	{
		ssr: false,
		loading: () => <Loading />
	}
);
