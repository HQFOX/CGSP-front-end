import React, { useContext, useState } from "react";

import { Container, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import { CheckCircle, Close } from "@mui/icons-material";

import { useFormik } from "formik";
import * as Yup from "yup";

import Cookies from "js-cookie";

import { StyledButton } from "../Button";
import { Loading } from "../loading/Loading";
import { AuthContext } from "../AuthContext";
import { useRouter } from "next/router";
import { useFetch } from "./utils";

const postLogin = async (values: { username: string; password: string; }) => {

	const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/generateToken`;

	const res = await useFetch("POST", endpoint, values).then( (response) => {
		if(response.ok){
			return response.text();
		}
		else {
			throw new Error("Error Login" + response);
		}
	}).catch( error => {
		console.log(error);
	});

	return res;
};

const getUser = async (username: string) => {

	const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/user/${username}`;

	const res = await useFetch("GET",endpoint, null , true).then( (response) => {
		if(response.ok){
			return response.json();
		}
		else {
			throw new Error("Error Login" + response);
		}

	}).catch( error => {
		console.log(error);
	});

	if(res)
		return res as User;

	return undefined;
};

export const LoginForm = () => {

	const router = useRouter();

	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

	const { setUser: setCurrentUser } = useContext(AuthContext);

	const formik = useFormik({
		initialValues: {
			username: "Henrique",
			password: "123",
		},
		validationSchema: Yup.object({
			username: Yup.string().required("Obrigatório"),
			password: Yup.string().required("Obrigatório")
		}),
		onSubmit: async (values) => {
			setSubmitting(true);
			await postLogin(values).then( async response => {

				Cookies.remove("token");
				response && Cookies.set("token", response, { expires: 2 });
				const user = await getUser(values.username);

				if(user){
					setCurrentUser(user);
					setSuccess(true);
					router.push("admin/projects");
				}
				else{
					setSuccess(false);
				}
			});
			setSubmitting(false);
		}
	});

	return (
		<Paper sx={{ mt: 4, maxWidth: "40dvw"}}>
			<Container>
				<Grid container pt={2} >
					<Grid item mt={4}>
						<Typography variant={"h5"}>{"Login"}</Typography>
					</Grid>
					<Grid item ml="auto">
						<IconButton>
							<Close />
						</IconButton>
					</Grid>
				</Grid>
				<form onSubmit={formik.handleSubmit}>
					<Grid container rowSpacing={4} pb={2} pt={4}>
						<Grid item xs={12}>
							<TextField 
								id="username" 
								name="username" 
								label={"Nome de Utilizador"} 
								value={formik.values.username}
								onChange={formik.handleChange}
								error={formik.touched.username && Boolean(formik.errors.username)}
								helperText={formik.touched.username && formik.errors.username}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField 
								id="password" 
								name="password" 
								label={"Password"} 
								type="password"
								value={formik.values.password} 
								onChange={formik.handleChange}
								error={formik.touched.password && Boolean(formik.errors.password)}
								helperText={formik.touched.password && formik.errors.password}
								fullWidth
								hidden/>
						</Grid>
						<Grid item>
							{submitting ? <Loading /> : success ?  <CheckCircle color={"success"} style={{ fontSize: "50px" }} />: <></>}
						</Grid>
						<Grid item ml="auto">
							<StyledButton type="submit" variant="contained" color="primary" value="submit" fullWidth>
								{"Log in"}
							</StyledButton>
						</Grid>
					</Grid>
				</form>
			</Container>
		</Paper>        
	);
};