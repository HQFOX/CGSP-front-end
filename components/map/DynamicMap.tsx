import dynamic from 'next/dynamic';

import { Loading } from '../loading';

export const DynamicMap = dynamic(() => import('./Map'), {
	ssr: false,
	loading: () => <Loading />
});
