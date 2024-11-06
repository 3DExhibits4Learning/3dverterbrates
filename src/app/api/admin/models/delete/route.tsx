/**
 * @file src/app/api/admin/models/delete/route.tsx
 * @fileoverview the route handler for deletion of 3D models (and any associated annotations)
 * 
 * @todo delete 3d model from sketchfab
 */

import { deleteAllAnnotations, delete3DModel } from "@/api/queries";

export async function DELETE(request: Request) {

    try {

        // Get params, instatiate uid
        const { searchParams } = new URL(request.url)
        const uid = searchParams.get('uid') as string

        // Sketchfab request header
        const requestHeader: HeadersInit = new Headers()
        requestHeader.set('Authorization', process.env.SKETCHFAB_API_TOKEN as string)

        // Delete annotations
        const annotationDeletions = await deleteAllAnnotations(uid).catch((e) => {
            console.error(e.message)
            throw Error('Unable to delete annotations')
        })

        // Delete 3D model record in database
        const deleteModelFromDatabase = await delete3DModel(uid).catch((e) => {
            console.error(e.message)
            throw Error('Unable to delete model')
        })

        // Delete 3D model object from sketchfab
        await fetch(`https://api.sketchfab.com/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models/${uid}`, {
            headers: requestHeader,
            method: 'DELETE',
        }).then(res => {
            if(!res.ok){
                console.error(res.statusText)
                console.log(`Model ${uid} needs to be manually deleted from sketchfab`)
                throw Error("Couldn't delete 3D model")
            }
        }).catch((e) => {

        })

        // Typical success response
        return Response.json({ data: 'Model and Annotations Deleted', response: annotationDeletions, deleteModelFromDatabase })

    }

    // Typical fail response
    catch (e: any) { return Response.json({ data: e.message, response: 'Prisma Error' }, { status: 400, statusText: e.message }) }
}