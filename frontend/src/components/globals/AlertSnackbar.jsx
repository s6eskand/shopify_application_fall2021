import React from 'react';
import { Snackbar } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

function AlertSnackbar({ severity, message, open, title }) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={title === "" ? 5000 : 3000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert severity={severity}>
                { title === "" && <AlertTitle>{title}</AlertTitle> }
                {message}
            </Alert>
        </Snackbar>
    )
}

export default AlertSnackbar;