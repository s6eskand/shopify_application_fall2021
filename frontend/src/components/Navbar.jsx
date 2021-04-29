import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from "@material-ui/core";
import { Info } from "@material-ui/icons";
import styles from '../../styles/Navbar.module.css';

function Navbar() {
    return(
        <div className={styles.root}>
            <AppBar position="static" className={styles.appbar}>
                <Toolbar>
                    <Typography variant="h4" className={styles.title}>
                        Image Library
                    </Typography>
                    <IconButton className={styles.menuButton}>
                        <Info />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar;

