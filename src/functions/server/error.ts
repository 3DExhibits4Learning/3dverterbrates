/**
 * @file
 * 
 * @fileoverview Single file to replace multiple files; other file deprecation in progress
 */

export function routeHandlerError(route: string, errorMessage: string, fn: string) {
    return (
    `Date: ${new Date().toDateString()}\n
    Time: ${new Date().toTimeString()}\n
    Route: ${route} \n 
    Function: ${fn} \n
    Error Message: ${errorMessage}`
    )
}

export function routeHandlerErrorHandler(route: string, errorMessage: string, fn: string, clientErrorMessage: string){
    console.error(routeHandlerError(route, errorMessage, fn))
    throw Error(clientErrorMessage)
}

export function routeHandlerTypicalCatch(errorMessage: string){
    return Response.json({ data: `Error: ${errorMessage}`, response: errorMessage }, { status: 400, statusText: errorMessage })
}

export function serverAsyncErrorHandler(errorMessage: string, clientErrorMessage: string){
    console.error(errorMessage)
    throw Error(clientErrorMessage)
}

export function nonFatalError(route: string, errorMessage: string, fn: string){
    console.log(routeHandlerError(route, errorMessage, fn))
}