/**
 * @file src/app/api/annotations/route.tsx
 */

import {
    insertFirstAnnotationPosition,
    getFirstAnnotationPostion,
    createAnnotation,
    createPhotoAnnotation,
    createVideoAnnotation,
    deleteAnnotation,
    updateAnnotation,
    updatePhotoAnnotation,
    updateVideoAnnotation,
    deletePhotoAnnotation,
    deleteVideoAnnotation,
    createModelAnnotation,
    updateModelAnnotation,
    deleteModelAnnotation
} from "@/api/queries"
import { mkdir, writeFile } from "fs/promises"
import routeHandlerErrorHandler from "@/functions/serverError/routeHandlerErrorHandler"

const route = 'src/app/api/annotations/route.tsx'

// GET request handler
export async function GET(request: Request) {

    // Grab searchParams
    const { searchParams } = new URL(request.url)

    // Return first annotation position if it exists; typical try-catch return
    try {
        const firstAnnotationPosition = await getFirstAnnotationPostion(searchParams.get('uid') as string)
        return Response.json({ data: 'Annotation Position retrieved', response: firstAnnotationPosition })
    }
    catch (e: any) { return Response.json({ data: "Couldn't enter position", response: e.message }, { status: 400, statusText: "Couldn't enter position" }) }
}




// POST request handler
export async function POST(request: Request) {
    const data = await request.formData()

    // First annotation handler; always taxonomy and description, insert position with typical try-catch return
    if (data.get('index') == '1') {
        let update
        try {
            update = await insertFirstAnnotationPosition(data.get('uid') as string, data.get('position') as string)
            return Response.json({ data: 'Annotation Created', response: update })
        }
        catch (e: any) { return Response.json({ data: "Couldn't enter position", response: update }, { status: 400, statusText: "Couldn't enter position" }) }
    }

    // Else the annotation must be photo or video (or 3D model coming soon)
    else {

        // Conditional based on annotationType
        switch (data.get('annotation_type')) {

            // annotationType = 'video' handler
            case 'video':
                try {

                    // Database annotation creation
                    const newAnnotation = await createAnnotation(data.get('uid') as string, data.get('position') as string, data.get('url') as string, parseInt(data.get('annotation_no') as string), data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string)
                    const newVideoAnnotation = await createVideoAnnotation(data.get('url') as string, data.get('length') as string, data.get('annotation_id') as string)
                    return Response.json({ data: 'Annotation created', response: newAnnotation, newVideoAnnotation })
                }
                // Catch returns 400 status with 3rd party error message as response value; data and statusText are generic error messages
                catch (e: any) { return Response.json({ data: 'Prisma Error', response: e.message }, { status: 400, statusText: 'Prisma Error' }) }

            // annotationType = 'video' handler
            case 'model':
                try {

                    // Database annotation creation
                    const newAnnotation = await createAnnotation(data.get('uid') as string, data.get('position') as string, data.get('url') as string, parseInt(data.get('annotation_no') as string), data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string)
                    const newModelAnnotation = await createModelAnnotation(data.get('modelAnnotationUid') as string, data.get('annotation') as string, data.get('annotation_id') as string)
                    return Response.json({ data: 'Annotation created', response: newAnnotation, newModelAnnotation })
                }
                // Catch returns 400 status with 3rd party error message as response value; data and statusText are generic error messages
                catch (e: any) { return Response.json({ data: 'Prisma Error', response: e.message }, { status: 400, statusText: 'Prisma Error' }) }

            // Default case (annotationType == 'photo')
            default:
                try {
                    
                    // Get file, convert to arraybuffer, then buffer
                    const file = data.get('file') as File
                    const bytes = await file.arrayBuffer().catch((e) => routeHandlerErrorHandler(route, e.message, 'file.arrayBuffer()', "Couldn't get array buffer")) as ArrayBuffer
                    const buffer = Buffer.from(bytes)

                    // Make the directory
                    await mkdir(data.get('dir') as string, { recursive: true }).catch((e) => routeHandlerErrorHandler(route, e.message, 'mkdir()', "Couldn't make directory")) 

                    //@ts-ignore - ts incorrectly thinks that writeFile() can't write buffers
                    await writeFile(data.get('path') as string, buffer).catch((e) => routeHandlerErrorHandler(route, e.message, 'writeFile()', "Couldn't write file"))


                    // Optional photo_annotation data initializtion
                    const website = data.get('website') ? data.get('website') : undefined
                    const title = data.get('photoTitle') ? data.get('title') : undefined

                    // Database annotation creation
                    const newAnnotation = await createAnnotation(data.get('uid') as string, data.get('position') as string, data.get('url') as string, parseInt(data.get('annotation_no') as string), data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string)
                    const newPhotoAnnotation = await createPhotoAnnotation(data.get('url') as string, data.get('author') as string, data.get('license') as string, data.get('annotator') as string, data.get('annotation') as string, data.get('annotation_id') as string, website as string | undefined, title as string | undefined)

                    // Successful response returns message as the data value and response objects from prisma as the response values
                    return Response.json({ data: 'Annotation created', response: { newAnnotation, newPhotoAnnotation } })
                }
                // Catch returns 400 status with 3rd party error message as response value; data and statusText are generic error messages
                catch (e: any) { return Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message }) }
        }
    }
}




