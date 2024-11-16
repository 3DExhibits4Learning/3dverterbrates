import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { updateThumbUrl } from '@/functions/server/queries'

export async function POST(request: Request) {

    try {

        // Get form data and variables
        const formData = await request.formData().catch((e) => {
            if (process.env.LOCAL_ENV === 'development') console.error(e.message)
            throw Error("No Form Data")
        })

        const file = formData.get('file') as File
        const uid = formData.get('uid') as string

        // Return if any data is missing
        if (!file || !uid) throw Error('File or UID is missing')

        // Convert photo to buffer and write to data storage
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        var path = `public/data/Vertebrates/Thumbnails/${uid}`

        await mkdir(path, { recursive: true }).catch((e) => {
            if (process.env.LOCAL_ENV === 'development') console.error(e.message)
            throw Error("Couldn't create directory")
        })

        path = join(path, file.name)

        await writeFile(path, buffer).catch((e) => {
            if (process.env.LOCAL_ENV === 'development') console.error(e.message)
            throw Error("Couldn't write file")
        })

        // Update the thumbnail column for the model in the database (remove 'public' and follwing slash, then escape remaining forward slashes in path before DB entry)
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