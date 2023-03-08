
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
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
            obfuscatedString.push(returnCharacter || "*");
        }
    }
    return obfuscatedString;
}

