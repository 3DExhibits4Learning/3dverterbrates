/**
 * @file src/app/api/thumbnail/add/route.tsx
 * 
 * @fileoverview route handler for adding thumbnails to the collections page
 */

// Imports
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { updateThumbUrl } from '@/functions/server/queries'
import { routeHandlerTypicalCatch, routeHandlerErrorHandler } from '@/functions/server/error'
import routeHandlerTypicalResponse from '@/functions/server/typicalSuccessResponse'

/**
 * 
 * @param request HTTP request
 * @returns typical response with db update record as response for reference
 */
export async function POST(request: Request) {

    try {

        // Route
        const route = 'src/app/api/thumbnail/add/route.tsx'

        // Get form data and variables
        const formData = await request.formData().catch(e => routeHandlerErrorHandler(route, e.message, 'formData()', "Form data missing" )) as FormData

        const file = formData.get('file') as File
        const uid = formData.get('uid') as string

        // Return if any data is missing
        if (!file || !uid) throw Error('File or UID is missing')

        // Convert photo to buffer and write to data storage
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        var path = `public/data/Vertebrates/Thumbnails/${uid}`

        await mkdir(path, { recursive: true }).catch(e => routeHandlerErrorHandler(route, e.message, 'mkdir()', "Couldn't make directory" ))

        path = join(path, file.name)

        //@ts-ignore - typescript thinks writeFile doesn't take a buffer
        await writeFile(path, buffer).catch(e => routeHandlerErrorHandler(route, e.message, 'writeFile()', "Couldn't write file" ))

        // Update the thumbnail column for the model in the database (remove 'public' and following slash, then escape remaining forward slashes in path before DB entry)
        const update = await updateThumbUrl(path.slice(7).replace('/', '\/'), uid).catch((e) => {
            if (process.env.LOCAL_ENV === 'development') console.error(e.message)
            throw Error("Couldn't update database")
        })

        //Return Successful
        return Response.json({ data: "Thumbnail added", response: update })
    }
    catch (e: any) {
        if (process.env.LOCAL_ENV === 'development') console.error(e.message)
        return Response.json({ data: 'Error Adding Thumbnail', response: 'Error Adding Thumbnail' }, { status: 400, statusText: 'Error Adding Thumbnail' })
    }
}