// Patch request handler
export async function PATCH(request: Request) {
    const data = await request.formData()

    // First annotation handler; always taxonomy and description, insert position with typical try-catch return
    if (data.get('index') == '1') {
        let update
        try {
            update = await insertFirstAnnotationPosition(data.get('uid') as string, data.get('position') as string)
            return Response.json({ data: 'Annotation Updated', response: update })
        }
        catch (e: any) { return Response.json({ data: "Couldn't enter position", response: update }, { status: 400, statusText: "Couldn't enter position" }) }
    }

    // Else the annotation must be photo or video (or 3D model coming soon)
    else {

        // Conditional based on annotationType
        switch (data.get('annotation_type')) {

            // annotationType = 'video' handler
            case 'video':

                try {

                    // If there is a change in media for the update, delete previous child of the annotations table, update, then return
                    if (data.get('mediaTransition')) {

                        let deletion

                        if (data.get('previousMedia') === 'photo') deletion = await deletePhotoAnnotation(data.get('annotation_id') as string)
                        else deletion = await deleteModelAnnotation(data.get('annotation_id') as string)

                        const updatedAnnotation = await updateAnnotation(data.get('uid') as string, data.get('position') as string, data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string, data.get('url') as string)
                        const newVideoAnnotation = await createVideoAnnotation(data.get('url') as string, data.get('length') as string, data.get('annotation_id') as string)

                        // Successful response returns message as the data value and response objects from prisma as the response values
                        return Response.json({ data: 'Annotation updated', response: deletion, updatedAnnotation, newVideoAnnotation })
                    }

                    // Database annotation update
                    const updatedAnnotation = await updateAnnotation(data.get('uid') as string, data.get('position') as string, data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string, data.get('url') as string)
                    const updatedVideoAnnotation = await updateVideoAnnotation(data.get('url') as string, data.get('length') as string, data.get('annotation_id') as string)

                    // Successful response returns message as the data value and response objects from prisma as the response values
                    return Response.json({ data: 'Annotation updated', response: updatedAnnotation, updatedVideoAnnotation })
                }
                // Catch returns 400 status with 3rd party error message as response value; data and statusText are generic error messages
                catch (e: any) { return Response.json({ data: 'Prisma Error', response: e.message }, { status: 400, statusText: 'Prisma Error' }) }

            // annotationType = 'model' handler
            case 'model':

                try {

                    // If there is a change in media for the update, delete previous child of the annotations table, update, then return
                    if (data.get('mediaTransition')) {

                        let deletion

                        if (data.get('previousMedia') === 'photo') deletion = await deletePhotoAnnotation(data.get('annotation_id') as string)
                        else deletion = await deleteVideoAnnotation(data.get('annotation_id') as string)

                        const updatedAnnotation = await updateAnnotation(data.get('uid') as string, data.get('position') as string, data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string)
                        const newModelAnnotation = await createModelAnnotation(data.get('modelAnnotationUid') as string, data.get('annotation') as string, data.get('annotation_id') as string)

                        // Successful response returns message as the data value and response objects from prisma as the response values
                        return Response.json({ data: 'Annotation updated', response: deletion, updatedAnnotation, newModelAnnotation })
                    }

                    // Database annotation update
                    const updatedAnnotation = await updateAnnotation(data.get('uid') as string, data.get('position') as string, data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string)
                    const updatedModelAnnotation = await updateModelAnnotation(data.get('modelAnnotationUid') as string, data.get('annotation') as string, data.get('annotation_id') as string)

                    // Successful response returns message as the data value and response objects from prisma as the response values
                    return Response.json({ data: 'Annotation updated', response: updatedAnnotation, updatedModelAnnotation })
                }
                // Catch returns 400 status with 3rd party error message as response value; data and statusText are generic error messages
                catch (e: any) { return Response.json({ data: 'Prisma Error', response: e.message }, { status: 400, statusText: 'Prisma Error' }) }

            // Default case (annotationType == 'photo')
            default:

                try {

                    // Optional photo_annotation data initializtion
                    let photoBuffer

                    if (data.get('file')) {
                        const file = data.get('file') as File
                        const bytes = await file.arrayBuffer()
                        photoBuffer = Buffer.from(bytes)
                    }
                    else if (data.get('mediaType') === 'url') photoBuffer = null

                    const website = data.get('website') ? data.get('website') : undefined
                    const title = data.get('photoTitle') ? data.get('title') : undefined

                    // If there is a change in media for the update, delete previous child of the annotations table, update, then return
                    if (data.get('mediaTransition')) {

                        let deletion

                        if (data.get('previousMedia') === 'video') deletion = await deleteVideoAnnotation(data.get('annotation_id') as string)
                        else deletion = await deleteModelAnnotation(data.get('annotation_id') as string)

                        const updatedAnnotation = await updateAnnotation(data.get('uid') as string, data.get('position') as string, data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string, data.get('url') as string)
                        const newPhotoAnnotation = await createPhotoAnnotation(data.get('url') as string, data.get('author') as string, data.get('license') as string, data.get('annotator') as string, data.get('annotation') as string, data.get('annotation_id') as string, website as string | undefined, title as string | undefined, photoBuffer)

                        return Response.json({ data: 'Annotation updated', response: deletion, updatedAnnotation, newPhotoAnnotation })
                    }

                    // Database annotation update
                    const updatedAnnotation = await updateAnnotation(data.get('uid') as string, data.get('position') as string, data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string, data.get('url') as string)
                    const updatedPhotoAnnotation = await updatePhotoAnnotation(data.get('url') as string, data.get('author') as string, data.get('license') as string, data.get('annotator') as string, data.get('annotation') as string, data.get('annotation_id') as string, website as string | undefined, title as string | undefined, photoBuffer)

                    // Successful response returns message as the data value and response objects from prisma as the response values
                    return Response.json({ data: 'Annotation updated', response: { updatedAnnotation, updatedPhotoAnnotation } })
                }
                // Catch returns 400 status with 3rd party error message as response value; data and statusText are generic error messages
                catch (e: any) { return Response.json({ data: 'Prisma Error', response: e.message }, { status: 400, statusText: 'Prisma Error' }) }
        }
    }
}




// Delete request handler
export async function DELETE(request: Request) {

    try {
        // Get request data
        const data = await request.json()

        // Delete the annotation, typical return 
        const deletion = deleteAnnotation(data.annotation_id, data.uid)
        return Response.json({ data: 'Annotation deleted', response: deletion })

    }
    // Catch returns 400 status with 3rd party error message as response value; data and statusText are generic error messages
    catch (e: any) { return Response.json({ data: 'Deletion Error', response: e.message }, { status: 400, statusText: 'Deletion Error' }) }
}
