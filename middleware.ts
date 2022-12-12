import { withAuth } from "next-auth/middleware"

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
// From https://github.com/nextauthjs/next-auth-example/blob/main/middleware.ts
// Adapted by Liam P
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
        console.log(token);
        console.log(req)
        return !!token;
    },
  },
})

export const config = { matcher: ["/dashboard/:path*"] }