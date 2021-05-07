import { loginRequest } from "../../../src/api/auth";
import Cookies from 'cookies';

export default async (req, res) => {
    try {
        const response = await loginRequest(req.body);
        const cookies = new Cookies(req, res);
        cookies.set("AUTH_TOKEN", response.token)
        res.status(200).json(response);
    } catch {
        res.status(401).json({ error: "Invalid credentials, try again." });
    }
}
