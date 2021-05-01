import React, { useState } from 'react';
import SearchBar from "./SearchBar";
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import styles from '../../styles/Header.module.css';
import ImageProvider from "../providers/ImageProvider";
import CreateImageDialog from "./images/CreateImageDialog";

function HeaderContent() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <CreateImageDialog open={open} handleClose={handleClose} />
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

const Header = () => {
    return (
        <ImageProvider>
            <HeaderContent />
        </ImageProvider>
    )
};

export default Header;