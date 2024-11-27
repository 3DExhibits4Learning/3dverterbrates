'use client'

import { annotationClientSpecimen, annotationEntry, annotationsAndPositions } from "@/interface/interface"
import { photo_annotation, video_annotation, model_annotation } from "@prisma/client"
import { SetStateAction, Dispatch } from "react"
import { v4 as uuidv4 } from 'uuid'
import { annotationEntryAction } from "./reducers/AnnotationEntryData"

export const allTruthy = (value: any) => value ? true : false
export const allSame = (originalValues: any[], currentValues: any[]) => JSON.stringify(originalValues) === JSON.stringify(currentValues) ? true : false

export function getImagePath(photoAnnotation: photo_annotation) {
    const path = process.env.NEXT_PUBLIC_LOCAL === 'true' ? `X:${photoAnnotation.url.slice(5)}` : `public${photoAnnotation.url}`
    return `/api/nfs?path=${path}`
}

export const firstAnnotationFormData = (uid: string, position: string, index: string) => {

    const data = new FormData()

    data.set('uid', uid as string)
    data.set('position', position as string)
    data.set('index', index)

    return data
}

export const insertAnnotation = async (data: FormData, method?: string) => {
    return await fetch('/api/annotations', {
        method: method ? method : 'POST',
        body: data
    }).then(res => res.json()).then(json => json.data)
}

export const annotationFormData = (aeData: annotationEntry, uid: string, index: string, position: string): FormData => {

    const data = new FormData()

    // Annotations table data
    data.set('uid', uid as string)
    data.set('annotation_no', index.toString())
    data.set('annotation_type', aeData.annotationType)
    data.set('position', position as string)
    data.set('title', aeData.annotationTitle as string)

    // Set relevant data based on annotationType
    switch (aeData.annotationType) {

        // Video_annotation table data
        case 'video':
            data.set('length', aeData.length)
            data.set('url', aeData.videoSource)

            break

        // Model_annotation table data
        case 'model':
            data.set('modelAnnotationUid', aeData.modelAnnotationUid as string)
            data.set('annotation', aeData.annotation)

            break

        // Photo_annotation table data
        default:
            data.set('author', aeData.author)
            data.set('license', aeData.license)
            data.set('annotation', aeData.annotation)
            if (aeData.photoTitle) data.set('photoTitle', aeData.photoTitle)
            if (aeData.website) data.set('website', aeData.website)

            break
    }

    // Shared data (url was formerly the foreign key)
    const annotationId = uuidv4()
    data.set('annotation_id', annotationId)

    // Directory, path and url data for photo uploads
    if (aeData.file) {
        const photo = aeData.file as File
        data.set('dir', `public/data/Herbarium/Annotations/${uid}/${annotationId}`)
        data.set('path', `public/data/Herbarium/Annotations/${uid}/${annotationId}/${photo.name}`)
        data.set('url', `/data/Herbarium/Annotations/${uid}/${annotationId}/${photo.name}`)
    }

    // Route handler data
    data.set('mediaType', aeData.mediaType as string)
    data.set('file', aeData.file as File)

    return data
}

export const annotationUpdateData = (aeData: annotationEntry, apData: annotationsAndPositions, specimen: annotationClientSpecimen): FormData => {

    const data = new FormData()

    if (apData.activeAnnotationType !== aeData.annotationType) {
        data.set('mediaTransition', 'true')
        data.set('previousMedia', apData.activeAnnotationType as string)
    }

    // Annotations table data (for update)
    data.set('uid', specimen.uid as string)
    data.set('annotation_type', aeData.annotationType)
    data.set('position', apData.position3D as string ?? apData.activeAnnotationPosition)
    data.set('title', aeData.annotationTitle as string)

    // Set relevant data based on annotationType
    switch (aeData.annotationType) {

        // Video_annotation table data
        case 'video':
            data.set('length', aeData.length)
            data.set('url', aeData.videoSource)

            break

        // Model_annotation table data
        case 'model':
            data.set('modelAnnotationUid', aeData.modelAnnotationUid as string)
            data.set('annotation', aeData.annotation)

            break

        // Photo_annotation table data
        default:
            data.set('author', aeData.author)
            data.set('license', aeData.license)
            data.set('annotation', aeData.annotation)
            if (aeData.photoTitle) data.set('photoTitle', aeData.photoTitle)
            if (aeData.website) data.set('website', aeData.website)
    }

    // Shared data (url was formerly the foreign key)
    // Note that the url is the url necessary from the collections page; also note the old path must be inlcuded for deletion; also note that a new id is not generated for update
    data.set('annotation_id', (apData.activeAnnotation as photo_annotation | video_annotation).annotation_id)
    data.set('specimenName', specimen.specimenName as string)

    // Set relevant form data if there is a new photo file
    if (aeData.file) {
        const photo = aeData.file as File
        const annotation = apData.activeAnnotation as photo_annotation
        data.set('dir', `public/data/Herbarium/Annotations/${specimen.uid}/${annotation.annotation_id}`)
        data.set('path', `public/data/Herbarium/Annotations/${specimen.uid}/${annotation.annotation_id}/${photo.name}`)
        data.set('url', `/data/Herbarium/Annotations/${specimen.uid}/${annotation.annotation_id}/${photo.name}`)
        data.set('file', photo)
        if (apData.activeAnnotationType === 'photo') data.set('oldUrl', (apData.activeAnnotation as photo_annotation).url)
    }

    // Else if the databased annotation is a photo, the url should be the same
    else if (apData.activeAnnotationType === 'photo') data.set('url', (apData.activeAnnotation as photo_annotation).url)

    // Route handler data
    data.set('mediaType', aeData.mediaType as string)

    return data
}

