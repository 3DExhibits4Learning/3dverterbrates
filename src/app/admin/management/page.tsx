/**
 * @file \src\app\admin\management\page.tsx
 * 
 * @fileoverview server component serving the page for admin management
 * 
 * @todo update management auth
 */

// Typical imports
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { fullModel, studentsAndAssignments } from "@/api/interface";
import { getFullModels, getStudentsAndAssignments } from "@/api/queries";
import { authorized } from "@prisma/client";
import { getAuthorizedUsers } from "@/api/queries";

// Default imports
import ManagerClient from "@/components/Admin/Administrator/ManagerClient";
import serverAsyncErrorHandler from "@/functions/server/serverError/serverAsyncError";
import createStudentsAssignmentsAndModels from "@/functions/client/managerClient/createStudentsAssignmentsAndModels";
import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";

// Main component
export default async function Page() {

    try {

        // Get session
        const session = await getServerSession(authOptions).catch((e) => serverAsyncErrorHandler(e.message, "Couldn't get session"))

        // Get authorized users
        const authorizedUsers = await getAuthorizedUsers().catch((e) => serverAsyncErrorHandler(e.message, "Couldn't get authorized users")) as authorized[]

        // Authorized user redirect
        const email = session?.user?.email as string
        if (!authorizedUsers.find(user => user.email === email && user.role === 'admin')) return <h1>NOT AUTHORIZED</h1>

        // Get all 3D models
        const models = await getFullModels().catch(e => serverAsyncErrorHandler(e.message, "Couldn't get 3D Models from database")) as fullModel[]

        // Stringified model filters (decimal objects (which are included in models table) can't be passed directly to client)
        const modelsString = JSON.stringify(models)
        const modelsWithThumbnails = JSON.stringify(models.filter(model => model.thumbnail !== null))
        const modelsNeedingThumbnails = JSON.stringify(models.filter(model => model.thumbnail === null && model.base_model === true))
        const unannotatedModels = JSON.stringify(models.filter(model => !model.annotated))

        // Get students and assignments
        const students = await getStudentsAndAssignments().catch(e => serverAsyncErrorHandler(e.message, "Couldn't get authorized students from database")) as studentsAndAssignments[]

        // Create custom data object for admin "current assignments" table
        const studentsAssignmentsAndModels = JSON.stringify(createStudentsAssignmentsAndModels(students, models))

        // Typical client return
        return (
            <>
                <Header pageRoute="collections" headerTitle='Management' />
                <main className="flex flex-col !min-h-[calc(100vh-177px)]">
                    <ManagerClient
                        models={modelsString}
                        modelsWithThumbnails={modelsWithThumbnails}
                        modelsNeedingThumbnails={modelsNeedingThumbnails}
                        unannotatedModels={unannotatedModels}
                        studentsAssignmentsAndModels={studentsAssignmentsAndModels}
                        admin={true}
                    />
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
                    {`Critical error: ${e.message}`}
                </main>
                <Foot />
            </>
        )
    }
}