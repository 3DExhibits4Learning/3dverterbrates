import { getFullModels, getFullModelByUid } from "@/api/queries"

export async function GET() {
    try {
            const models = await getFullModels().catch((e) => {
                if (process.env.LOCAL_ENV === 'development') console.error(e.message)
                throw Error("Couldn't get Models")
            })
            return Response.json({ data: 'Models Obtained', response: models })
        }
    catch (e: any) {
        if (process.env.LOCAL_ENV != 'production') console.error(e.message)
        return Response.json({ data: 'error', response: e.message }, { status: 400, statusText: 'Error' })
    }
}