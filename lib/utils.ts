export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        const errRes = await res.json();
        const error = new Error(`Could not fetch data: ${JSON.stringify(errRes)}.`);
        throw error;
    }
    return res.json();
}