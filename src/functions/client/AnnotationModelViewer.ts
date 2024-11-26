/**
 * @file
 * 
 * @fileoverview
 */

import { annotationsAndPositions } from "@/interface/interface"
import { MutableRefObject, Dispatch } from "react"

/**
 * 
 * @param apData annotationsAndPositions from annotation client
 * @param sketchfabApi sketchfab API object
 * @description removes all annotations higher than than the annotation with index = activeAnnotationIndex
 */
export const removeHigherAnnotations = (apData: annotationsAndPositions, sketchfabApi: any) => {
    if (apData.annotations && apData.annotations.length + 1 !== apData.activeAnnotationIndex) {
        for (let i = apData.annotations.length; i >= (apData.activeAnnotationIndex as number); i--) {
            sketchfabApi.removeAnnotation(i, (err: any) => { })
        }
    }
}

/**
 * 
 * @param apData annotationsAndPositions from annotation client
 * @param sketchfabApi sketchfab API object
 * @param temporaryAnnotationIndex keeps track of index while annotations are replaced
 */
export const replaceHigherAnnotations = (apData: annotationsAndPositions, sketchfabApi: any, temporaryAnnotationIndex: number) => {
    if (apData.annotations && apData.annotations.length + 1 !== apData.activeAnnotationIndex) {
        for (let i = apData.activeAnnotationIndex as number - 1; i < apData.annotations.length; i++) {
            const position = JSON.parse(apData.annotations[i].position as string)
            sketchfabApi.createAnnotationFromScenePosition(position[0], position[1], position[2], `${apData.annotations[i].title}`, '', (err: any, index: any) => { temporaryAnnotationIndex = index })
        }
    }
}

export const createAnnotation = (info: any, newAnnotationEnabled: MutableRefObject<boolean>, temporaryAnnotationIndex: MutableRefObject<number>, sketchfabApi: any, apData: annotationsAndPositions, apDataDispatch: Dispatch<any>) => {

    if (newAnnotationEnabled) {

        // Remove previous annotation if there is a new click
        if (temporaryAnnotationIndex.current != undefined) sketchfabApi.removeAnnotation(temporaryAnnotationIndex.current, (err: any) => { })

        // Get camera position and create annotation
        sketchfabApi.getCameraLookAt((err: any, camera: any) => {
            sketchfabApi.createAnnotationFromScenePosition(info.position3D, camera.position, camera.target, '', '', (err: any, index: any) => { temporaryAnnotationIndex.current = index })

            // If the click was on the 3d model (and not the background) set position/activeAnnotation data, or else set position undefined
            if (info.position3D) {
                const positionArray = Array.from(info.position3D)
                apDataDispatch({ type: 'newPosition', position: JSON.stringify([positionArray, camera.position, camera.target]) })
                if (apData.activeAnnotationIndex !== 'new') apDataDispatch({ type: 'newAnnotationIndex', index: 'new' })
            }
            else apDataDispatch({ type: 'newPosition', position: undefined })
        })
    }
}
