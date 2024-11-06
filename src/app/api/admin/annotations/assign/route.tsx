/**
 * @file src\app\api\admin\annotations\assign\route.tsx
 * 
 * @fileoverview route handler for admin assignment of a 3d model for annotation by a student
 */

import { NextRequest } from "next/server"
import { updateModelAnnotator } from "@/api/queries"

export async function POST(request: NextRequest) {

    try {

        const body = await request.json().catch((e) => {
            console.error(e.message)
            throw Error("Coulnd't get request body")
        })

        const student = body.student as string | null
        const modelUid = body.uid as string
       
        const assignStudentAnnotator = await updateModelAnnotator(modelUid, student).catch((e) => {
            console.error(e.message)
            throw Error("Coulnd't assign student annotator")
        })

        return Response.json({ data: student ? 'Model Assigned' : 'Model Unassigned', response: assignStudentAnnotator })
    }
    catch(e: any){return Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message })}
}