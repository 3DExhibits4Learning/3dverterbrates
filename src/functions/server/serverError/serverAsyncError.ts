export default function serverAsyncErrorHandler(errorMessage: string, clientErrorMessage: string){
    console.error(errorMessage)
    throw Error(clientErrorMessage)
}