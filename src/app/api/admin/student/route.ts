/**
 * @file src/app/api/admin/student/route.ts
 */

import { removeStudent, addStudent } from "@/api/queries"
import routeHandlerErrorHandler from "@/functions/serverError/routeHandlerErrorHandler"

const route = 'src/app/api/admin/student/route.ts'

export async function POST(request: Request) {

    try {

        const body = await request.json().catch((e) => routeHandlerErrorHandler(route, e.message, 'POST request.json()', "Couldn't get request body"))

        const email = body.email
        const name = body.name

        if (!email || !name) throw Error('Name or email is missing')

        const insertStudent = await addStudent(email, name).catch((e) => routeHandlerErrorHandler(route, e.message, 'addStudent()', "Couldn't add student"))

        return Response.json({ data: 'Student added', response: insertStudent })
    }

    catch (e: any) { Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message }) }
}

export async function DELETE(request: Request) {

    try {

        const body = await request.json().catch((e) => routeHandlerErrorHandler(route, e.message, 'DELETE request.json()', "Couldn't get request body"))

        const email = body.email

        if (!email) throw Error('No email provided')

        const deleteStudent = await removeStudent(email).catch((e) => routeHandlerErrorHandler(route, e.message, 'removeStudent()', "Couldn't remove student"))

        return Response.json({ data: 'Student deleted', response: deleteStudent })
    }

    catch (e: any) { Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message }) }
}