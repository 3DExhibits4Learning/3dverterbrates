import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { updateThumbUrl } from '@/api/queries'

export async function POST(request: Request) {

    try{

        // Get form data and variables
        const formData = await request.formData()
        const file = formData.get('file') as File
        const uid = formData.get('uid') as string
        const annotationNumber = formData.get('annotationNumber') as string

        // Return if any data is missing
        if(!file || uid || !annotationNumber) throw Error('File or data is missing')
        
        // Convert photo to buffer and write to data storage
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const path = join(`public/data/Vertebrates/${uid}/${annotationNumber}`, file.name)
        await mkdir(path, { recursive: true})
        await writeFile(path, buffer)

        // Update the thumbnail column for the model in the database
        const update = await updateThumbUrl(path, uid)

        //Return Successful
        return Response.json({ data: "Thumbnail entered", response: update})
    }
    catch(e: any) {return Response.json({data: e.message, response: 'Error'}, {status: 400, statusText: "Error"})}
}