import React, { useContext } from 'react';
import { Paper, InputBase, IconButton, Divider, Tooltip, withStyles } from "@material-ui/core";
import { Search, ImageSearch } from "@material-ui/icons";
import styles from '../../../styles/SearchBar.module.css';
import { ImageContext } from "../../providers/ImageProvider";
import { useRouter } from "next/router";

const LargeTextTooltip = withStyles({
    tooltip: {
        fontSize: "14px"
    }
})(Tooltip)

function SearchBar() {
    const { search, handleSearch, setShowImageSearch } = useContext(ImageContext);
    const router = useRouter();

    const handleChange = (event) => {
        const val = event.target.value;
        handleSearch(val);
    }

    const handleImageSearch = () => {
        setShowImageSearch(prevState => !prevState)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await router.push(`/search?query=${search}`)
    }

    return (
        <Paper className={styles.root} component="form" onSubmit={handleSubmit}>
            <div className={styles.iconButton}>
                <Search />
            </div>
            <InputBase
                value={search}
                onChange={handleChange}
                className={styles.input}
                placeholder="Search by @username, #hashtag, or keywords"
            />
            <Divider orientation="vertical" className={styles.divider} />
            <LargeTextTooltip
                title="Search images through an uploaded image"
                arrow
            >
                <IconButton className={styles.iconButton} onClick={handleImageSearch}>
                    <ImageSearch />
                </IconButton>
            </LargeTextTooltip>
        </Paper>
    )
}

export default SearchBar;