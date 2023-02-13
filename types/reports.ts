export type Report = {
    _id?: any,
    type: string,
    severity: number,
    description: string,
    status: number,
    lat: number,
    lng: number,
    date: Date,
    authorId: String,
}

// Severity:
// 0: None
// 1: Danger to operations
// 2: Danger to life

// Status:
// 0: Open
// 1: In review
// 2: Closed
// 3: Archived
// 4: Revoked