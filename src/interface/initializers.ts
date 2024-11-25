import { annotationsAndPositions } from "./interface"
import { annotationClientSpecimen } from "./interface"

// Annotation and position state data object for context
export const initialAnnotationsAndPositions: annotationsAndPositions = {
    annotations: undefined,
    numberOfAnnotations: undefined,
    cancelledAnnotation: undefined,
    position3D: undefined,
    activeAnnotationIndex: undefined,
    activeAnnotation: undefined,
    activeAnnotationType: undefined,
    activeAnnotationTitle: undefined,
    activeAnnotationPosition: undefined,
    firstAnnotationPosition: undefined,
    newAnnotationEnabled: false,
    annotationSavedOrDeleted: false,
    repositionEnabled: false,
}

// Specimen data object for context
export const initialSpecimenData: annotationClientSpecimen = {
    specimenName: undefined,
    uid: undefined,
    annotator: undefined,
    annotated: undefined,
    annotationsApproved: undefined
}
