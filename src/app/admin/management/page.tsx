/**
 * @file \src\app\admin\management\page.tsx
 * 
 * @fileoverview server component serving the page for admin management
 * 
 * @todo update management auth
 */

// Typical imports
import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { management } from "@/functions/utils/devAuthed"
import ManagerClient from "@/components/Admin/Administrator/ManagerClient";
import { getFullModels } from "@/api/queries";
import { getStudentsAndAssignments } from "@/api/queries";
import { getAssignments, getModelsWithAssignments } from "@/api/queries";
import serverAsyncErrorHandler from "@/functions/serverError/serverAsyncError";
import { fullModel, studentsAndAssignments } from "@/api/types";
import { assignment } from "@prisma/client";
import createStudentsAssignmentsAndModels from "@/functions/managerClient/createStudentsAssignmentsAndModels";

// Main component
export default async function Page() {

    try {

        // Get session
        const session = await getServerSession(authOptions).catch((e) => serverAsyncErrorHandler(e.message, "Couldn't get session"))

        // Management auth redirect
        const email = session?.user?.email as string
        if (!management.includes(email)) return <h1>NOT AUTHORIZED</h1>

        // Get all 3D models
        const models = await getFullModels().catch(e => serverAsyncErrorHandler(e.message, "Couldn't get 3D Models from database")) as fullModel[]

        // Stringified model filters (decimal objects (which are included in models table) can't be passed directly to client)
        const modelsString = JSON.stringify(models)
        const modelsWithThumbnails = JSON.stringify(models.filter(model => model.thumbnail !== null))
        const modelsNeedingThumbnails = JSON.stringify(models.filter(model => model.thumbnail === null && model.base_model === true))
        const unannotatedModels = JSON.stringify(models.filter(model => !model.annotated))

        // Get students and assignments
        const students = await getStudentsAndAssignments().catch(e => serverAsyncErrorHandler(e.message, "Couldn't get authorized students from database")) as studentsAndAssignments[]

        // Get assignents (deprecated)
        const assignments = await getAssignments().catch(e => serverAsyncErrorHandler(e.message, "Couldn't get authorized students from database")) as assignment[]

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