// TODO: Update get getModelsToAnnotate to be filtered by userId

import Header from "@/components/Header/Header"
import Foot from "@/components/Shared/Foot"
import AnnotationClient from "@/components/Admin/AnnotationClient"
import { getAllAnnotationModels, getAssignments, getModelsToAnnotate } from "@/api/queries"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getAuthorizedUsers } from "@/api/queries"
import serverAsyncErrorHandler from "@/functions/server/serverError/serverAsyncError"
import { model, assignment } from "@prisma/client"

export default async function Page() {

    const session = await getServerSession(authOptions)
    const authorizedUsers = await getAuthorizedUsers()
    let email = session?.user?.email as string

    if (!authorizedUsers.some(user => user.email === email)) {
        return <h1>NOT AUTHORIZED</h1>
    }

    // Get models to annotate, annotation models (models used as annotations themselves), and assignments
    const modelsToAnnotate = await getModelsToAnnotate().catch(e => serverAsyncErrorHandler(e.message, "Counld't get models to annotate")) as model[]
    const annotationModels = await getAllAnnotationModels().catch(e => serverAsyncErrorHandler(e.message, "Counld't get annotation models")) as model[]
    const assignments = await getAssignments().catch(e => serverAsyncErrorHandler(e.message, "Counld't get annotation models")) as assignment[]

    // Filter assigned models
    const studentAssignmentUids = assignments.filter(assignment => assignment.email === email).map(assignment => assignment.uid)
    const assignedModels = modelsToAnnotate.filter(model => studentAssignmentUids.includes(model.uid))

    return (
        <>
            <Header pageRoute="collections" headerTitle="Botany Admin" />
            <main className="w-full min-h-[calc(100vh-177px)] h-[calc(100vh-177px)] overflow-y-auto">
                <AnnotationClient modelsToAnnotate={assignedModels} annotationModels={annotationModels} admin={false}/>
            </main>
            <Foot />
        </>
    )
}