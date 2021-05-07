import React from 'react';
import AuthProvider from "../../src/providers/AuthProvider";
import AlertProvider from "../../src/providers/AlertProvider";
import ImageProvider from "../../src/providers/ImageProvider";
import UserProfile from "../../src/components/profile/UserProfile";
import { getUserAccount } from "../../src/api/userrequests";
import AuthGate from "../../src/components/auth/AuthGate";
import cookie from 'cookie';

export async function getServerSideProps(context) {
    try {
        const { AUTH_TOKEN } = cookie.parse(context.req.headers.cookie);
        const response = await getUserAccount(AUTH_TOKEN);
        const { profile, imagedata } = await response.data;
        return {
            props: {
                profile: profile,
                images: imagedata,
                username: profile.username
            }
        }
    } catch {
        const profile = {};
        const imagedata = [];
        return {
            props: {
                profile: profile,
                images: imagedata,
                username: "User does not exist"
            }
        }
    }
}

function Account({ profile, images, username }) {
    return (
        <AuthProvider>
            <AlertProvider>
                <ImageProvider>
                    <AuthGate>
                        <UserProfile
                            profile={profile}
                            images={images}
                            username={username}
                            isAccount
                        />
                    </AuthGate>
                </ImageProvider>
            </AlertProvider>
        </AuthProvider>
    )
}

export default Account