/**
 * @file \src\app\admin\management\page.tsx
 * 
 * @fileoverview server component serving the page for admin management
 */

// Typical imports
import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { management } from "@/utils/devAuthed"
import ManagerClient from "@/components/Admin/Administrator/ManagerClient";
import { getFullModels } from "@/api/queries";
import { getAuthorizedUsers } from "@/api/queries";

// Main component
export default async function Page() {

    try {

        // Management AUTH redirect
        const session = await getServerSession(authOptions).catch((e) => {
            console.error(e.message)
            throw Error("Couldn't get session")
        })

        const email = session?.user?.email as string
        if (!management.includes(email)) return <h1>NOT AUTHORIZED</h1>

        // Get all 3D models
        const models = await getFullModels().catch((e) => {
            console.error(e.message)
            throw Error("Couldn't get 3D Models from database")
        })

        // Get authorized users
        const students = (await getAuthorizedUsers()).filter(user => user.role === 'student')

        // Decimal objects can't be passed directly to client components
        const stringifiedModels = JSON.stringify(models)

        // Typical client frame
        return (
            <>
                <Header pageRoute="collections" headerTitle='Management' />
                <main className="flex flex-col !min-h-[calc(100vh-177px)]">
                    <ManagerClient stringifiedModels={stringifiedModels} students={students}/>
                </main>
                <Foot />
            </>
        )
    }
    
    // Typical catch
    catch (e: any) {
        return (
            <>
                <Header pageRoute="collections" headerTitle='Management' />
                <main className="flex flex-col !min-h-[calc(100vh-177px)]">
                    `{`Fatal error: ${e.message}`}
                </main>
                <Foot />
            </>
        )
    }
}