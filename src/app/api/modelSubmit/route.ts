import { uid } from 'uid'
import { prismaClient } from "@/api/queries";

const prisma = prismaClient()

export async function POST(request: Request) {

    try {
        // Get request body
        const body = await request.json()

        // Variable initialization
        var thumbUrl: string = ''
        const modelUid = body.uid as string

        // Typescript satisfied header
        const requestHeader: HeadersInit = new Headers()
        requestHeader.set('Authorization', process.env.SKETCHFAB_API_TOKEN as string)

        // Get model thumbnail - note that the thumbnail must be saved first!!!
        await fetch(`https://api.sketchfab.com/v3/models/${modelUid}`, {
            headers: requestHeader
        })
            .then(res => res.json())
            .then(data => thumbUrl = data.thumbnails.images[0].url)
            .catch((e) => {
                if (process.env.NODE_ENV === 'development') console.error(e.message)
                throw Error("Couldn't get model thumbnail")
            })

        // Insert data into database
        const insert = await prisma.model.create({
            data: {
                email: body.email as string,
                modeled_by: body.artist as string,
                spec_name: body.species as string,
                build_process: body.methodology as string,
                uid: modelUid,
                thumbnail: thumbUrl,
                lat: body.position.lat,
                lng: body.position.lng,
                spec_acquis_date: body.speciesAcquisitionDate,
                site_ready: true,
                user: body.user as string,
            }
        }).catch((e) => {
            if (process.env.NODE_ENV != 'production') console.error(e.message)
            throw Error("Couldn't Insert Metadata into Database")
        })

        // Insert software and tag data into database
        for (let software in body.software) {
            await prisma.software.create({
                data: {
                    uid: modelUid,
                    software: body.software[software]
                }
            }).catch((e) => {
                if (process.env.NODE_ENV != 'production') console.error(e.message)
                throw Error("Couldn't Insert Software into Database")
            })
        }
        for (let tag in body.tags) {
            await prisma.tags.create({
                data: {
                    uid: modelUid,
                    tag: body.tags[tag].value
                }
            }).catch((e) => {
                if (process.env.NODE_ENV != 'production') console.error(e.message)
                throw Error("Couldn't Insert Tags into Database")
            })
        }
        return Response.json({ data: 'Model added.', response: insert })
    }
    catch (e: any) { return Response.json({ data: 'error', response: e.message }, { status: 400, statusText: 'Error' }) }
}