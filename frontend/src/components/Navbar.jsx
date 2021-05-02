import React from 'react';
import Link from "next/link";
import { AppBar, Toolbar, Typography, IconButton } from "@material-ui/core";
import { Info } from "@material-ui/icons";
import styles from '../../styles/Navbar.module.css';

function Navbar() {
    return(
        <div className={styles.root}>
            <AppBar position="static" className={styles.appbar}>
                <Toolbar>
                    <Link href="/">
                        <Typography variant="h5" className={styles.title}>
                            Image Library
                        </Typography>
                    </Link>
                    <IconButton className={styles.menuButton}>
                        <Info />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar;

