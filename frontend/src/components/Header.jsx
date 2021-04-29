import React from 'react';
import SearchBar from "./SearchBar";
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import styles from '../../styles/Header.module.css';

function Header() {
    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <SearchBar />
                    <Button variant="outlined" className={styles.button}>
                        <Add /> New
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Header;