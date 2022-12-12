import { useSession } from "next-auth/react";

export async function checkSession(sleepTIme: number = 2000): Promise<Boolean> {
    const session = useSession();
    if (session.status === "loading") {
        await new Promise(r => setTimeout(r, sleepTIme));
    }
    return session.status === "authenticated";
}