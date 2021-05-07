import { registerRequest } from "../../../src/api/auth";
import Cookies from "cookies";

export default async (req, res) => {
    try {
        const response = await registerRequest(req.body);
        const cookies = new Cookies(req, res);
        cookies.set("AUTH_TOKEN", response.token, {
            maxAge: 2147483647
        })
        res.status(200).json(response);
    } catch {
        res.status(400).json({ error: "Something went wrong" });
    }
}