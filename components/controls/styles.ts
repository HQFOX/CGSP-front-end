import { css } from "@emotion/css";
import theme from "../../theme";

export const styles = {
    input: css({
        fontSize: '1rem',
        border: 0,
        boxShadow: 'none',
        ':focus': {
            outline: 'none'
        }
    }),
    container: css({
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        border: '1px solid rgb(237, 237, 237)',
        boxShadow: "unset"
    })
}