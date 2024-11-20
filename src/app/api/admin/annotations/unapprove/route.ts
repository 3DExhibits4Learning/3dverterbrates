/**
 * @file src/app/api/admin/annotations/unapprove/route.ts
 */

import { unapproveAnnotations } from "@/functions/server/queries";
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"

import routeHandlerTypicalResponse from "@/functions/server/typicalSuccessResponse";

export async function PATCH(request: Request) {

    try {

        // Variable declarations
        const { searchParams } = new URL(request.url)
        const uid = searchParams.get('uid') as string
        const route = 'src/app/api/admin/annotations/unapprove/route.ts'

        // Unapprove annotations
        const approval = await unapproveAnnotations(uid).catch(e => routeHandlerErrorHandler(route, e.message, 'unapproveAnnotations()', "Coudln't unapprove annotations"))

        // Typical response
        return routeHandlerTypicalResponse('Annotations unapproved', approval)
    }
    // Typical catch
    catch(e: any){return routeHandlerTypicalCatch(e.message)}
}