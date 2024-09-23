import { deleteAllAnnotations, delete3DModel} from "@/api/queries";

export async function DELETE(request: Request) {

    try {
        const { searchParams } = new URL(request.url)
        const uid = searchParams.get('uid') as string
        
        const annotationDeletions = await deleteAllAnnotations(uid).catch((e) => {
            if(process.env.NODE_ENV === 'development') console.error(e.message)
            throw Error('Unable to delete annotations')
        })

        const modelDeletion = await delete3DModel(uid).catch((e) => {
            if(process.env.NODE_ENV === 'development') console.error(e.message)
            throw Error('Unable to delete model')
        })

        return Response.json({ data: 'Model and Annotations Deleted', response: annotationDeletions, modelDeletion })

    }
    catch (e: any) { return Response.json({ data: e.message, response: 'Prisma Error' }, { status: 400, statusText: e.message }) }
}