export const enablePhotoAnnotatonUpdate = (apData: annotationsAndPositions, aeData: annotationEntry, setSaveDisabled: Dispatch<SetStateAction<boolean>>, isNewPosition: boolean) => {
    // Type assertion for brevity
    const caseAnnotation = apData.activeAnnotation as photo_annotation

    // Required value arrays for comparison
    const originalValues = [apData.activeAnnotationTitle, caseAnnotation.author, caseAnnotation.license, caseAnnotation.annotation]
    const currentValues = [aeData.annotationTitle, aeData.author, aeData.license, aeData.annotation]

    // Optional value arrays for comparison
    const originalOptionalValues = [caseAnnotation.title, caseAnnotation.website]
    const optionalValues = [aeData.photoTitle, aeData.website]

    // If all required fields are populated and: they are different from the original, there is a new file, there is a new annotation position, or optional values have changed, enable "save changes"
    if (currentValues.every(allTruthy) && (!allSame(originalValues, currentValues) || aeData.file || isNewPosition || !allSame(originalOptionalValues, optionalValues))) setSaveDisabled(false)
    else setSaveDisabled(true)
}

export const enablePhotoAnnotationCreate = (aeData: annotationEntry, setCreateDisabled: Dispatch<SetStateAction<boolean>>, position: string) => {
    // Required fields
    const valueArray = [aeData.annotationTitle, aeData.file, aeData.author, aeData.license, aeData.annotation, position]

    // Enable button if all required fields are populated
    if (valueArray.every(allTruthy)) setCreateDisabled(false)
    else setCreateDisabled(true)
}

export const enableVideoAnnotationUpdate = (apData: annotationsAndPositions, aeData: annotationEntry, isNewPosition: boolean, setSaveDisabled: Dispatch<SetStateAction<boolean>>) => {
    // Type assertion, required value arrays
    const caseAnnotation = apData.activeAnnotation as video_annotation
    const originalValues = [apData.activeAnnotationTitle, caseAnnotation.url, caseAnnotation.length]
    const currentValues = [aeData.annotationTitle, aeData.videoSource, length]

    // If all required fields are populated and: they are different from the original, or there is a new position, then enable "save changes"
    if (currentValues.every(allTruthy) && (!allSame(originalValues, currentValues) || isNewPosition)) setSaveDisabled(false)
    else setSaveDisabled(true)
}

export const enableVideoAnnotationCreate = (aeData: annotationEntry, position: string, setCreateDisabled: Dispatch<SetStateAction<boolean>>) => {
    // Required fields
    const valueArray = [aeData.annotationTitle, aeData.videoSource, aeData.length, position]

    // Enable button if all required fields are populated
    if (valueArray.every(allTruthy)) setCreateDisabled(false)
    else setCreateDisabled(true)
}

export const enableModelAnnotationUpdate = (aeData: annotationEntry, apData: annotationsAndPositions, isNewPosition: boolean, setSaveDisabled: Dispatch<SetStateAction<boolean>>) => {

    // Type assertion, required value arrays
    const caseAnnotation = apData.activeAnnotation as model_annotation
    const originalValues = [apData.activeAnnotationTitle, caseAnnotation.uid, caseAnnotation.annotation]
    const currentValues = [aeData.annotationTitle, aeData.modelAnnotationUid, aeData.annotation]

    // If all required fields are populated and: they are different from the original, or there is a new position, then enable "save changes"
    if (currentValues.every(allTruthy) && (!allSame(originalValues, currentValues) || isNewPosition)) setSaveDisabled(false)
    else setSaveDisabled(true)
}

