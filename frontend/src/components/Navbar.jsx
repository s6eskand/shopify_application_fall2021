import React, { useContext } from 'react';
import Link from "next/link";
import { AppBar, Toolbar, Typography, IconButton, Tooltip } from "@material-ui/core";
import { ExitToApp, Info, AccountCircle } from "@material-ui/icons";
import styles from '../../styles/Navbar.module.css';
import { AuthContext } from "../providers/AuthProvider";

function Navbar() {
    const { logout } = useContext(AuthContext);

    return(
        <div className={styles.root}>
            <AppBar position="static" className={styles.appbar}>
                <Toolbar>
                    <Link href="/">
                        <Typography variant="h5" className={styles.title}>
                            Image Library
                        </Typography>
                    </Link>
                    <Tooltip title="About" arrow>
                        <IconButton className={styles.menuButton}>
                            <Info />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Your Profile" arrow>
                        <IconButton className={styles.menuButton}>
                            <AccountCircle />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Logout" arrow>
                        <IconButton className={styles.menuButton} onClick={logout}>
                            <ExitToApp />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar;

