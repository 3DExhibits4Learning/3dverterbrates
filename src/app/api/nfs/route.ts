/**
 * @file src/app/api/nfs/route.ts
 * 
 * @fileoverview get method returns files that can be served via http
 */

// Imports
import { readFile } from "fs/promises"
import routeHandlerErrorHandler from "@/functions/server/serverError/routeHandlerErrorHandler"

/**
 * @function GET
 * @param request http request
 * @returns filebuffer
 */
export async function GET(request: Request) {

    try {
        // Current route
        const route = 'src/app/api/nfs/route.ts'
        
        // Get search params
        const { searchParams } = new URL(request.url)
        
        // Get file buffer
        const fileBuffer = await readFile(searchParams.get('path') as string).catch((e) => routeHandlerErrorHandler(route, e.message, 'readFile()', "Can't read photo")) as Buffer

        // Return filebuffer
        return new Response(fileBuffer, { status: 200 })
    }
    
    // Typical catch
    catch (e: any) {return Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message })}
}