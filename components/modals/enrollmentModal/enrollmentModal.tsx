import { Box, Button, Dialog, Grid, Stack, TextField, Typography } from "@mui/material"
import { useFormik } from "formik"
import { useTranslation } from "react-i18next";
import * as Yup from 'yup';


export type EnrollmentModalProps = {
    open:boolean,
    handleEnrollmentModalClose: () => void,
}




export const EnrollmentModal = ({open, handleEnrollmentModalClose}: EnrollmentModalProps) => {
    const { t, i18n } = useTranslation(['projectpage', 'common']);

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            telephoneNumber: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Obrigatório'),
            lastName: Yup.string().notRequired(),
            email: Yup.string().email('Invalid email address').required('Obrigatório'),
            telephoneNumber: Yup.string().notRequired(),
        }),
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <Dialog open={open} onClose={handleEnrollmentModalClose} maxWidth={false}>
            <Box onSubmit={formik.handleSubmit} component="form" width={700} height={800} display={"flex"} justifyContent="center" textAlign={"center"} p={4}>
                <Grid container columnSpacing={2}>
                    <Grid item xs={12} maxHeight={150} >
                        <Typography variant="h2" >{t('preEnroll')}</Typography>
                        <hr/>
                        <Typography variant="h4" >Nome do Projeto</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            id="first-name"
                            name="firstName" 
                            label={t('form.firstName')}
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                            fullWidth
                            
                            />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            id="last-name"
                            name="lastName" 
                            label={t('form.lastName')}
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                            fullWidth
                            
                            />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            id="email"
                            name="email" 
                            label={t('form.email')}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            fullWidth
                            
                            />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            id="telehponeNumber"
                            name="telephoneNumber" 
                            label={t('form.telephoneNumber')}
                            value={formik.values.telephoneNumber}
                            onChange={formik.handleChange}
                            error={formik.touched.telephoneNumber && Boolean(formik.errors.telephoneNumber)}
                            helperText={formik.touched.telephoneNumber && formik.errors.telephoneNumber}
                            fullWidth
                            />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant='contained' color='primary' value="submit" fullWidth>{t('form.submit')}</Button>
                        <Typography variant="body2" sx={{marginTop: "10px"}}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Dialog>
    )
}