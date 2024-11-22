/**
 * @file src/app/api/collections/models/route.tsx
 */
export const dynamic = 'force-dynamic'

import { getAllModels, getModelAnnotations } from "@/functions/server/queries"
import { model } from "@prisma/client"
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { annotationWithModel } from "@/interface/interface"

import routeHandlerTypicalResponse from "@/functions/server/typicalSuccessResponse"

const route = 'src/app/api/collections/models/route.tsx'

// Returns all SiteReadyModels
export async function GET(request: Request) {

  try {

    const models = await getAllModels().catch(e => routeHandlerErrorHandler(route, e.message, 'getAllModels()', "Coulnd't get models", 'GET')) as model[]
    const modelAnnotations = await getModelAnnotations().catch(e => routeHandlerErrorHandler(route, e.message, 'getModelAnnotations()', "Coulnd't get modelAnnotations", 'GET')) as annotationWithModel[]

    const isSiteReadyModel = (model: model) => model.site_ready && model.annotationPosition && model.base_model && model.modelApproved && model.thumbnail
    const isUnannotatedSiteReadyModel = (model: model) => model.annotator === null && !model.annotated && !model.annotationsApproved
    const isAnnotatedSiteReadyModel = (model: model) => model.annotator && model.annotationsApproved && model.annotated
    const isAnnotationModel = (model: model) => model.site_ready && !model.base_model && model.modelApproved && model.thumbnail
    const isUsedAnnotationModel = (model: model) => modelAnnotations.some(annotationModel => annotationModel.model_annotation.uid === model.uid)

    const siteReadyModels = models.filter(model => isAnnotationModel(model) && isUsedAnnotationModel(model) ||
      isSiteReadyModel(model) && (isAnnotatedSiteReadyModel(model) || isUnannotatedSiteReadyModel(model)))

    return routeHandlerTypicalResponse("Models obtained", siteReadyModels)
  }
  catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}