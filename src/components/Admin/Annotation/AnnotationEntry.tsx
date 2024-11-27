/**
 * @file src/components/Admin/AnnotationEntry.tsx
 * 
 * @fileoverview interface for annotation CRUD operations
 * 
 * @todo extract and import create, update, delete and setImgSrc functions
 * @todo extract state logic with reducer and single state object for form fields
 * @todo convert data transfer states to context
 */

'use client'

// Import all annotation entry functions (aeFn = Annotation Entry Function)
import * as aeFn from '@/functions/client/annotationEntry'

// Typical imports
import { useState, useEffect, useContext, createContext, useReducer } from "react"
import { photo_annotation } from "@prisma/client"
import { Button } from "@nextui-org/react"
import { AnnotationEntryProps, annotationClientData, annotationEntryContext } from "@/interface/interface"
import { AnnotationClientData } from "./AnnotationClient"
import { getInitialAnnotationEntryData } from "@/interface/initializers"

// Default imports
import TextInput from "@/components/Shared/Form Fields/TextInput"
import RadioButtons from "@/components/Admin/AnnotationFields/RadioButtons"
import AnnotationReposition from "@/components/Admin/AnnotationFields/AnnotationReposition"
import FileInput from "@/components/Admin/AnnotationFields/ImageInput"
import License from "@/components/Admin/AnnotationFields/License"
import Annotation from "@/components/Admin/Annotation/Annotation"
import dynamic from "next/dynamic"
import ModelAnnotationSelect from "@/components/Admin/AnnotationFields/ModelAnnotationSelect"
import DataTransferModal from "@/components/Shared/Modals/DataTransferModal"
import annotationEntryReducer from "@/functions/client/reducers/AnnotationEntryData"
import initializeDataTransfer from '@/functions/client/dataTransfer/initializeDataTransfer'
import terminateDataTransfer from '@/functions/client/dataTransfer/terminateDataTransfer'
import dataTransferHandler from '@/functions/client/dataTransfer/dataTransferHandler'

const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'), { ssr: false })

export const AnnotationEntryData = createContext<annotationEntryContext | ''>('')

