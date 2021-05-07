import React from 'react';
import AuthProvider from "../../src/providers/AuthProvider";
import AlertProvider from "../../src/providers/AlertProvider";
import ImageProvider from "../../src/providers/ImageProvider";
import UserProfile from "../../src/components/profile/UserProfile";
import { getUserProfileByUsername } from "../../src/api/userrequests";

export async function getServerSideProps(context) {
    const { username } = context.query;
    const response = await getUserProfileByUsername(username.substring(1));
    let profile, images;
    if (response.status === 200) {
        const data = await response.data;
        profile = data.profile;
        profile["notfound"] = false;
        images = data.images;
    } else {
        profile = {
            likes_visible: false,
            private: false,
            profile_picture: null,
            notfound: true
        };
        images = []
    }

    return {
        props: {
            profile,
            images,
            username
        }
    }

}

function User({ profile, images, username }) {
    return (
        <AuthProvider>
            <AlertProvider>
                <ImageProvider>
                    <UserProfile profile={profile} images={images} username={username} />
                </ImageProvider>
            </AlertProvider>
        </AuthProvider>
    )
}

export default User;