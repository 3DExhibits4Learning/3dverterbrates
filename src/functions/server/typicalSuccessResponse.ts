export default function routeHandlerTypicalResponse(successMessage: string, response: any){
    return Response.json({data: successMessage, response: response})
}