import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUserById } from "@/functions/server/queries"
import { getAuthorizedUsers } from "@/functions/server/queries"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function Page() {

    // admin AUTH redirect

    const session = await getServerSession(authOptions)
    const authorizedUsers = await getAuthorizedUsers()
    let email = session?.user?.email as string

    if (!authorizedUsers.some(user => user.email === email)) {
        return <h1>NOT AUTHORIZED</h1>
    }
    else {
        const user = await getUserById(session.user.id)
        if(user?.role === 'admin') redirect('/admin/management')
        else if(user?.role === 'student') redirect('/admin/student')
        else return <h1>NOT AUTHORIZED</h1>
    }
}