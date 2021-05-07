import { getUserAccount } from "../../src/api/userrequests";
import Cookie from 'cookies';

export default async (req, res) => {
    const cookie = Cookie(req, res);
    const token = cookie.get("AUTH_TOKEN");
    const response = await getUserAccount(token);
    if (response.status === 200) {
        const data = await response.data;
        res.status(200).json(data);
    } else {
        res.status(500).json({ error: "Something went wrong" })
    }
}