import ModelAnnotations from "@/classes/ModelAnnotationsClass"
import { annotationsAndPositions, fullAnnotation } from "@/interface/interface"

export function annotationsAndPositionsReducer(annotationsAndPositions: annotationsAndPositions, action: any) {

    switch (action.type) {

        case 'activeAnnotationIndex=1':

            const returnState0: annotationsAndPositions = {
                ...annotationsAndPositions,
                activeAnnotation: undefined,
                activeAnnotationType: undefined,
                activeAnnotationPosition: undefined
            }

            return returnState0

        case 'activeAnnotationIndex>1':

            const annotations = annotationsAndPositions.annotations as fullAnnotation[]
            const i = annotationsAndPositions.activeAnnotationIndex as number

            const returnState1: annotationsAndPositions = {
                ...annotationsAndPositions,
                activeAnnotationType: annotations[i - 2].annotation_type as 'photo' | 'video' | 'model' | undefined,
                activeAnnotationPosition: annotations[i - 2].position as string,
                newAnnotationEnabled: false,
                repositionEnabled: false,
                activeAnnotationTitle: annotations[i - 2].title ?? '',
                activeAnnotation: annotations[i - 2].annotation
            }

            return returnState1

        case 'newModelSelectedOrDbUpdate':

            const mAnnotations = (action.modelAnnotations as ModelAnnotations).annotations

            const returnState2: annotationsAndPositions = {
                ...annotationsAndPositions,
                annotations: mAnnotations,
                numberOfAnnotations: mAnnotations.length,
                activeAnnotationIndex: undefined,
                position3D: undefined,
                newAnnotationEnabled: false,
                firstAnnotationPosition: action.firstAnnotationPosition,
                activeAnnotationPosition: undefined,
                repositionEnabled: false
            }

            return returnState2

        case 'newModelClicked':

            const returnState3: annotationsAndPositions = {
                ...annotationsAndPositions,
                firstAnnotationPosition: undefined
            }

            return returnState3

        case 'newAnnotation':

            const returnState4: annotationsAndPositions = {
                ...annotationsAndPositions,
                newAnnotationEnabled: true,
                activeAnnotationIndex: 'new',
                repositionEnabled: false
            }

            return returnState4

        case 'annotationCancelled':

            const returnState5: annotationsAndPositions = {
                ...annotationsAndPositions,
                newAnnotationEnabled: false,
                activeAnnotationIndex: undefined,
                cancelledAnnotation: !annotationsAndPositions.cancelledAnnotation
            }

            return returnState5

        case 'newPosition':

            const returnState6: annotationsAndPositions = {
                ...annotationsAndPositions,
                position3D: action.position
            }

            return returnState6

        default:
            throw Error('Unknown action: ' + action.type)
    }
}