export const enableModelAnnotationCreate = (aeData: annotationEntry, position: string, setCreateDisabled: Dispatch<SetStateAction<boolean>>) => {

    // Required fields
    const valueArray = [aeData.annotationTitle, aeData.modelAnnotationUid, aeData.annotation, position]

    // Enable button if all required fields are populated
    if (valueArray.every(allTruthy)) setCreateDisabled(false)
    else setCreateDisabled(true)
}

export const deleteAnnotationData = (apData: annotationsAndPositions, uid: string) => {

    const requestObj = {
        annotation_id: apData.activeAnnotation?.annotation_id,
        modelUid: uid,
        oldUrl: apData.activeAnnotationType === 'photo' ? (apData.activeAnnotation as photo_annotation).url : ''
    }

    return JSON.stringify(requestObj)
}

export const createAnnotation = (index: number, uid: string, position: string, dataTransferWrapper: Function, aeData: annotationEntry) => {
    // Simple handler for the first annotation (always taxonomy and description)
    if (index === 1) {
        const data = firstAnnotationFormData(uid, position, index.toString())
        dataTransferWrapper(insertAnnotation, [data], "Creating annotation")
    }
    // Handler for all other annotations
    else {
        const data = annotationFormData(aeData, uid, index.toString(), position)
        dataTransferWrapper(insertAnnotation, [data], "Creating annotation")
    }
}

export const updateAnnotation = (index: number, dataTransferWrapper: Function, aeData: annotationEntry, apData: annotationsAndPositions, specimen: annotationClientSpecimen) => {
    if (index == 1) {
        const data = annotationFormData(aeData, specimen.uid as string, index.toString(), apData.position3D as string)
        dataTransferWrapper(insertAnnotation, [data, 'PATCH'], "Updating annotation")
    }
    else {
        const data = annotationUpdateData(aeData, apData, specimen)
        dataTransferWrapper(insertAnnotation, [data, 'PATCH'], "Updating annotation")
    }
}

export const deleteAnnotation = (apData: annotationsAndPositions, uid: string, dataTransferWrapper: Function) => {
    const data = deleteAnnotationData(apData, uid)
    dataTransferWrapper(insertAnnotation, [data, 'DELETE'], "Deleting annotation")
}

export const setImageVisibility = (index: number, aeData: annotationEntry, isNew: boolean, dispatch: Dispatch<annotationEntryAction>) => {
    if (index !== 1 && aeData.annotationType === 'photo') {
        if (!aeData.file && !isNew) dispatch({ type: 'setImageVisibility', isVisible: true })
        else dispatch({ type: 'setImageVisibility', isVisible: false })
    }
}

export const populateFormFields = (apData: annotationsAndPositions, dispatch: Dispatch<annotationEntryAction>) => {
    if (apData.activeAnnotationType && apData.activeAnnotation) {
        if (apData.activeAnnotationType === 'photo') {
            dispatch({ type: 'loadPhotoAnnotation', apData: apData });
            dispatch({ type: 'setImageSource', path: getImagePath(apData.activeAnnotation as photo_annotation) })
        }
        else if (apData.activeAnnotationType === 'video') dispatch({ type: 'loadVideoAnnotation', apData: apData })
        else if (apData.activeAnnotationType === 'model') dispatch({ type: 'loadModelAnnotation', apData: apData })
    }
}

export const enableSaveOrUpdateButton = (
    apData: annotationsAndPositions, aeData: annotationEntry, enableFirstAnnotation: Function,
    index: number, isNew: boolean, setCreateDisabled: Dispatch<SetStateAction<boolean>>,
    setSaveDisabled: Dispatch<SetStateAction<boolean>>, isNewPosition: boolean
) => {
    if (index == 1) apData.position3D ? enableFirstAnnotation(false) : enableFirstAnnotation(true)

    else if (aeData.annotationType == 'photo') {
        switch (isNew) {
            case false: enablePhotoAnnotatonUpdate(apData, aeData, setSaveDisabled, isNewPosition); break
            default: enablePhotoAnnotationCreate(aeData, setCreateDisabled, apData.position3D as string); break
        }
    }
    else if (aeData.annotationType == 'video') {
        switch (isNew) {
            case false: enableVideoAnnotationUpdate(apData, aeData, isNewPosition, setSaveDisabled); break
            default: enableVideoAnnotationCreate(aeData, apData.position3D as string, setCreateDisabled); break
        }
    }
    else if (aeData.annotationType == 'model') {
        switch (isNew) {
            case false: enableModelAnnotationUpdate(aeData, apData, isNewPosition, setSaveDisabled); break
            default: enableModelAnnotationCreate(aeData, apData.position3D as string, setCreateDisabled); break
        }
    }
}