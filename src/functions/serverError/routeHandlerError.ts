/**
 * 
 * @param route route path
 * @param errorMessage error.message
 * @param fn function that resulted in error
 * @returns Formatted string for detailed console error
 */

export default function routeHandlerError(route: string, errorMessage: string, fn: string) {
    return `${new Date().toDateString}\n
    Route: ${route} \n 
    Function: ${fn} \n
    Error Message: ${errorMessage}`
}