/**
 * @file src/app/api/admin/student/route.ts
 */

// Imports
import { removeStudent, addStudent } from "@/api/queries"
import { getAuthorizedUsers } from "@/api/queries"
import { authorized } from "@prisma/client"
import routeHandlerErrorHandler from "@/functions/server/serverError/routeHandlerErrorHandler"

// Route path
const route = 'src/app/api/admin/student/route.ts'

/**
 * @function POST
 * @description adds student to authorized table
 * @param request Request
 * @returns Response (with dataResponse body)
 */

export async function POST(request: Request) {

    try {

        // Get request body
        const body = await request.json().catch((e) => routeHandlerErrorHandler(route, e.message, 'POST request.json()', "Couldn't get request body"))

        // Inatantiate email and name, throw error if either isn't there
        const email = body.email
        const name = body.name
        if (!email || !name) throw Error('Name or email is missing')
        
        // Add student to authorized table in the database
        const insertStudent = await addStudent(email, name).catch((e) => routeHandlerErrorHandler(route, e.message, 'addStudent()', "Couldn't add student"))

        // Typical success response
        return Response.json({ data: 'Student added', response: insertStudent })
    }

    // Typical fail response
    catch (e: any) { Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message }) }
}


/**
 * @function DELETE
 * @description removes student from authorized table
 * @param request Request
 * @returns Response (with dataResponse body)
 */

export async function DELETE(request: Request) {

    try {

        // Get request body
        const body = await request.json().catch((e) => routeHandlerErrorHandler(route, e.message, 'DELETE request.json()', "Couldn't get request body"))

        // Get email, throw error if it isn't there
        const email = body.email
        if (!email) throw Error('No email provided')

        // Get authorized students, then filter and map to an array of their emails
        const students = await getAuthorizedUsers().catch((e) => routeHandlerErrorHandler(route, e.message, 'getAuthorizedUsers()', "Couldn't get authorized students"))
        const studentEmails = (students as authorized[]).filter(user => user.role === 'student').map(student => student.email)

        // Return a bad request if the student's email is not in the array
        if(!studentEmails.includes(email)) throw Error('Student is not active on this project')
        
        // Remove student from authorized table in database
        const deleteStudent = await removeStudent(email).catch((e) => routeHandlerErrorHandler(route, e.message, 'removeStudent()', "Couldn't remove student"))

        // Typical success response
        return Response.json({ data: 'Student deleted', response: deleteStudent })
    }
    
    // Typical fail response
    catch (e: any) { Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message }) }
}