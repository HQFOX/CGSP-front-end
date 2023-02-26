import { Circle } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";

export const UpdateStepper = () => {


    return (
        <Grid container>
            <Grid item xs={6}>

            </Grid>
            <Grid item xs={6} display={"flex"} height={40}>
                <Circle color="primary" style={{position: "relative", left: "-12px"}}/>
                <Typography component="span" textAlign="center" paddingLeft={"5px"}>Primeira frase de atualização</Typography>
            </Grid>
            <Grid item xs={6} height={100} borderRight={"1px solid black"}>

            </Grid>
            <Grid item xs={6} height={100}>

            </Grid>
            <Grid item xs={6} display={"flex"} justifyContent="right" height={40} marginTop={"10px"}>
                <Typography component="span" textAlign="center" paddingRight={"5px"}>Segunda grande frase de atualização</Typography>
                <Circle color="primary" style={{position: "relative", right: "-12px"}}/>
            </Grid>
            <Grid item xs={6}>
                
                
            </Grid>
            <Grid item xs={6} height={100} borderRight={"1px solid black"}>

            </Grid>
            <Grid item xs={6} height={100}>

            </Grid>
        </Grid>
    )
};