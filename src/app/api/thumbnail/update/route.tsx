/**
 * @file src/app/api/thumbnail/update/route.tsx
 * 
 * @fileoverview route handler for updating thumbnails
 */

// Imports
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import { updateThumbUrl, getModelThumbnail } from '@/functions/server/queries'
import { routeHandlerTypicalCatch, routeHandlerErrorHandler } from '@/functions/server/error'
import routeHandlerTypicalResponse from '@/functions/server/typicalSuccessResponse'

// Route
const route = 'src/app/api/thumbnail/update/route.tsx'

/**
 * 
 * @param request HTTP request
 * @returns typical response with update json for context
 */
export async function POST(request: Request) {

    try {

        // Get form data and variables
        const formData = await request.formData().catch(e => routeHandlerErrorHandler(route, e.message, 'formData()', "Form data missing")) as FormData

        // Variable declarations
        const file = formData.get('file') as File
        const uid = formData.get('uid') as string
        var path = `public/data/Vertebrates/Thumbnails/${uid}`

        // Get old thumbnail path
        const oldThumbnailObject = await getModelThumbnail(uid).catch(e => routeHandlerErrorHandler(route, e.message, 'getModelThumbnail()', "Couldn't get model thumbnail"))

        // Return if any data is missing
        if (!file || !uid) throw Error('File or UID is missing')

        // file => arrayBuffer => Buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Since this is an update, this path should already exist; this is a low-cost redundency check
        await mkdir(path, { recursive: true }).catch(e => routeHandlerErrorHandler(route, e.message, 'mkdir()', "Couldn't make directory"))

        // Write file to path
        path = join(path, file.name)

        //@ts-ignore - typescript thinks writeFile doesn't take a buffer
        await writeFile(path, buffer).catch(e => routeHandlerErrorHandler(route, e.message, 'writeFile()', "Couldn't write file"))

        // Update the thumbnail column for the model in the database
        const update = await updateThumbUrl(path.slice(7), uid).catch(e => routeHandlerErrorHandler(route, e.message, 'updateThumbUrl()', "Couldn't update DB record"))

        // Delete old thumbnail
        await unlink('public/' + oldThumbnailObject?.thumbnail).catch(e => routeHandlerErrorHandler(route, e.message, 'unlink()', "Couldn't delete old thumbnail"))

        // Typical response
        return routeHandlerTypicalResponse("Thumbnail Updated", update)
    }

    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}