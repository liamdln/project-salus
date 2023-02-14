export type Report = {
    _id?: any,
    type: string,
    severity: number,
    description: string,
    status: number,
    lat: number,
    lng: number,
    date: Date,
    author: ReportAuthor,
    comments?: Comment[]
}

export type Comment = {
    _id?: any,
    author: ReportAuthor,
    content: string,
    date: Date
}

export type ReportAuthor = {
    name: string
    id?: string
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