const AnnotationEntry = (props: AnnotationEntryProps) => {

    // Annotation client context
    const clientData = useContext(AnnotationClientData) as annotationClientData

    // Data from context
    const apData = clientData.annotationsAndPositions
    const specimen = clientData.specimenData

    // Dispatch from context
    const apDataDispatch = clientData.annotationsAndPositionsDispatch

    // Annotation entry data initialization
    const initialEntryData = getInitialAnnotationEntryData(apData)

    // Reducer
    const [annotationEntryData, annotationEntryDataDispatch] = useReducer(annotationEntryReducer, initialEntryData)

    // Context objext
    const annotationEntryContext: annotationEntryContext = { annotationEntryData, annotationEntryDataDispatch }

    // Data transfer modal states
    const [transferModalOpen, setTransferModalOpen] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [loadingLabel, setLoadingLabel] = useState<string>('')

    // New position boolean
    const isNewPosition = apData.position3D !== undefined ? true : false

    // Save/Create button enabled state
    const [createDisabled, setCreateDisabled] = useState<boolean>(true)
    const [saveDisabled, setSaveDisabled] = useState<boolean>(true)

    // Data transfer handlers for context
    const initializeDataTransferHandler = (loadingLabel: string) => initializeDataTransfer(setTransferModalOpen, setTransferring, setLoadingLabel, loadingLabel)
    const terminateDataTransferHandler = (result: string) => terminateDataTransfer(setResult, setTransferring, result)

    // Temporary close fn
    const close = (arg: boolean) => apDataDispatch({ type: 'annotationSavedOrDeleted' })

    // Set imgSrc from NFS storage
    const setImgSrc = () => annotationEntryDataDispatch({ type: 'setImageSource', path: aeFn.getImagePath(apData.activeAnnotation as photo_annotation) })

    // Create annoation handler
    const createAnnotation = async () => {
        // Simple handler for the first annotation (always taxonomy and description)
        if (props.index === 1) {
            const data = aeFn.firstAnnotationFormData(specimen.uid as string, apData.position3D as string, props.index.toString())
            dataTransferHandler(initializeDataTransferHandler, terminateDataTransferHandler, aeFn.insertAnnotation, [data], "Creating annotation")
        }
        // Handler for all other annotations
        else {
            const data = aeFn.annotationFormData(annotationEntryData, specimen.uid as string, props.index.toString(), apData.position3D as string)
            dataTransferHandler(initializeDataTransferHandler, terminateDataTransferHandler, aeFn.insertAnnotation, [data], "Creating annotation")
        }
    }

    // Update annotation handler
    const updateAnnotation = async () => {
        if (props.index == 1) {
            const data = aeFn.annotationFormData(annotationEntryData, specimen.uid as string, props.index.toString(), apData.position3D as string)
            dataTransferHandler(initializeDataTransferHandler, terminateDataTransferHandler, aeFn.insertAnnotation, [data, 'PATCH'], "Updating annotation")
        }
        else {
            const data = aeFn.annotationUpdateData(annotationEntryData, apData, specimen)
            dataTransferHandler(initializeDataTransferHandler, terminateDataTransferHandler, aeFn.insertAnnotation, [data, 'PATCH'], "Updating annotation")
        }
    }

    // Delete annotation handler
    const deleteAnnotation = async () => {
        const data = aeFn.deleteAnnotationData(apData, specimen.uid as string)
        dataTransferHandler(initializeDataTransferHandler, terminateDataTransferHandler, aeFn.insertAnnotation, [data, 'DELETE'], "Deleting annotation")
    }

    // This effect updates annotation image visibility and source
    useEffect(() => {

        // This code shouldn't run for the first annotation
        if (props.index !== 1 && annotationEntryData.annotationType === 'photo') {

            // Determine image visibility
            if (!annotationEntryData.file && !props.new) annotationEntryDataDispatch({ type: 'setImageVisibility', isVisible: true })
            else annotationEntryDataDispatch({ type: 'setImageVisibility', isVisible: false })
        }

    }, [props.new, annotationEntryData.annotationType, props.index, annotationEntryData.file, apData.activeAnnotation])

    // This effect populates all relevant form fields with the corresponding data when there is an active annotation that has already been databased
    useEffect(() => {

        // Populate fields if there is an annotation pulled from the db
        if (apData.activeAnnotationType && apData.activeAnnotation) {
            // Set states for photo annotation
            if (apData.activeAnnotationType === 'photo') { annotationEntryDataDispatch({ type: 'loadPhotoAnnotation', apData: apData }); setImgSrc() }
            // Set for video annotation
            else if (apData.activeAnnotationType === 'video') annotationEntryDataDispatch({ type: 'loadVideoAnnotation', apData: apData })
            // Set states for model annotation
            else if (apData.activeAnnotationType === 'model') annotationEntryDataDispatch({ type: 'loadModelAnnotation', apData: apData })
        }
    }, [apData.activeAnnotation]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect enables the 'save changes' button for databased annoations if all required fields are populated and at least one differs from the data from the database
    // For new annotations, it enables the 'create annotation' button if all required fields are populated
    useEffect(() => {

        // For first annotation (always tax and description)
        if (props.index == 1) {

            // Enable button if an annotation position has been selected
            if (apData.position3D) {
                setCreateDisabled(false)
                setSaveDisabled(false)
            }
            // Else disbale it
            else {
                setSaveDisabled(true)
                setCreateDisabled(true)
            }
        }
        // Photo annotation save/update enabler
        else if (annotationEntryData.annotationType == 'photo') {
            switch (props.new) {
                case false: aeFn.enablePhotoAnnotatonUpdate(apData, annotationEntryData, setSaveDisabled, isNewPosition); break
                default: aeFn.enablePhotoAnnotationCreate(annotationEntryData, setCreateDisabled, apData.position3D as string); break
            }
        }
        // Video annotation save/update enabler
        else if (annotationEntryData.annotationType == 'video') {
            switch (props.new) {
                case false: aeFn.enableVideoAnnotationUpdate(apData, annotationEntryData, isNewPosition, setSaveDisabled); break
                default: aeFn.enableVideoAnnotationCreate(annotationEntryData, apData.position3D as string, setCreateDisabled); break
            }
        }

        // Model annotation save/update enabler
        else if (annotationEntryData.annotationType == 'model') {
            switch (props.new) {
                case false: aeFn.enableModelAnnotationUpdate(annotationEntryData, apData, isNewPosition, setSaveDisabled); break
                default: aeFn.enableModelAnnotationCreate(annotationEntryData, apData.position3D as string, setCreateDisabled); break
            }
        }

    }, [annotationEntryData.annotationTitle, apData.position3D, annotationEntryData.url, annotationEntryData.author, annotationEntryData.license, annotationEntryData.annotation,
    annotationEntryData.file, length, annotationEntryData.photoTitle, annotationEntryData.website, annotationEntryData.modelAnnotationUid, annotationEntryData.videoSource]) // eslint-disable-line react-hooks/exhaustive-deps

    if (props.index == 1) {
        return (
            <>
                <DataTransferModal
                    open={transferModalOpen}
                    transferring={transferring}
                    result={result}
                    loadingLabel={loadingLabel as string}
                    closeFn={close}
                    closeVar={apData.annotationSavedOrDeleted}
                />

                <div className="w-[98%] h-fit flex flex-col border border-[#004C46] dark:border-white mt-4 ml-[1%] rounded-xl">
                    <p className="text-2xl mb-4 mt-2 ml-12">Annotation {props.index} <span className="ml-8">(This annotation is always taxonomy and description)</span></p>
                    <section className="flex justify-between mt-4 mb-8">
                        {
                            !props.new &&
                            <>
                                <AnnotationReposition />
                                <div>
                                    <Button onClick={() => updateAnnotation()} className="text-white text-lg mr-12" isDisabled={saveDisabled}>Save Changes</Button>
                                </div>
                            </>
                        }
                        {
                            props.new &&
                            <div className="flex justify-end w-full">
                                <Button onClick={() => createAnnotation()} className="text-white text-lg mr-12" isDisabled={createDisabled}>Create Annotation</Button>
                            </div>
                        }
                    </section>
                </div>
            </>
        )
    }

    return (
        <AnnotationEntryData.Provider value={annotationEntryContext}>
            <DataTransferModal
                open={transferModalOpen}
                transferring={transferring}
                result={result}
                loadingLabel='Saving Changes'
                closeFn={close}
                closeVar={apData.annotationSavedOrDeleted} />

            <div className="w-[98%] min-w-[925px] h-fit flex flex-col border border-[#004C46] dark:border-white mt-4 ml-[1%] rounded-xl">
                <section className="flex justify-around">
                    {
                        !props.new &&
                        <AnnotationReposition />
                    }
                    <p className="text-2xl mb-4 mt-2">Annotation {props.index}</p>
                    <section className="flex">
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center">
                                <RadioButtons />
                            </div>
                        </div>
                    </section>
                </section>
                <section className="w-full h-fit">
                    {
                        annotationEntryData.annotationType == 'photo' && annotationEntryData.mediaType && annotationEntryData.mediaType === 'upload' &&
                        <section className="mt-4 w-full h-fit">
                            <div className="flex h-[530px]">
                                <div className="flex flex-col w-1/2">
                                    <div className="ml-12">
                                        <TextInput value={annotationEntryData.annotationTitle as string} field={'annotationTitle'} title='Annotation Title' required />
                                    </div>

                                    <div className="ml-12 mb-4">
                                        <FileInput />
                                    </div>

                                    <div className="ml-12">
                                        <TextInput value={annotationEntryData.author as string} field={'author'} title='Author' required />
                                        <License license={annotationEntryData.license} field='license' />
                                        <TextInput value={annotationEntryData.photoTitle as string} field={'photoTitle'} title='Photo Title' />
                                        <TextInput value={annotationEntryData.website as string} field={'website'} title='Website' />
                                    </div>

                                </div>
                                {
                                    annotationEntryData.imageVisible &&
                                    <img className='rounded-sm inline-block w-1/2 max-w-[600px] h-full' src={annotationEntryData.imageSource as string} alt={'Annotation Image'}></img>
                                }
                            </div>
                            <div className="ml-12">
                                <Annotation annotation={annotationEntryData.annotation} field='annotation' />
                            </div>
                        </section>
                    }
                    {
                        annotationEntryData.annotationType == 'video' &&
                        <section className="flex my-12">
                            <div className="flex ml-12 mt-12 flex-col w-1/2 max-w-[750px]">
                                <TextInput value={annotationEntryData.annotationTitle as string} field='annotationTitle' title='Annotation Title' required />
                                <TextInput value={annotationEntryData.videoSource as string} field='videoSource' title='URL' required />
                                <TextInput value={annotationEntryData.length as string} field='length' title='Length' required />
                            </div>
                            <div className="flex h-[50vh] w-[45%]">
                                {
                                    annotationEntryData.videoSource?.includes('https://www.youtube.com/embed/') &&
                                    <iframe
                                        src={annotationEntryData.videoSource}
                                        className="h-full w-full ml-[1%] rounded-xl"
                                    >
                                    </iframe>
                                }
                            </div>
                        </section>
                    }
                    {
                        annotationEntryData.annotationType === 'model' &&
                        <section className="flex my-12 w-full">
                            <div className="flex ml-12 mt-12 flex-col w-3/5 max-w-[750px] mr-12">
                                <TextInput value={annotationEntryData.annotationTitle as string} field={'annotationTitle'} title='Annotation Title' required />
                                <ModelAnnotationSelect value={annotationEntryData.modelAnnotationUid} field={'modelAnnotationUid'} modelAnnotations={props.annotationModels} />
                                <Annotation annotation={annotationEntryData.annotation} field='annotation' />
                            </div>
                            {
                                annotationEntryData.modelAnnotationUid && annotationEntryData.modelAnnotationUid !== 'select' &&
                                <div className="w-full mr-12">
                                    <ModelViewer uid={annotationEntryData.modelAnnotationUid} />
                                </div>
                            }
                        </section>
                    }
                </section>
                <section className="flex justify-end mb-8">
                    {
                        props.new &&
                        <>
                            <Button onClick={() => createAnnotation()} className="text-white text-lg mr-8" isDisabled={createDisabled}>Create Annotation</Button>
                        </>
                    }
                    {
                        !props.new && props.index !== 1 &&
                        <div>
                            <Button onClick={() => updateAnnotation()} className="text-white text-lg mr-2" isDisabled={saveDisabled}>Save Changes</Button>
                            <Button onClick={() => deleteAnnotation()} color="danger" variant="light" className="mr-2">Delete Annotation</Button>
                        </div>
                    }

                </section>
            </div>
        </AnnotationEntryData.Provider>
    )
}
export default AnnotationEntry
