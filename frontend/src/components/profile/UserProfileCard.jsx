import React, { useContext, useState } from 'react';
import { FormControlLabel, Switch, TextField, Typography } from "@material-ui/core";
import styles from '../../../styles/UserProfile.module.css';
import AlertSnackbar from "../AlertSnackbar";
import { AlertContext } from "../../providers/AlertProvider";
import { Edit } from "@material-ui/icons";
import { ImageContext } from "../../providers/ImageProvider";
import { updateUserSettings } from "../../api/userrequests";

const IMAGE_SERVER_URL = "http://localhost:8000";
const REACT_APP_URL = "http://localhost:3000";

function UserProfileCard({ profile, isAccount, username }) {
    const [edit, setEdit] = useState(false);
    const [biography, setBiography] = useState(profile.biography);
    const [image, setImage] = useState({
        file: null,
        src: ""
    })
    const [isPrivate, setIsPrivate] = useState(profile.private);
    const { openAlertSnackbar, openAlert, severity, message, alertTitle } = useContext(AlertContext);
    const { createImage } = useContext(ImageContext);

    const handleEdit = () => setEdit(true);

    const handleCancel = () => {
        setEdit(false);
        setBiography(profile.biography);
        setImage({
            file: null,
            src: ""
        })
    }

    const handlePrivateChange = () => {
        setIsPrivate(prevState => !prevState);
    }

    const setProfilePicture = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = (event) => {
                setImage({
                    file,
                    src: event.target.result
                })
            }
            fileReader.onerror = (event) => {
                openAlertSnackbar(
                    "error",
                    3000,
                    "Error reading file contents"
                )
            }
        }
    }

    const handleSave = async () => {
        let created = true;
        if (image.file) {
            const formData = new FormData();
            formData.append("image", image.file);
            formData.append("title", "Profile picture for " + username);
            formData.append("caption", "a profile picture");
            formData.append("owner", profile.owner);
            formData.append("profile_picture", "True");
            created = await createImage(formData, true);
        }
        if (created) {
            const data = {
                owner: profile.owner,
                biography,
                private: isPrivate
            }
            const response = await updateUserSettings(data);
            if (response.status !== 200) {
                openAlertSnackbar(
                    "error",
                    3000,
                    "Bad request, something went wrong"
                )
                handleCancel()
            } else {
                openAlertSnackbar(
                    "success",
                    3000,
                    "Profile updated successfully"
                )
            }
            setEdit(false);
        } else {
            handleCancel();
        }
    }

    const handleBiographyEdit = (event) => {
        setBiography(event.target.value);
    }

    const getProfilePicture = () => {
        if (image.src !== "") {
            return image.src;
        }
        if (profile.profile_picture) {
            return IMAGE_SERVER_URL + profile.profile_picture;
        }
        return "data:image/png;base64,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"
    }

    const handleShare = async () => {
        await navigator.clipboard.writeText(REACT_APP_URL + "/user/" + username);
        openAlertSnackbar(
            "success",
            3000,
            "Shareable link copied to clipboard!",
            "Show off the profile!"
        )
    }

    return (
        <>
            <div className={styles.card}>
                <div className={styles.imageWrapper}>
                    <img
                        className={edit ? styles.editProfilePicture : styles.profilePicture}
                        width={250}
                        height={250}
                        src={getProfilePicture()}
                        alt=""
                    />
                    {edit &&
                        <div className={styles.imageOverlay}>
                            <label className={styles.imageLabel}>
                                <Edit/>
                                Change Avatar
                                <input
                                    style={{display: 'none'}}
                                    type="file"
                                    onChange={setProfilePicture}
                                    accept="image/png, image/jpg, image/jpeg"
                                />
                            </label>
                        </div>
                    }
                </div>
                <Typography variant="h4" component="p" className={styles.username}>
                    {username}
                </Typography>
                {!edit ?
                    <Typography variant="body1" component="p">
                        {biography}
                    </Typography>
                    :
                    <>
                        <TextField
                            autoFocus
                            margin="dense"
                            variant="outlined"
                            value={biography}
                            onChange={handleBiographyEdit}
                            multiline
                            rows={4}
                            inputProps={{
                                maxLength: 300
                            }}
                        />
                        <Typography variant="subtitle2" component="p">
                            {biography.length} / 300
                        </Typography>
                        <FormControlLabel
                            onChange={handlePrivateChange}
                            control={
                                <Switch color="primary" checked={isPrivate} />
                            }
                            label={isPrivate ? "Make account public" : "Make account private"}
                        />
                    </>
                }
                {isAccount &&
                    <button className={styles.actions} onClick={handleEdit}>
                        Edit Profile
                    </button>
                }
                <button className={styles.actions} onClick={handleShare}>
                    Share Profile
                </button>
                {edit &&
                    <>
                        <button className={styles.actions} onClick={handleSave}>
                            Save
                        </button>
                        <button className={styles.actions} onClick={handleCancel}>
                            Cancel
                        </button>
                    </>
                }
            </div>
            <AlertSnackbar
                open={openAlert}
                message={message}
                severity={severity}
                title={alertTitle}
            />
        </>
    )
}

export default UserProfileCard;