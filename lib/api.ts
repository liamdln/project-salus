import axios from "axios";

export const fetcher = async (url: string) => {
    return await axios(url).then((res) => {
        return res.data;
    }).catch((err) => {
        console.log(err);
        throw new Error(`Could not fetch data: ${err}`);
    })
}