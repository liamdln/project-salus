import axios from "axios";

// power of roles.
// if roles are added, be sure to give them a power here.
export enum UserPower {
    MEMBER = 10,
    MANAGER = 50,
    ADMIN = 100
}

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const fetcher = async (url: string) => {
    return await axios(url).then((res) => {
        return res.data;
    }).catch((err) => {
        console.log(err);
        throw new Error(`Could not fetch data: ${err}`);
    })
}