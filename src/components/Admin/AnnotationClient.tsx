/**
 * @file src/components/Admin/AnnotationClient.tsx
 * 
 * @fileoverview annotation client parent component; its most important children are AnnotationModelViewer and AnnotationEntry
 * 
 * @todo Restructure state management with a reducer and state object
 * @todo Provide context of that state object to AnnotationModelViewer and AnnotationEntry
 * 
 */

'use client'

// Typical imports
import { Accordion, AccordionItem } from "@nextui-org/react"
import { useEffect, useState, useRef, useContext } from "react"
import { model } from "@prisma/client"
import { fullAnnotation, studentsAssignmentsAndModels } from "@/interface/interface"
import { toUpperFirstLetter } from "@/functions/utils/toUpperFirstLetter"
import { Button } from "@nextui-org/react"
import { photo_annotation, video_annotation, model_annotation } from "@prisma/client"
import { DataTransferContext } from "@/components/Admin/Administrator/ManagerClient"
import { approveAnnotations, unapproveAnnotations } from "@/functions/client/managerClient/approveAnnotations"

// Default imports
import BotanistRefWrapper from "./AnnotationModelViewerRef"
import AreYouSure from "../Shared/Modals/AreYouSure"
import AnnotationEntry from "./AnnotationEntry"
import ModelAnnotations from "@/classes/ModelAnnotationsClass"
import assignAnnotation from "@/functions/client/managerClient/assignAnnotation"
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"
import StudentSelect from "./Administrator/Students/SelectStudents"
import getIndex from "@/functions/client/annotationClient/getIndex"

