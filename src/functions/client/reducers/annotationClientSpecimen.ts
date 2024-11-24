import { annotationClientSpecimen } from "@/interface/interface"
import { model } from "@prisma/client"

export function annotationClientSpecimenReducer(specimenData: annotationClientSpecimen, action: any) {

    switch (action.type) {

        case 'newModelClicked':

            const model = action.model as model

            const returnState0: annotationClientSpecimen = {
                ...specimenData,
                specimenName: model.spec_name,
                uid: model.uid,
                annotated: model.annotated,
                annotator: model.annotator ?? '',
                annotationsApproved: model.annotationsApproved
            }

            return returnState0

        case 'modelUndefined':


            const returnState1: annotationClientSpecimen = {
                ...specimenData,
                uid: undefined
            }

            return returnState1

        default:
            throw Error('Unknown action: ' + action.type)
    }
}