export default function routeHandlerTypicalCatch(errorMessage: string){
    return Response.json({ data: `Error: ${errorMessage}`, response: errorMessage }, { status: 400, statusText: errorMessage })
}