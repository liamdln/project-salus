export type Report = {
    _id?: any,
    id?: number, // remove
    type: string,
    severity: number,
    description: string,
    author: string,
    status: number,
    location: number[]
}