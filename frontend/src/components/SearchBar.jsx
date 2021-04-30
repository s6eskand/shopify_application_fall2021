import React, { useContext } from 'react';
import { Paper, InputBase, IconButton, Divider, Tooltip, withStyles } from "@material-ui/core";
import { Search, ImageSearch } from "@material-ui/icons";
import styles from '../../styles/SearchBar.module.css';
import { ImageContext } from "../providers/ImageProvider";

const LargeTextTooltip = withStyles({
    tooltip: {
        fontSize: "14px"
    }
})(Tooltip)

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
            <LargeTextTooltip
                title="Search images through an uploaded image. File upload and remote URL supported"
                arrow
            >
                <IconButton className={styles.iconButton}>
                    <ImageSearch />
                </IconButton>
            </LargeTextTooltip>
        </Paper>
    )
}

export default SearchBar;