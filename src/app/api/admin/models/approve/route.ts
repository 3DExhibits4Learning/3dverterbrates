/**
 * @file src/app/api/admin/models/approve/route.ts
 * 
 */

import { approveModel } from "@/functions/server/queries"
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import routeHandlerTypicalResponse from "@/functions/server/typicalSuccessResponse"

export async function POST(request: Request) {

    try {

        const route = 'src/app/api/admin/models/approve/route.ts'
        const { searchParams } = new URL(request.url)
        const uid = searchParams.get('uid') as string

        if (!uid) throw Error("UID Missing")

        const approve = await approveModel(uid).catch(e => routeHandlerErrorHandler(route, e.message, 'approveModel()', "Couldn't approve model"))

        return routeHandlerTypicalResponse("Model approved", approve)
    }
catch(e: any){routeHandlerTypicalCatch(e.message)}
}