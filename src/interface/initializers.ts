import { annotationsAndPositions, annotationClientSpecimen, annotationEntry} from "./interface"
import { photo_annotation, video_annotation } from "@prisma/client"

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

export const getInitialAnnotationEntryData = (apData: annotationsAndPositions, newAnnotation?: boolean): annotationEntry => {
    return ({
        photoChecked: undefined,
        videoChecked: undefined,
        modelChecked: undefined,
        annotationType: '',
        mediaType: undefined,
        imageVisible: undefined,
        annotationTitle: undefined,
        url: (apData.activeAnnotation as photo_annotation)?.url ?? '',
        file: undefined,
        author: (apData.activeAnnotation as photo_annotation)?.author ?? '',
        license: (apData.activeAnnotation as photo_annotation)?.license ?? '',
        photoTitle: (apData.activeAnnotation as photo_annotation)?.title ?? '',
        website: (apData.activeAnnotation as photo_annotation)?.website ?? '',
        annotation: newAnnotation ? '' : (apData.activeAnnotation as photo_annotation)?.annotation ?? '',
        length: (apData.activeAnnotation as video_annotation)?.length ?? '',
        imageSource: undefined,
        videoSource: '',
        modelAnnotationUid: 'select'
    })
}

export const getNewAnnotationEntryData = (): annotationEntry => {
    return ({
        photoChecked: undefined,
        videoChecked: undefined,
        modelChecked: undefined,
        annotationType: '',
        mediaType: undefined,
        imageVisible: undefined,
        annotationTitle: undefined,
        url: '',
        file: undefined,
        author: '',
        license: '',
        photoTitle: '',
        website: '',
        annotation: '',
        length: '',
        imageSource: undefined,
        videoSource: '',
        modelAnnotationUid: 'select'
    })
}

