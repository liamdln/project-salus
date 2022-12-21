import "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    name: string,
    email: string
  }
}