import { getModelsWithoutThumbnails } from "@/api/queries";

export async function GET(){
    try{
        const models = await getModelsWithoutThumbnails()
        return Response.json({data: 'Models Retrieved', response: models})
    }
    catch(e){return Response.json({data: 'Models Retrieved', response: 'Error'}, {status: 400, statusText: "Error"})}
}