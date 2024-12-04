/**
 * @file src/app/api/admin/annotations/reject/route.ts
 */

import { rejectAnnotations } from "@/functions/server/queries";
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error";
import routeHandlerTypicalResponse from "@/functions/server/typicalSuccessResponse";

export async function PATCH(request: Request) {

    try {

        // Variable declarations
        const { searchParams } = new URL(request.url)
        const uid = searchParams.get('uid') as string
        const route = 'src/app/api/admin/annotations/reject/route.ts'

        // Approve annotations
        const approval = await rejectAnnotations(uid).catch(e => routeHandlerErrorHandler(route, e.message, 'rejectAnnotations()', "Coudln't reject annotations"))

        // Typical response
        return routeHandlerTypicalResponse('Annotations rejected', approval)
    }
    // Typical catch
    catch(e: any){return routeHandlerTypicalCatch(e.message)}
}