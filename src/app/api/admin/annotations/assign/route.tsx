/**
 * @file src/app/api/admin/annotations/assign/route.tsx
 * 
 * @fileoverview route handler for admin assignment of a 3d model for annotation by a student
 */

import { NextRequest } from "next/server"
import { updateModelAnnotator, assignModelToStudent, unassignModelToStudent } from "@/api/queries"
import routeHandlerErrorHandler from "@/functions/server/serverError/routeHandlerErrorHandler"

const route = 'src/app/api/admin/annotations/assign/route.tsx'

export async function POST(request: NextRequest) {

    try {

        const body = await request.json().catch((e) => routeHandlerErrorHandler(route, e.message, 'POST request.json()', "Couldn't get request body"))

        var assignment: any

        const student = body.student as string | null
        const modelUid = body.uid as string
        const email = body.email as string

        const updateModelTable = await updateModelAnnotator(modelUid, student)
            .catch((e) => routeHandlerErrorHandler(route, e.message, 'updateModelAnnotator()', "Couldn't update model annotator in db"))

        if (student) assignment = await assignModelToStudent(modelUid, email)
            .catch((e) => routeHandlerErrorHandler(route, e.message, 'assignModelToStudent()', "Couldn't assign model to student in db"))
        
        else assignment = await unassignModelToStudent(modelUid, email)
            .catch((e) => routeHandlerErrorHandler(route, e.message, 'unassignModelToStudent()', "Couldn't unassign model to student in db"))

        return Response.json({ data: student ? 'Model Assigned' : 'Model Unassigned', response: updateModelTable, assignment })
    }
    catch (e: any) { return Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message }) }
}