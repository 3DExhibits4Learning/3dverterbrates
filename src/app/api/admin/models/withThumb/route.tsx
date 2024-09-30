import { getModelsWithThumbnails } from "@/api/queries";

export async function GET() {
    try {
        const models = await getModelsWithThumbnails().catch((e) => {
            if (process.env.LOCAL_ENV === 'development') console.error(e.message)
            throw Error("Error getting models")
        })
        return Response.json({ data: 'Models Retrieved', response: models })
    }
    catch (e: any) {
        if (process.env.LOCAL_ENV === 'development') console.error(e.message)
        return Response.json({ data: 'Error', response: 'Error' }, { status: 400, statusText: "Error" })
    }
}