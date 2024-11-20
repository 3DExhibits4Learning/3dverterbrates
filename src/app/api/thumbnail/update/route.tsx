import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import { updateThumbUrl, getModelThumbnail } from '@/functions/server/queries'

export async function POST(request: Request) {

    try {

        // Get form data and variables
        const formData = await request.formData().catch((e) => {
            if (process.env.LOCAL_ENV === 'development') console.error(e.message)
            throw Error("No Form Data")
        })

        const file = formData.get('file') as File
        const uid = formData.get('uid') as string

        // Get old thumbnail path
        const oldThumbnailObject = await getModelThumbnail(uid).catch((e) => {
            if (process.env.LOCAL_ENV === 'development') console.error(e.message)
            throw Error("Couldn't find previous thumbnail")
        })

        // Return if any data is missing
        if (!file || !uid) throw Error('File or UID is missing')

        // Convert photo to buffer and write to data storage
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        var path = `public/data/Vertebrates/Thumbnails/${uid}`

        // Since this is an update, this path should already exist; this is a low-cost redundency check
        await mkdir(path, { recursive: true }).catch((e) => {
            if (process.env.LOCAL_ENV === 'development') console.error(e.message)
            throw Error("Couldn't create directory")
        })

        // Write file to path
        path = join(path, file.name)

        //@ts-ignore - typescript thinks writeFile doesn't take a buffer
        await writeFile(path, buffer).catch((e) => {
            if (process.env.LOCAL_ENV === 'development') console.error(e.message)
            throw Error("Couldn't write file")
        })

        // Update the thumbnail column for the model in the database
        const update = await updateThumbUrl(path.slice(7), uid).catch((e) => {
            if (process.env.LOCAL_ENV === 'development') console.error(e.message)
            throw Error("Couldn't update database")
        })

        // Delete old thumbnail
        await unlink('public/' + oldThumbnailObject?.thumbnail).catch((e) => {
            if (process.env.LOCAL_ENV === 'development') console.error(e.message)
            throw Error("Couldn't delete previous thumbnail")
        })

        //Return Successful
        return Response.json({ data: "Thumbnail Updated", response: update })
    }
    catch (e: any) {
        if (process.env.LOCAL_ENV === 'development') console.error(e.message)
        return Response.json({ data: 'Error Adding Thumbnail', response: 'Error Adding Thumbnail' }, { status: 400, statusText: 'Error Adding Thumbnail' })
    }
}