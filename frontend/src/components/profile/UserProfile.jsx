import React from 'react';
import Head from "next/head";
import Navbar from "../Navbar";
import Header from "../Header";
import UserProfileCard from "./UserProfileCard";
import styles from '../../../styles/UserProfile.module.css';
import ImageList from "../images/ImageList";
import EmptyImageList from "../images/EmptyImageList";

function UserProfile({ profile, images, username, isAccount = false }) {

    return (
        <>
            <Navbar />
            <Head>
                <title>User - {username}</title>
                <meta
                    name="description"
                    content={`${username}'s image repository`}
                />
                <meta
                    property="og:title"
                    content={username}
                />
                <meta
                    property="og:description"
                    content={`${username}'s image repository`}
                />
                <meta
                    property="og:image"
                    content={profile.profile_picture}
                />
            </Head>
            <Header />
            <div className={styles.container}>
                <div className={styles.main}>
                    <UserProfileCard profile={profile} username={username} isAccount={isAccount} />
                    <div className={styles.imagelist}>
                        {profile.private && !isAccount ?
                            <EmptyImageList
                                text="This account is private"
                                src="/empty_page.png"
                            />
                            :
                            <ImageList
                                isAccount={isAccount}
                                images={images}
                                title={isAccount ? "Your photos" : "Public photos"} profile={profile}
                            />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfile;