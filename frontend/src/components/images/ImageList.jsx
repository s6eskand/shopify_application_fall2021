import React, { useContext, useEffect, useState } from "react";
import { ImageContext } from "../../providers/ImageProvider";
import ImageCard from "./ImageCard";
import styles from '../../../styles/ImageList.module.css';
import { Divider, Typography, LinearProgress, Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import EmptyImageList from "./EmptyImageList";
import CreateImageDialog from "./CreateImageDialog";

function ImageList({ images, title, profile = null, isAccount = false, isImageSearch = false }) {
    const { imageList, search, imagesLoading, setOpenDialog, openDialog } = useContext(ImageContext);
    const [filteredImages, setFilteredImages] = useState([]);

    useEffect(() => {
        if (isImageSearch) {
            setFilteredImages([...imageList])
        } else {
            setFilteredImages([...images])
        }
    }, [imageList])

    const handleOpen = () => setOpenDialog(true);
    const handleClose = () => setOpenDialog(false);

    const isSearch = search.length > 0;

    return (
        <>
            <CreateImageDialog open={openDialog} handleClose={handleClose} />
            <div className={styles.imagelistHeader}>
                <Typography variant="h5" className={styles.title}>
                    {title}
                </Typography>
                {isAccount &&
                    <Button
                        variant="outlined"
                        className={styles.button}
                        onClick={handleOpen}
                        startIcon={<Add/>}
                    >
                        New
                    </Button>
                }
            </div>
            <Divider className={styles.divider} />
            {imagesLoading && <LinearProgress />}
            { filteredImages.length > 0 || imagesLoading ?
                <div className={styles.imagelist}>
                    {filteredImages.map((image, idx) => (
                        <div className={styles.image} key={idx}>
                            <ImageCard
                                id={image.pk}
                                title={image.title}
                                caption={image.caption}
                                img={image.image.full_size}
                                likes={image.likes}
                                shares={image.shares}
                                author={profile ? profile : image.author}
                                isPrivate={image.private}
                            />
                        </div>
                    ))}
                </div>
                :
                <EmptyImageList
                    text={isSearch ?
                        "Nothing matches your search! Try again or create your missing image!"
                        :
                        "Woah! Nothing here yet!"
                    }
                    src={isSearch ? "/empty_page.png" : "/empty_page2.png"}
                />
            }
        </>
    )
}

export default ImageList;