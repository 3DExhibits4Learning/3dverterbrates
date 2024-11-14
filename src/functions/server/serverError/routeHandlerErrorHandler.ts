import routeHandlerError from "./routeHandlerError";

export default function routeHandlerErrorHandler(route: string, errorMessage: string, fn: string, clientErrorMessage: string){
    console.error(routeHandlerError(route, errorMessage, fn))
    throw Error(clientErrorMessage)
}