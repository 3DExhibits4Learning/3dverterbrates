import { prismaClient } from "@/api/queries";
import { LatLngLiteral } from "leaflet";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

const prisma = prismaClient()

export async function POST(request: Request) {

    try {

        // Get request data and initialize variables
        const data = await request.formData()
        const formData = new FormData

        // Get session data (or redirect if there is no session data)
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            redirect('/api/auth/signin')
        }

        // Data variables
        const artist = data.get('artist') as string
        const species = data.get('species') as string
        const buildMethod = data.get('buildMethod') as string
        const software: string[] = JSON.parse(data.get('software') as string)
        const tags: string[] = JSON.parse(data.get('tags') as string)
        const position: LatLngLiteral = JSON.parse(data.get('position') as string)
        const speciesAcquisitionDate = data.get('speciesAcquisitionDate') as string
        const modelFile = data.get('modelFile') as File

        // Form and fetch Variables 
        data.set('orgProject', process.env.SKETCHFAB_PROJECT_3DVERTEBRATES as string)
        data.set('modelFile', modelFile)
        data.set('visibility', 'private')
        data.set('options', JSON.stringify({ background: { color: "#000000" } }))
        const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models`
        var modelUid : any

        // Session variables
        const email = session.user?.email
        const user = session.user.name ?? ''

        // Typescript satisfied header
        const requestHeader: HeadersInit = new Headers()
        requestHeader.set('Authorization', process.env.SKETCHFAB_API_TOKEN as string)

        // Upload model file to sketchfab and instantiate modelUid
        await fetch(orgModelUploadEnd, {
            headers: requestHeader,
            body: formData
        })
        .then((res) => {
            if(!res.ok){
                console.error(res.statusText)
                throw Error('Bad SF request')
            }
            return res.json()
        })
        .then(json => modelUid = json.uid)
        .catch((e) => {
            console.error(e.message)
            throw Error('Bad SF request')
        })


        // Insert data into database
        const insert = await prisma.model.create({
            data: {
                email: email,
                modeled_by: artist,
                spec_name: species,
                build_process: buildMethod,
                uid: modelUid,
                lat: position.lat,
                lng: position.lng,
                spec_acquis_date: speciesAcquisitionDate,
                site_ready: true,
                user: user,
            }
        }).catch((e) => {
            if (process.env.LOCAL_ENV !== 'production') console.error(e.message)
            throw Error("Couldn't Insert Metadata into Database")
        })

        // Insert software and tag data into database
        for (let i in software) {
            await prisma.software.create({
                data: {
                    uid: modelUid,
                    software: software[i]
                }
            }).catch((e) => {
                if (process.env.LOCAL_ENV != 'production') console.error(e.message)
                throw Error("Couldn't Insert Software into Database")
            })
        }
        for (let i in tags) {
            await prisma.tags.create({
                data: {
                    uid: modelUid,
                    tag: tags[i]
                }
            }).catch((e) => {
                if (process.env.LOCAL_ENV != 'production') console.error(e.message)
                throw Error("Couldn't Insert Tags into Database")
            })
        }
        return Response.json({ data: 'Model added.', response: insert })
    }
    catch (e: any) {
        if (process.env.LOCAL_ENV != 'production') console.error(e.message)
        return Response.json({ data: 'error', response: e.message }, { status: 400, statusText: 'Error' })
    }
}