import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
 
export type AuthenticationGuardProps = {
  children?: React.ReactElement;
  redirectPath?: string;
  guardType?: "authenticated" | "unauthenticated";
};
 
export const AuthenticationGuard = ({
	redirectPath = "/login",
	guardType = "authenticated",
	...props
}: AuthenticationGuardProps) => {
	const { user } = useContext(AuthContext);
	const isAllowed = guardType === "authenticated" ? !!user : !user;
 
	return (
		<ProtectedRoute
			redirectPath={redirectPath}
			isAllowed={isAllowed}
			{...props}
		/>
	);
};