export default function AnnotationClient(props: { modelsToAnnotate: model[], annotationModels: model[], admin: boolean, students?: studentsAssignmentsAndModels[] }) {

    // Variable declarations - data transfer contexts
    const initializeDataTransfer = useContext(DataTransferContext).initializeDataTransferHandler
    const terminateDataTransfer = useContext(DataTransferContext).terminateDataTransferHandler

    // Student states
    const [name, setName] = useState<string | null>()
    const [email, setEmail] = useState<string | null>()

    // Annotation states
    const [newAnnotationEnabledState, setNewAnnotationEnabledState] = useState<boolean>(false)
    const [cancelledAnnotation, setCancelledAnnotation] = useState<boolean>()
    const [annotationSavedOrDeleted, setAnnotationSavedOrDeleted] = useState<boolean>(false)
    const [annotations, setAnnotations] = useState<fullAnnotation[]>()
    const [numberOfAnnotations, setNumberOfAnnotations] = useState<number>()

    // Active annotation states
    const [activeAnnotationIndex, setActiveAnnotationIndex] = useState<number | 'new' | undefined>()
    const [activeAnnotation, setActiveAnnotation] = useState<photo_annotation | video_annotation | model_annotation | undefined>()
    const [activeAnnotationType, setActiveAnnotationType] = useState<'photo' | 'video' | 'model'>()
    const [activeAnnotationTitle, setActiveAnnotationTitle] = useState<string>()

    // Position states
    const [activeAnnotationPosition, setActiveAnnotationPosition] = useState<string>()
    const [repositionEnabled, setRepositionEnabled] = useState<boolean>(false)
    const [position3D, setPosition3D] = useState<string>()
    const [firstAnnotationPosition, setFirstAnnotationPostion] = useState<string>()

    // Specimen (model) states
    const [specimenName, setSpecimenName] = useState<string>()
    const [uid, setUid] = useState<string>()
    const [annotator, setAnnotator] = useState<string | null>()
    const [annotated, setAnnotated] = useState<boolean>()
    const [annotationsApproved, setAnnotationsApproved] = useState<boolean>()

    // Data transfer states
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    // Refs
    const modelClicked = useRef<boolean>()
    const newAnnotationEnabled = useRef<boolean>(false)

    // Function to set name and email states
    const setNameAndEmailStates = (name: string, email: string) => {
        setEmail(email)
        setName(name)
    }

    // Approve annotation handler
    const approveAnnotationsHandler = async () => dataTransferHandler(initializeDataTransfer, terminateDataTransfer, approveAnnotations, [uid], 'Approving annotations')

    // Unapprove annotation handler
    const unapproveAnnotationsHandler = async () => dataTransferHandler(initializeDataTransfer, terminateDataTransfer, unapproveAnnotations, [uid], 'Unapproving annotations')

    // Annotation assign (or unassign) handler
    const assignAnnotationHandler = async () => {

        // Variable to store email if this is an unassignment
        var obtainedEmail

        // An annotator indicates unassignment; we need to find the email of the student for unassignment
        if (annotator) {
            obtainedEmail = props.students?.find(student => student.assignment.find(assignment => assignment.uid === uid))?.email
        }

        // Define label and args based on whether this is assignment or unassignment
        const label = annotator ? 'Unassigning model to student for annotation' : 'Assigning model to student for annotation'
        const args = annotator ? [uid, null, obtainedEmail] : [uid, name, email]

        // Handle data transfer
        await dataTransferHandler(initializeDataTransfer, terminateDataTransfer, assignAnnotation, args, label)
    }

    // This effect sets the activeAnnotation when its dependency is changed from the BotanistModelViewer, either via clicking an annotation or creating a new one
    useEffect(() => {

        // Undefine relevant activeAnnotation states if the first index is selected (always taxonomy and description)
        if (activeAnnotationIndex == 1) {
            setActiveAnnotation(undefined)
            setActiveAnnotationType(undefined)
            setActiveAnnotationPosition(undefined)
        }

        // Else set active annotation and position states
        else if (typeof (activeAnnotationIndex) === 'number' && annotations) {
            setActiveAnnotationType(annotations[activeAnnotationIndex - 2].annotation_type as 'photo' | 'video')
            setActiveAnnotationPosition((annotations[activeAnnotationIndex - 2].position) as string)
            setNewAnnotationEnabledState(false)
            setRepositionEnabled(false)
            setActiveAnnotationTitle(annotations[activeAnnotationIndex - 2].title ?? '')
            setActiveAnnotation(annotations[activeAnnotationIndex - 2].annotation)
        }

    }, [activeAnnotationIndex]) // eslint-disable-line react-hooks/exhaustive-deps

    // Set relevant model data; this is called onPress of the Accordion
    useEffect(() => {

        // async
        const getAnnotationsObj = async () => {

            // Obtain ModelAnnotations object
            const modelAnnotations = await ModelAnnotations.retrieve(uid as string)
            let annotationPosition

            // Get first annotation position
            await fetch(`/api/annotations?uid=${uid}`, { cache: 'no-store' })
                .then(res => res.json()).then(json => {
                    if (json.response) annotationPosition = JSON.parse(json.response)
                    else annotationPosition = ''
                })

            // Set relevant states
            setAnnotations(modelAnnotations.annotations)
            setNumberOfAnnotations(modelAnnotations.annotations.length)
            setActiveAnnotationIndex(undefined)
            setPosition3D(undefined)
            setNewAnnotationEnabledState(false)
            newAnnotationEnabled.current = false
            setFirstAnnotationPostion(annotationPosition)
            setActiveAnnotation(undefined)
            setRepositionEnabled(false)
        }

        // Instantiate annotations object
        getAnnotationsObj()

    }, [uid, annotationSavedOrDeleted])

    return (
        <>
            <AreYouSure uid={uid as string} open={modalOpen} setOpen={setModalOpen} />

            <div className="flex w-full h-full">
                <section className="h-full w-1/5">

                    {/* Accordion holds all imported models - this will be replaced with an autocomplete*/}

                    <Accordion className="h-full" onSelectionChange={(keys: any) => modelClicked.current = keys.size ? true : false}>
                        {props.modelsToAnnotate.map((model, i) => {
                            return (
                                <AccordionItem
                                    key={i}
                                    aria-label={'Specimen to model'}
                                    title={toUpperFirstLetter(model.spec_name)}
                                    classNames={{ title: 'text-[ #004C46] text-2xl' }}
                                    onPress={() => {
                                        if (modelClicked.current) {
                                            // First annotation position MUST be loaded before BotanistRefWrapper, so it is set to undefined while model data is set - note conditional render below
                                            setFirstAnnotationPostion(undefined)
                                            setSpecimenName(model.spec_name)
                                            setUid(model.uid)
                                            setAnnotated(model.annotated)
                                            setAnnotator(model.annotator)
                                            setAnnotationsApproved(model.annotationsApproved)
                                        }
                                        else setUid(undefined)
                                    }}
                                >
                                    {
                                        // Conditional render that waits until the first annotation (thus all annotations) is loaded
                                        // RefWrapper required to pass ref to dynamically imported component
                                        firstAnnotationPosition != undefined &&
                                        <div className="h-[400px]">
                                            <BotanistRefWrapper
                                                uid={model.uid}
                                                setActiveAnnotationIndex={setActiveAnnotationIndex}
                                                setPosition3D={setPosition3D}
                                                firstAnnotationPosition={firstAnnotationPosition}
                                                position3D={position3D}
                                                annotations={annotations}
                                                cancelledAnnotation={cancelledAnnotation}
                                                activeAnnotationIndex={activeAnnotationIndex}
                                                newAnnotationEnabledState={newAnnotationEnabledState}
                                                repositionEnabled={repositionEnabled}
                                                ref={newAnnotationEnabled}
                                                annotationSavedOrDeleted={annotationSavedOrDeleted}
                                            />
                                        </div>
                                    }
                                    {
                                        // Admin only - Student select and assign
                                        props.admin && !annotator && !newAnnotationEnabledState &&
                                        <>
                                            <StudentSelect students={props.students as studentsAssignmentsAndModels[]} setNameAndEmailStates={setNameAndEmailStates} />
                                            <div className="flex">
                                                <Button onPress={() => assignAnnotationHandler()}
                                                    className="text-white mt-2 text-lg"
                                                    isDisabled={!(name && email)}
                                                >
                                                    Assign
                                                </Button>
                                            </div>
                                        </>
                                    }
                                    {
                                        // Admin only - assignment data, approve/unapprove buttons, unassign button
                                        props.admin && annotator && !newAnnotationEnabledState &&
                                        <>
                                            <div className="w-full mb-2">
                                                <table className="w-full overflow-hidden rounded-b-lg bg-[#D5CB9F] text-center">
                                                    <tr>
                                                        <td className="py-1 border-b border-[#004C46] border-r">Assigned to</td>
                                                        <td className="py-1 border-b border-[#004C46]">{annotator}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 border-b border-[#004C46] border-r">Student Approved</td>
                                                        <td className="py-1 border-b border-[#004C46]">{annotated ? 'Yes' : 'No'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 border-[#004C46] border-r">Admin Approved</td>
                                                        <td className="py-1 border-[#004C46]">{annotationsApproved ? 'Yes' : 'No'}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                            {
                                                // Approval button
                                                annotated && !annotationsApproved &&
                                                <div className="flex">
                                                    <Button onPress={() => approveAnnotationsHandler()}
                                                        className="text-white mt-2 text-lg"
                                                    >
                                                        Approve
                                                    </Button>
                                                </div>
                                            }
                                            {
                                                // Unapproval button
                                                annotated && annotationsApproved &&
                                                <div className="flex">
                                                    <Button onPress={() => unapproveAnnotationsHandler()}
                                                        className="text-white mt-2 text-lg"
                                                    >
                                                        Unapprove
                                                    </Button>
                                                </div>
                                            }
                                            <div className="flex">
                                                <Button onPress={() => assignAnnotationHandler()}
                                                    className="text-white mt-2 text-lg"
                                                >
                                                    Unassign
                                                </Button>
                                            </div>
                                        </>
                                    }
                                    {
                                        // New annotation button
                                        !newAnnotationEnabledState && activeAnnotationIndex != 'new' && firstAnnotationPosition != undefined &&
                                        <Button onPress={() => {
                                            newAnnotationEnabled.current = true
                                            setNewAnnotationEnabledState(true)
                                            setActiveAnnotationIndex('new')
                                            setRepositionEnabled(false)
                                        }}
                                            className="text-white mt-2 text-lg"
                                            isDisabled={repositionEnabled}
                                        >
                                            + New Annotation
                                        </Button>
                                    }
                                    {
                                        // 'Mark as annotated' button
                                        annotations && annotations?.length >= 6 &&
                                        <>
                                            <br></br>
                                            <Button onPress={() => {
                                                setModalOpen(true)
                                            }}
                                                className="text-white mt-2 text-lg"
                                                isDisabled={repositionEnabled}
                                            >
                                                Mark as Annotated
                                            </Button>
                                        </>
                                    }
                                    {
                                        // Click to place annotation or cancel
                                        newAnnotationEnabledState &&
                                        <div className="flex justify-center flex-col items-center">
                                            <p className="text-lg text-center">Click the subject to add an annotation</p>
                                            <p className="text-lg">or</p>
                                            <Button
                                                color="danger"
                                                variant="light"
                                                className="text-red-600 hover:text-white text-lg"
                                                onPress={() => {
                                                    newAnnotationEnabled.current = false
                                                    setNewAnnotationEnabledState(false)
                                                    setActiveAnnotationIndex(undefined)
                                                    setCancelledAnnotation(!cancelledAnnotation)
                                                }}
                                            >
                                                Cancel Annotation
                                            </Button>
                                        </div>
                                    }
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </section>
                <div className="flex flex-col w-4/5">
                    <section className="flex w-full h-full flex-col">
                        {
                            // 'Select a 3d model' banner
                            !uid && !activeAnnotation &&
                            <div className="flex items-center justify-center text-xl h-full w-full">
                                <p className="mr-[10%] text-lg lg:text-3xl">{props.modelsToAnnotate.length ? props.admin ?'Select an annotation' : 'Select an annotation, or click New Annotation' : "No models assigned"}</p>
                            </div>
                        }
                        {
                            // 'Select an annotation' banner
                            uid && !activeAnnotation && activeAnnotationIndex !== 1 && !newAnnotationEnabledState &&
                            <div className="flex items-center justify-center text-xl h-full w-full">
                                <p className="mr-[10%] text-lg lg:text-3xl">Select an annotation, or click New Annotation</p>
                            </div>
                        }
                        {
                            // This indicates the first annotation
                            activeAnnotationIndex == 1 &&
                            <AnnotationEntry
                                index={getIndex(numberOfAnnotations as number, firstAnnotationPosition as string, activeAnnotationIndex) as number}
                                new={false}
                                setActiveAnnotationIndex={setActiveAnnotationIndex}
                                position={position3D}
                                uid={uid}
                                specimenName={specimenName}
                                setRepositionEnabled={setRepositionEnabled}
                                repositionEnabled={repositionEnabled}
                                setPosition3D={setPosition3D}
                                setAnnotationSavedOrDeleted={setAnnotationSavedOrDeleted}
                                annotationSavedOrDeleted={annotationSavedOrDeleted}
                                annotationModels={props.annotationModels}
                            />
                        }
                        {
                            // This indicates a databased annotation
                            typeof (activeAnnotationIndex) == 'number' && activeAnnotation && annotations && uid &&
                            <AnnotationEntry
                                index={getIndex(numberOfAnnotations as number, firstAnnotationPosition as string, activeAnnotationIndex) as number}
                                activeAnnotation={activeAnnotation}
                                specimenName={specimenName}
                                annotationType={activeAnnotationType}
                                new={false} setActiveAnnotationIndex={setActiveAnnotationIndex}
                                position={position3D}
                                uid={uid}
                                activeAnnotationPosition={activeAnnotationPosition}
                                setRepositionEnabled={setRepositionEnabled}
                                repositionEnabled={repositionEnabled}
                                setPosition3D={setPosition3D}
                                activeAnnotationTitle={activeAnnotationTitle}
                                setAnnotationSavedOrDeleted={setAnnotationSavedOrDeleted}
                                annotationSavedOrDeleted={annotationSavedOrDeleted}
                                annotationModels={props.annotationModels}
                            />
                        }
                        {
                            // This indicates a new annotation
                            typeof (activeAnnotationIndex) == 'string' &&
                            <AnnotationEntry
                                index={getIndex(numberOfAnnotations as number, firstAnnotationPosition as string, activeAnnotationIndex) as number}
                                new
                                setActiveAnnotationIndex={setActiveAnnotationIndex}
                                position={position3D}
                                uid={uid}
                                specimenName={specimenName}
                                setRepositionEnabled={setRepositionEnabled}
                                repositionEnabled={repositionEnabled}
                                setAnnotationSavedOrDeleted={setAnnotationSavedOrDeleted}
                                annotationSavedOrDeleted={annotationSavedOrDeleted}
                                annotationModels={props.annotationModels}
                            />
                        }
                    </section>
                </div>
            </div>
        </>
    )
}