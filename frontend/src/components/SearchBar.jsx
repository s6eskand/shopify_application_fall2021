import React, { useContext } from 'react';
import { Paper, InputBase, IconButton, Divider } from "@material-ui/core";
import { Search, Tune } from "@material-ui/icons";
import styles from '../../styles/SearchBar.module.css';
import ImageProvider, { ImageContext } from "../providers/ImageProvider";

function SearchBar() {
    const { search, setSearch } = useContext(ImageContext);

    const handleChange = (event) => {
        event.preventDefault();
        setSearch(event.target.value);
    }

    return (
        <Paper className={styles.root}>
            <div className={styles.iconButton}>
                <Search />
            </div>
            <InputBase
                value={search}
                onChange={handleChange}
                className={styles.input}
                placeholder="Search for images"
            />
            <Divider orientation="vertical" className={styles.divider} />
            <IconButton className={styles.iconButton}>
                <Tune />
            </IconButton>
        </Paper>
    )
}

export default () => {
    return (
        <ImageProvider>
            <SearchBar />
        </ImageProvider>
    )
};