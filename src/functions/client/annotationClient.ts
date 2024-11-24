/**
 * @file src/functions/client/annotationClient.ts
 * 
 * @fileoverview Annotation Client functions
 */

'use client'

// Typical imports
import { useContext } from "react"
import { AnnotationClientData } from "@/components/Admin/Annotation/AnnotationClient"
import { annotationClientSpecimen, annotationsAndPositions, studentsAssignmentsAndModels } from "@/interface/interface"

// Default imports
import ModelAnnotations from "@/classes/ModelAnnotationsClass"
import { model } from "@prisma/client"

// Annotation client context
const specimenData: annotationClientSpecimen = useContext(AnnotationClientData).specimenData
const apData: annotationsAndPositions = useContext(AnnotationClientData).annotationsAndPositions
const annotationsAndPositionsDispatch = useContext(AnnotationClientData).annotationsAndPositionsDispatch
const specimenDataDispatch = useContext(AnnotationClientData).specimenDataDispatch

/**
 * 
 * @returns the index of the active annotation for the selected model in the annotation client
 */
export const getIndex = () => {

    // Index
    var index

    // If else block to determine the correct index
    if (!apData.numberOfAnnotations && !apData.firstAnnotationPosition || apData.activeAnnotationIndex == 1) index = 1
    else if (!apData.numberOfAnnotations) index = 2
    else if (apData.numberOfAnnotations && apData.activeAnnotationIndex != 'new') index = apData.activeAnnotationIndex
    else if (apData.activeAnnotationIndex == 'new') index = apData.numberOfAnnotations + 2

    // Return
    return index
}

/**
 * 
 * @param students array of students, assignments and models (see type)
 * @returns email of student who is assigned the model with uid from specimenData object
 */
export const findStudentEmail = (students: studentsAssignmentsAndModels[]) => students.find(student => student.assignment.find(assignment => assignment.uid === specimenData.uid))?.email

/**
 * 
 * @param students array of students, assignments and models (see type)
 * @param email email of student who to be assigned the currently selected model for annotation
 * @returns arguments for assignAnnotation()
 */
export const getAssignmentArgs = (students?: studentsAssignmentsAndModels[], email?: string | null) => specimenData.annotator ?
    [specimenData.uid, null, findStudentEmail(students as studentsAssignmentsAndModels[])] :
    [specimenData.uid, name, email]

/**
 * 
 * @returns data transfer label for assignAnnotation()
 */
export const getAssignmentLabel = () => specimenData.annotator ? 'Unassigning model to student for annotation' : 'Assigning model to student for annotation'

/**
 * 
 * @description dispatch based on active annotation index
 */
export const activeAnnotationChangeHandler = () => {
    if (apData.activeAnnotationIndex == 1) annotationsAndPositionsDispatch({ type: 'activeAnnotationIndex=1' })
    else if (typeof (apData.activeAnnotationIndex) === 'number' && apData.annotations) annotationsAndPositionsDispatch({ type: 'activeAnnotationIndex>1' })
}

/**
 * 
 * @returns first annotation position of the active specimen if it exists, or an empty string if not
 */
export const getFirstAnnotationPosition = async () => await fetch(`/api/annotations?uid=${specimenData.uid}`, { cache: 'no-store' })
    .then(res => res.json()).then(json => {
        if (json.response) return JSON.parse(json.response)
        else return ''
    })

/**
 * 
 * @description get relevant data and dispatch when a either a model is selected or an annotation record is created/updated
 */
export const modelOrAnnotationChangeHandler = async () => {
    const modelAnnotations = await ModelAnnotations.retrieve(specimenData.uid as string)
    const annotationPosition = await getFirstAnnotationPosition()
    annotationsAndPositionsDispatch({ type: 'newModelSelectedOrDbUpdate', modelAnnotations: modelAnnotations, firstAnnotationPostion: annotationPosition })
}

export const modelClickHandler = (modelClicked: boolean, model: model) => {
    if (modelClicked) {
        // First annotation position MUST be loaded before BotanistRefWrapper, so it is set to undefined while model data is set
        annotationsAndPositionsDispatch({ type: 'newModelClicked' })
        specimenDataDispatch({ type: 'newModelClicked', model: model })
    }
    else specimenDataDispatch({ type: 'modelUndefined' })
}
