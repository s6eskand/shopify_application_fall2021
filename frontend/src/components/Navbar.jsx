import React, { useContext } from 'react';
import Link from "next/link";
import { AppBar, Toolbar, Typography, IconButton, Tooltip, Button } from "@material-ui/core";
import { ExitToApp, Info, AccountCircle } from "@material-ui/icons";
import styles from '../../styles/Navbar.module.css';
import { AuthContext } from "../providers/AuthProvider";
import { useRouter } from "next/router";

function Navbar() {
    const { logout, isAuthenticated } = useContext(AuthContext);
    const router = useRouter();

    const handleLogin = async () => {
        await router.push("/login");
    }

    const handleAccount = async () => {
        await router.push("/user/profile");
    }

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
                    {isAuthenticated ?
                        <>
                            <Tooltip title="Your Profile" arrow>
                                <IconButton className={styles.menuButton} onClick={handleAccount}>
                                    <AccountCircle/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Logout" arrow>
                                <IconButton className={styles.menuButton} onClick={logout}>
                                <ExitToApp />
                                </IconButton>
                            </Tooltip>
                        </>
                        :
                        <Button color="primary" variant="outlined" onClick={handleLogin}>
                            Login
                        </Button>
                    }
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar;

