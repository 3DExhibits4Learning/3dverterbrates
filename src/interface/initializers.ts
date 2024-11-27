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

export const getInitialAnnotationEntryData = (apData: annotationsAndPositions): annotationEntry => {
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
        license: (apData.activeAnnotation as photo_annotation)?.license,
        photoTitle: (apData.activeAnnotation as photo_annotation)?.title ?? '',
        website: (apData.activeAnnotation as photo_annotation)?.website ?? '',
        annotation: (apData.activeAnnotation as photo_annotation)?.annotation ?? '',
        length: (apData.activeAnnotation as video_annotation)?.length ?? '',
        imageSource: undefined,
        videoSource: '',
        modelAnnotationUid: 'select'
    })
}

// // Radio Buttons
// const [photoChecked, setPhotoChecked] = useState<boolean>()
// const [videoChecked, setVideoChecked] = useState<boolean>()
// const [modelChecked, setModelChecked] = useState<boolean>()

// // Radio button resultant states
// const [annotationType, setAnnotationType] = useState<string>('')
// const [mediaType, setMediaType] = useState<string>()
// const [imageVisible, setImageVisible] = useState<boolean>()

// // Form fields
// const [annotationTitle, setAnnotationTitle] = useState<string>()
// const [url, setUrl] = useState<string>((apData.activeAnnotation as photo_annotation)?.url ?? '')
// const [file, setFile] = useState<File>()
// const [author, setAuthor] = useState<string>((apData.activeAnnotation as photo_annotation)?.author ?? '')
// const [license, setLicense] = useState<string>((apData.activeAnnotation as photo_annotation)?.license ?? '')
// const [photoTitle, setPhotoTitle] = useState<string>((apData.activeAnnotation as photo_annotation)?.title ?? '')
// const [website, setWebsite] = useState<string>((apData.activeAnnotation as photo_annotation)?.website ?? '')
// const [annotation, setAnnotation] = useState<string>((apData.activeAnnotation as photo_annotation)?.annotation ?? '')
// const [length, setLength] = useState<string>((apData.activeAnnotation as video_annotation)?.length ?? '')
// const [imageSource, setImageSource] = useState<string>()
// const [videoSource, setVideoSource] = useState<string>('')
// const [modelAnnotationUid, setModelAnnotationUid] = useState<string>('select')
