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

// Route
const route = 'src/app/api/thumbnail/add/route.tsx'

/**
 * 
 * @param request HTTP request
 * @returns typical response with db update record as response for reference
 */
export async function POST(request: Request) {

    try {

        // Get form data and variables
        const formData = await request.formData().catch(e => routeHandlerErrorHandler(route, e.message, 'formData()', "Form data missing")) as FormData

        // Variable declarations
        const file = formData.get('file') as File
        const uid = formData.get('uid') as string
        var path = `public/data/Vertebrates/Thumbnails/${uid}`

        // Return if any data is missing
        if (!file || !uid) throw Error('File or UID is missing')

        // file => arrayBuffer => Buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // make directory
        await mkdir(path, { recursive: true }).catch(e => routeHandlerErrorHandler(route, e.message, 'mkdir()', "Couldn't make directory"))

        // file path
        path = join(path, file.name)

        //@ts-ignore - typescript thinks writeFile doesn't take a buffer
        await writeFile(ath, buffer).catch(e => routeHandlerErrorHandler(route, e.message, 'writeFile()', "Couldn't write file"))

        // Update the thumbnail column for the model in the database (remove 'public' and following slash, then escape remaining forward slashes in path before DB entry)
        const update = await updateThumbUrl(path.slice(7).replace('/', '\/'), uid).catch(e => routeHandlerErrorHandler(route, e.message, 'updateThumbUrl()', "Couldn't update DB record"))

        // Typical response
        return routeHandlerTypicalResponse("Thumbnail added", update)
    }

    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}