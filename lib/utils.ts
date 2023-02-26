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

export function shortenString(message: string, messageLimit: number) {
    if (message.length > messageLimit) {
        if (message.substring(messageLimit - 1, messageLimit) === " ") {
            const newMessage = message.substring(0, messageLimit - 1);
            return newMessage + "...";
        }
        return message.substring(0, messageLimit) + "...";
    } else {
        return message;
    }
}

export function obfuscateString(string: string, ignoredChars?: string[], returnCharacter?: string) {
    const obfuscatedString = [];
    for (const letter of string.split("")) {
        if (ignoredChars && ignoredChars.includes(letter)) {
            obfuscatedString.push(letter);
        } else {
            obfuscatedString.push("*");
        }
    }
    return obfuscatedString;
}