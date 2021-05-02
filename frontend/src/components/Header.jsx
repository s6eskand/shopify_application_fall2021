import React, { useContext } from 'react';
import SearchBar from "./SearchBar";
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import styles from '../../styles/Header.module.css';
import ImageProvider, { ImageContext } from "../providers/ImageProvider";
import AlertProvider from "../providers/AlertProvider";
import CreateImageDialog from "./images/CreateImageDialog";

function Header() {
    const { openDialog, setOpenDialog } = useContext(ImageContext);

    const handleOpen = () => setOpenDialog(true);
    const handleClose = () => setOpenDialog(false);

    return (
        <>
            <CreateImageDialog open={openDialog} handleClose={handleClose} />
            <div className={styles.root}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <SearchBar />
                        <Button variant="outlined" className={styles.button} onClick={handleOpen}>
                            <Add /> New
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;