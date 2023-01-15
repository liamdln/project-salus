export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const fetcher = (url: string) => fetch(url).then(r => r.json())