export function checkEnvVariables() {
    return (
        process.env.MONGODB_URI &&
        process.env.MONGODB_NAME &&
        process.env.NEXTAUTH_SECRET &&
        process.env.NEXTAUTH_URL &&
        process.env.NODE_ENV &&
        process.env.PASSWORD_SALT_ROUNDS
    )
}