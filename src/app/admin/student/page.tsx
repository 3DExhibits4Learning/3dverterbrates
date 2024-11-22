import { getAllAnnotationModels, getAssignments, getModelsToAnnotate, getModelAnnotations } from "@/functions/server/queries"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getAuthorizedUsers } from "@/functions/server/queries"
import { serverAsyncErrorHandler } from "@/functions/server/error"
import { model, assignment } from "@prisma/client"
import { annotationWithModel } from "@/interface/interface"

import StudentClient from "@/components/Admin/Student/StudentClient"
import Header from "@/components/Header/Header"
import Foot from "@/components/Shared/Foot"

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

    // Model annotation hotfix
    const modelAnnotations = await getModelAnnotations().catch(e => serverAsyncErrorHandler(e.message, "Coulnd't get modelAnnotations")) as annotationWithModel[]
    const isAnnotationModel = (model: model) => model.site_ready && !model.base_model && model.modelApproved && model.thumbnail
    const isUsedAnnotationModel = (model: model) => modelAnnotations.some(annotationModel => annotationModel.model_annotation.uid === model.uid)
    const unusedModelAnnotations = JSON.stringify(annotationModels.filter(model => isAnnotationModel(model) && isUsedAnnotationModel(model)))

    // Filter assigned models
    const studentAssignmentUids = assignments.filter(assignment => assignment.email === email).map(assignment => assignment.uid)
    const assignedModels = modelsToAnnotate.filter(model => studentAssignmentUids.includes(model.uid))

    return (
        <>
            <Header pageRoute="collections" headerTitle="Botany Admin" />
            <main className="w-full min-h-[calc(100vh-177px)] h-[calc(100vh-177px)] overflow-y-auto">
                <StudentClient modelsToAnnotate={JSON.stringify(assignedModels)} annotationModels={JSON.stringify(unusedModelAnnotations)}/>
            </main>
            <Foot />
        </>
    )
}