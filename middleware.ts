import { withAuth } from "next-auth/middleware"

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
// From https://github.com/nextauthjs/next-auth-example/blob/main/middleware.ts
// Adapted by Liam P
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
        return !!token && token.userEnabled;
    },
  },
})

export const config = { matcher: ["/dashboard", "/dashboard/:path*", "/user/:path*", "/restricted/:path*"] }