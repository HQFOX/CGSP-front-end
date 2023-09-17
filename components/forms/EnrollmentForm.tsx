import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {  useFormik } from "formik";
import { Box, Grid, Grow, Stack, TextField, Typography, styled } from "@mui/material";
import theme from "../../theme";
import { CheckCircle, ErrorOutline } from "@mui/icons-material";
import * as Yup from "yup";
import { StyledButton } from "../Button";

export const SuccessMessage = ({email}:{email: string}) => {
	const { t } = useTranslation(["projectpage"]);
	return (
		<Grow in={true}>
			<Stack alignContent={"center"} pt={6}>
				<CheckCircle color={"success"} style={{fontSize: "120px", margin: "auto"}}/>
				<Typography variant="h5">{t("successMessage.success")}</Typography>
				<Typography variant="subtitle1">{t("successMessage.confirmation", {email: email})}</Typography>
				<Typography variant="subtitle1">{t("successMessage.contactSoon")}</Typography>
			</Stack>
		</Grow>
	);
};

export const ErrorMessage = () => {
	const { t } = useTranslation(["projectpage"]);

	return (
		<Grow in={true}>
			<Stack alignContent={"center"} pt={6}>
				<ErrorOutline color={"error"} style={{fontSize: "120px"}} />
				<Typography variant="h5">{t("errorMessage.error")}</Typography>
				<Typography variant="subtitle1">{t("errorMessage.reason")}</Typography>
				<Typography variant="subtitle1">{t("errorMessage.trySoon")}</Typography>
			</Stack>
		</Grow>
	);
};

const StyledBox = styled(Box)({
	flexDirection: "column",
	textAlign: "center",
	display: "flex",
	width: 700,
	padding: 90,
	[theme.breakpoints.down("md")]: {
		width: "auto",
		padding: 40
	}
});

export const EnrollmentForm = ({project} : {project: Project}) => {
	const { t } = useTranslation(["projectpage", "common"]);
	const [showForm, setShowForm] = useState<boolean>(true);
	const [successMessage, setSuccessMessage] = useState<boolean>(false);
	const [errorMessage] = useState<boolean>(false);

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
			telephoneNumber: "",
		},
		validationSchema: Yup.object({
			firstName: Yup.string().required("Obrigatório"),
			lastName: Yup.string().notRequired(),
			email: Yup.string().email("Invalid email address").required("Obrigatório"),
			telephoneNumber: Yup.string().notRequired(),
		}),
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		onSubmit: values => {
			// alert(JSON.stringify(values, null, 2));
			setSuccessMessage(true);
			setShowForm(false);
			// setErrorMessage(true)
		},
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<StyledBox>
				<Grid container columnSpacing={2}>
					<Grid item xs={12} maxHeight={150} >
						<Typography variant="h2" >{t("preEnroll")}</Typography>
						<hr/>
						<Typography variant="h4" >{project.title}</Typography>
					</Grid>
				</Grid>
				{showForm && 
            <Grid container rowSpacing={2} columnSpacing={2} mt={4}>
            	<Grid item xs={12} md={6}>
            		<TextField
            			id="first-name"
            			name="firstName"
            			label={t("form.firstName")}
            			value={formik.values.firstName}
            			onChange={formik.handleChange}
            			error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            			helperText={formik.touched.firstName && formik.errors.firstName}
            			fullWidth />
            	</Grid>
            	<Grid item xs={12} md={6}>
            		<TextField
            			id="last-name"
            			name="lastName"
            			label={t("form.lastName")}
            			value={formik.values.lastName}
            			onChange={formik.handleChange}
            			error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            			helperText={formik.touched.lastName && formik.errors.lastName}
            			fullWidth />
            	</Grid>
            	<Grid item xs={12}>
            		<TextField
            			id="email"
            			name="email"
            			label={t("form.email")}
            			value={formik.values.email}
            			onChange={formik.handleChange}
            			error={formik.touched.email && Boolean(formik.errors.email)}
            			helperText={formik.touched.email && formik.errors.email}
            			fullWidth />
            	</Grid>
            	<Grid item xs={12}>
            		<TextField
            			id="telehponeNumber"
            			name="telephoneNumber"
            			label={t("form.telephoneNumber")}
            			value={formik.values.telephoneNumber}
            			onChange={formik.handleChange}
            			error={formik.touched.telephoneNumber && Boolean(formik.errors.telephoneNumber)}
            			helperText={formik.touched.telephoneNumber && formik.errors.telephoneNumber}
            			fullWidth />
            	</Grid>
            	<Grid item xs={12}>
            		<StyledButton type="submit" variant='contained' color='primary' value="submit" fullWidth>{t("form.submit")}</StyledButton>
            		<Typography variant="body2" sx={{ marginTop: "10px" }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            		</Typography>
            	</Grid>
            </Grid>  
				}
				<>
					{errorMessage && !showForm && <ErrorMessage />}
					{successMessage && !showForm && <SuccessMessage email={formik.values.email} />}                
				</>
			</StyledBox>
		</form>
	);
};