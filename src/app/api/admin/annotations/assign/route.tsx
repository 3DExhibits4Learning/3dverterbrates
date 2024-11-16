/**
 * @file src/app/api/admin/annotations/assign/route.tsx
 * 
 * @fileoverview route handler for admin assignment of a 3d model for annotation by a student
 */

import { NextRequest } from "next/server"
import { updateModelAnnotator, assignModelToStudent, unassignModelToStudent } from "@/functions/server/queries"
import routeHandlerErrorHandler from "@/functions/server/serverError/routeHandlerErrorHandler"
import routeHandlerTypicalCatch from "@/functions/server/serverError/routeHandlerTypicalCatch"
import routeHandlerTypicalResponse from "@/functions/server/typicalSuccessResponse"

const route = 'src/app/api/admin/annotations/assign/route.tsx'

export async function POST(request: NextRequest) {

    try {

        // Get body data
        const body = await request.json().catch((e) => routeHandlerErrorHandler(route, e.message, 'POST request.json()', "Couldn't get request body"))

        // Assignment (or unassignment)
        var assignment: any

        // Variable declarations
        const student = body.student as string | null
        const modelUid = body.uid as string
        const email = body.email as string

        // Throw error if any data is missing
        if (!(email && modelUid && student !== undefined)) throw Error('Input data missing')

        // Update model table with new student (or mark student as null)
        const updateModelTable = await updateModelAnnotator(modelUid, student)
            .catch((e) => routeHandlerErrorHandler(route, e.message, 'updateModelAnnotator()', "Couldn't update model annotator"))

        // If student, assign the model to them
        if (student) assignment = await assignModelToStudent(modelUid, email)
            .catch((e) => routeHandlerErrorHandler(route, e.message, 'assignModelToStudent()', "Couldn't assign model to student"))

        // Else, unassign the model to them
        else assignment = await unassignModelToStudent(modelUid, email)
            .catch((e) => routeHandlerErrorHandler(route, e.message, 'unassignModelToStudent()', "Couldn't unassign model to student"))

        return routeHandlerTypicalResponse(student ? 'Model Assigned' : 'Model Unassigned', { updateModelTable, assignment })
    }
    catch (e: any) { routeHandlerTypicalCatch(e.message) }
}