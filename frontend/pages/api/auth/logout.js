import { logoutRequest } from "../../../src/api/auth";
import Cookie from 'cookies';

export default async (req, res) => {
    try {
        const cookie = new Cookie(req, res);
        const token = cookie.get("AUTH_TOKEN");
        const response = await logoutRequest(token);
        if (response.status === 204) {
            cookie.set("AUTH_TOKEN", token, {
                maxAge: -1
            })
            res.status(204).json({})
        } else {
            res.status(401).json({error: "User not authenticated"})
        }
    } catch {
        res.status(500).json({error: "Something went wrong"})
    }
}