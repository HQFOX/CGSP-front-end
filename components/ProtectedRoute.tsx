import { useRouter } from "next/navigation";
import * as React from "react";
 
export type ProtectedRouteProps = { children?: React.ReactElement } & {
  isAllowed: boolean;
  redirectPath?: string;
};
 
export const ProtectedRoute = ({
	isAllowed,
	children = <></>,
	redirectPath = "/",
}: ProtectedRouteProps) => {
	const router = useRouter();
    
	React.useEffect( () => {

		if (!isAllowed) {
			router.replace(redirectPath);
		}

	},[]);
 
	return isAllowed ? children : <></>;
};