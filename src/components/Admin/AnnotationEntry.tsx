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

import { useState, useEffect, SetStateAction, Dispatch } from "react"
import { model_annotation, photo_annotation, video_annotation } from "@prisma/client"
import { Button } from "@nextui-org/react"
import { v4 as uuidv4 } from 'uuid'
import { AnnotationEntryProps } from "@/interface/interface"

import TextInput from "../Shared/Form Fields/TextInput"
import RadioButtons from "./AnnotationFields/RadioButtons"
import AnnotationReposition from "./AnnotationFields/AnnotationReposition"
import FileInput from "./AnnotationFields/ImageInput"
import License from "./AnnotationFields/License"
import Annotation from "./Annotation"
import dynamic from "next/dynamic"
import ModelAnnotationSelect from "./AnnotationFields/ModelAnnotationSelect"
import DataTransferModal from "../Shared/Modals/DataTransferModal"

const ModelViewer = dynamic(() => import('../Shared/ModelViewer'), { ssr: false })

const AnnotationEntry = (props: AnnotationEntryProps) => {

    /***** Variable declarations *****/

    // Lightweight functions used to enable annotation creation/save edits
    const allTruthy = (value: any) => value ? true : false
    const allSame = (originalValues: any[], currentValues: any[]) => JSON.stringify(originalValues) === JSON.stringify(currentValues) ? true : false
    const isNewPosition = props.position !== undefined ? true : false

    // Radio Buttons
    const [photoChecked, setPhotoChecked] = useState<boolean>()
    const [videoChecked, setVideoChecked] = useState<boolean>()
    const [modelChecked, setModelChecked] = useState<boolean>()

    // Radio button resultant states
    const [annotationType, setAnnotationType] = useState<string>('')
    const [mediaType, setMediaType] = useState<string>()
    const [imageVisible, setImageVisible] = useState<boolean>()

    // Form fields
    const [annotationTitle, setAnnotationTitle] = useState<string>()
    const [url, setUrl] = useState<string>((props.activeAnnotation as photo_annotation)?.url ?? '')
    const [file, setFile] = useState<File>()
    const [author, setAuthor] = useState<string>((props.activeAnnotation as photo_annotation)?.author ?? '')
    const [license, setLicense] = useState<string>((props.activeAnnotation as photo_annotation)?.license ?? '')
    const [photoTitle, setPhotoTitle] = useState<string>((props.activeAnnotation as photo_annotation)?.title ?? '')
    const [website, setWebsite] = useState<string>((props.activeAnnotation as photo_annotation)?.website ?? '')
    const [annotation, setAnnotation] = useState<string>((props.activeAnnotation as photo_annotation)?.annotation ?? '')
    const [length, setLength] = useState<string>((props.activeAnnotation as video_annotation)?.length ?? '')
    const [imageSource, setImageSource] = useState<string>()
    const [videoSource, setVideoSource] = useState<string>('')
    const [modelAnnotationUid, setModelAnnotationUid] = useState<string>('select')


    // Data transfer modal states
    const [transferModalOpen, setTransferModalOpen] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [loadingLabel, setLoadingLabel] = useState<string>()

    // Save/Create button enabled state
    const [createDisabled, setCreateDisabled] = useState<boolean>(true)
    const [saveDisabled, setSaveDisabled] = useState<boolean>(true)

    // Set imgSrc from NFS storage
    const setImgSrc = async () => {
        const annotation = props.activeAnnotation as photo_annotation
        const path = process.env.NEXT_PUBLIC_LOCAL === 'true' ? `X:${annotation.url.slice(5)}` : `public${annotation.url}`
        setImageSource(`/api/nfs?path=${path}`)
    }

    // This is the createAnnotaion function, calling the appropriate route handler when the 'save changes' button is depressed
    const createAnnotation = async () => {

        const data = new FormData()

        // Simple handler for the first annotation (always taxonomy and description)
        if (props.index == 1) {
            data.set('uid', props.uid as string)
            data.set('position', props.position as string)
            data.set('index', props.index.toString())

            // Open transfer modal and set spinner
            setTransferModalOpen(true)
            setTransferring(true)
            setLoadingLabel('Creating annotation...')

            // Fetch route handler - set modal result
            await fetch('/api/annotations', {
                method: 'POST',
                body: data
            }).then(res => res.json()).then(json => {
                setResult(json.data)
                setTransferring(false)
            })
        }

        // Handler for annotations with non-hosted photos
        else {

            // Annotations table data
            data.set('uid', props.uid as string)
            data.set('annotation_no', props.index.toString())
            data.set('annotation_type', annotationType)
            data.set('position', props.position as string)
            data.set('title', annotationTitle as string)

            // Set relevant data based on annotationType
            switch (annotationType) {

                case 'video':
                    // Video_annotation table data
                    data.set('length', length)
                    data.set('url', videoSource)

                    break

                case 'model':
                    // Model_annotation table data
                    data.set('modelAnnotationUid', modelAnnotationUid as string)
                    data.set('annotation', annotation)

                    break

                default:

                    // Photo_annotation table data
                    data.set('author', author)
                    data.set('license', license)
                    data.set('annotation', annotation)
                    if (photoTitle) data.set('photoTitle', photoTitle)
                    if (website) data.set('website', website)
            }

            // Shared data (url was formerly the foreign key)
            const annotationId = uuidv4()
            data.set('annotation_id', annotationId)

            // Directory, path and url data
            const photo = file as File
            data.set('dir', `public/data/Herbarium/Annotations/${props.uid}/${annotationId}`)
            data.set('path', `public/data/Herbarium/Annotations/${props.uid}/${annotationId}/${photo.name}`)
            data.set('url', `/data/Herbarium/Annotations/${props.uid}/${annotationId}/${photo.name}`)


            // Route handler data
            data.set('mediaType', mediaType as string)
            data.set('file', photo)

            // Open transfer modal and set spinner
            setTransferModalOpen(true)
            setTransferring(true)

            // Fetch route handler - set modal result
            await fetch('/api/annotations', {
                method: 'POST',
                body: data
            }).then(res => res.json()).then(json => {
                setResult(json.data)
                setTransferring(false)
            })
        }
    }

    // Update annotation function
    const updateAnnotation = async () => {
        const data = new FormData()

        // Simple handler for the first annotation (always taxonomy and description)
        if (props.index == 1) {
            data.set('uid', props.uid as string)
            data.set('position', props.position as string)
            data.set('index', props.index.toString())

            // Open transfer modal and set spinner
            setTransferModalOpen(true)
            setTransferring(true)
            setLoadingLabel('Updating annotation...')

            // Fetch route handler - set modal result
            await fetch('/api/annotations', {
                method: 'PATCH',
                body: data
            }).then(res => res.json()).then(json => {
                setResult(json.data)
                setTransferring(false)
            })
        }

        // Handler for annotations with non-hosted photos
        else {

            // Media transition data
            if (props.annotationType !== annotationType) {
                data.set('mediaTransition', 'true')
                data.set('previousMedia', props.annotationType as string)
            }

            // Annotations table data (for update)
            data.set('uid', props.uid as string)
            data.set('annotation_type', annotationType)
            data.set('position', props.position as string ?? props.activeAnnotationPosition)
            data.set('title', annotationTitle as string)

            // Set relevant data based on annotationType
            switch (annotationType) {

                // Video_annotation table data
                case 'video':
                    data.set('length', length)
                    data.set('url', videoSource)

                    break

                // Model_annotation table data
                case 'model':
                    data.set('modelAnnotationUid', modelAnnotationUid as string)
                    data.set('annotation', annotation)

                    break

                // Photo_annotation table data
                default:
                    data.set('author', author)
                    data.set('license', license)
                    data.set('annotation', annotation)
                    if (photoTitle) data.set('photoTitle', photoTitle)
                    if (website) data.set('website', website)
            }

            // Shared data (url was formerly the foreign key)
            // Note that the url is the url necessary from the collections page; also note the old path must be inlcuded for deletion; also note that a new id is not generated for update
            data.set('annotation_id', (props.activeAnnotation as photo_annotation | video_annotation).annotation_id)
            data.set('specimenName', props.specimenName as string)

            // Set relevant form data if there is a new photo file
            if (file) {
                const photo = file as File
                const annotation = props.activeAnnotation as photo_annotation
                data.set('dir', `public/data/Herbarium/Annotations/${props.uid}/${annotation.annotation_id}`)
                data.set('path', `public/data/Herbarium/Annotations/${props.uid}/${annotation.annotation_id}/${photo.name}`)
                data.set('url', `/data/Herbarium/Annotations/${props.uid}/${annotation.annotation_id}/${photo.name}`)
                data.set('file', photo)
                if (props.annotationType === 'photo') data.set('oldUrl', (props.activeAnnotation as photo_annotation).url)
            }

            // Else if the databased annotation is a photo, the url should be the same
            else if (props.annotationType === 'photo') data.set('url', (props.activeAnnotation as photo_annotation).url)

            // Route handler data
            data.set('mediaType', mediaType as string)

            // Open transfer modal and set spinner
            setTransferModalOpen(true)
            setTransferring(true)

            // Fetch route handler - set modal result
            await fetch('/api/annotations', {
                method: 'PATCH',
                body: data
            }).then(res => res.json()).then(json => {
                setResult(json.data)
                setTransferring(false)
                if (process.env.NODE_ENV === 'development') console.log(json.response)
            })
        }
    }

    // Delete annotation function
    const deleteAnnotation = async () => {

        // request body
        const requestObj = {
            annotation_id: props.activeAnnotation?.annotation_id,
            modelUid: props.uid,
            oldUrl: props.annotationType === 'photo' ? (props.activeAnnotation as photo_annotation).url : ''
        }

        // Open transfer modal and set spinner
        setTransferModalOpen(true)
        setTransferring(true)
        setLoadingLabel('Deleting annotation...')

        // Fetch delete, set modal states
        await fetch('/api/annotations', {
            method: 'DELETE',
            body: JSON.stringify(requestObj)
        }).then(res => res.json()).then(json => {
            setResult(json.data)
            setTransferring(false)
        })
    }

    // This effect updates annotation image visibility and source
    useEffect(() => {

        // This code shouldn't run for the first annotation
        if (props.index !== 1 && annotationType === 'photo') {

            // Determine image visibility
            if (!file && !props.new) setImageVisible(true)
            else setImageVisible(false)
        }

    }, [props.new, annotationType, props.index, file, props.activeAnnotation])

    // This effect populates all relevant form fields with the corresponding data when there is an active annotation that has already been databased
    useEffect(() => {

        // Populate fields if there is an annotation pulled from the db
        if (props.annotationType && props.activeAnnotation) {

            // Set states for photo annotation
            if (props.annotationType === 'photo') {

                const annotation = props.activeAnnotation as photo_annotation

                setAnnotationType(props.annotationType)
                setUrl(annotation.url)
                setAuthor(annotation.author)
                setLicense(annotation.license)
                setPhotoTitle(annotation.title as string)
                setWebsite(annotation.website as string)
                setAnnotation(annotation.annotation)
                setAnnotationTitle(props.activeAnnotationTitle)
                setImgSrc()

                setAnnotationType(props.annotationType)
                setMediaType('upload')
                setPhotoChecked(true)
                setVideoChecked(false)
                setModelChecked(false)
            }

            // Set for video annotation
            else if (props.annotationType === 'video') {

                setLength((props.activeAnnotation as video_annotation).length as string)
                setVideoSource((props.activeAnnotation as video_annotation).url)

                setAnnotationType(props.annotationType)
                setMediaType('url')
                setVideoChecked(true)
                setPhotoChecked(false)
                setModelChecked(false)
                setAnnotationType(props.annotationType)
            }

            // Set states for model annotation
            else if (props.annotationType === 'model') {

                setModelAnnotationUid((props.activeAnnotation as model_annotation).uid as string)
                setAnnotation((props.activeAnnotation as model_annotation).annotation)
                setAnnotationType(props.annotationType)

                setAnnotationType(props.annotationType)
                setMediaType('model')
                setModelChecked(true)
                setVideoChecked(false)
                setPhotoChecked(false)
            }
        }
    }, [props.activeAnnotation]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect enables the 'save changes' button for databased annoations if all required fields are populated and at least one differs from the data from the database
    // For new annotations, it enables the 'create annotation' button if all required fields are populated
    useEffect(() => {

        // For first annotation (always tax and description)
        if (props.index == 1) {

            // Enable button if an annotation position has been selected
            if (props.position) {
                setCreateDisabled(false)
                setSaveDisabled(false)
            }

            // Else disbale it
            else {
                setSaveDisabled(true)
                setCreateDisabled(true)
            }
        }

        // Conditional based on radio button state
        else if (annotationType == 'photo') {

            switch (props.new) {

                // For databased annotations
                case false:

                    // Type assertion for brevity
                    const caseAnnotation = props.activeAnnotation as photo_annotation

                    // Required value arrays for comparison
                    const originalValues = [props.activeAnnotationTitle, caseAnnotation.author, caseAnnotation.license, caseAnnotation.annotation]
                    const currentValues = [annotationTitle, author, license, annotation]

                    // Optional value arrays for comparison
                    const originalOptionalValues = [caseAnnotation.title, caseAnnotation.website]
                    const optionalValues = [photoTitle, website]

                    // If all required fields are populated and: they are different from the original, there is a new file, there is a new annotation position, or optional values have changed, enable "save changes"
                    if (currentValues.every(allTruthy) && (!allSame(originalValues, currentValues) || file || isNewPosition || !allSame(originalOptionalValues, optionalValues))) setSaveDisabled(false)
                    else setSaveDisabled(true)

                    break

                // New annotations are the default
                default:

                    // Required fields
                    const valueArray = [annotationTitle, file, author, license, annotation, props.position]

                    // Enable button if all required fields are populated
                    if (valueArray.every(allTruthy)) setCreateDisabled(false)
                    else setCreateDisabled(true)

                    break
            }
        }

        // Conditional based on radio button state
        else if (annotationType == 'video') {

            switch (props.new) {

                case false:

                    // Type assertion, required value arrays
                    const caseAnnotation = props.activeAnnotation as video_annotation
                    const originalValues = [props.activeAnnotationTitle, caseAnnotation.url, caseAnnotation.length]
                    const currentValues = [annotationTitle, videoSource, length]

                    // If all required fields are populated and: they are different from the original, or there is a new position, then enable "save changes"
                    if (currentValues.every(allTruthy) && (!allSame(originalValues, currentValues) || isNewPosition)) setSaveDisabled(false)
                    else setSaveDisabled(true)

                    break

                default:

                    // Required fields
                    const valueArray = [annotationTitle, videoSource, length, props.position]

                    // Enable button if all required fields are populated
                    if (valueArray.every(allTruthy)) setCreateDisabled(false)
                    else setCreateDisabled(true)

                    break
            }
        }

        // Conditional based on radio button states
        else if (annotationType == 'model') {

            switch (props.new) {

                case false:

                    // Type assertion, required value arrays
                    const caseAnnotation = props.activeAnnotation as model_annotation
                    const originalValues = [props.activeAnnotationTitle, caseAnnotation.uid, caseAnnotation.annotation]
                    const currentValues = [annotationTitle, modelAnnotationUid, annotation]

                    // If all required fields are populated and: they are different from the original, or there is a new position, then enable "save changes"
                    if (currentValues.every(allTruthy) && (!allSame(originalValues, currentValues) || isNewPosition)) setSaveDisabled(false)
                    else setSaveDisabled(true)

                    break

                default:

                    // Required fields
                    const valueArray = [annotationTitle, modelAnnotationUid, annotation, props.position]

                    // Enable button if all required fields are populated
                    if (valueArray.every(allTruthy)) setCreateDisabled(false)
                    else setCreateDisabled(true)

                    break
            }
        }

    }, [annotationTitle, props.position, url, author, license, annotation, file, length, photoTitle, website, modelAnnotationUid, videoSource]) // eslint-disable-line react-hooks/exhaustive-deps

    if (props.index == 1) {
        return (
            <>
                <DataTransferModal open={transferModalOpen} transferring={transferring} result={result} loadingLabel={loadingLabel as string} closeFn={props.setAnnotationSavedOrDeleted} closeVar={props.annotationSavedOrDeleted} />

                <div className="w-[98%] h-fit flex flex-col border border-[#004C46] dark:border-white mt-4 ml-[1%] rounded-xl">
                    <p className="text-2xl mb-4 mt-2 ml-12">Annotation {props.index} <span className="ml-8">(This annotation is always taxonomy and description)</span></p>
                    <section className="flex justify-between mt-4 mb-8">
                        {
                            !props.new &&
                            <>
                                <AnnotationReposition repositionEnabled={props.repositionEnabled} setRepositionEnabled={props.setRepositionEnabled} setPosition3D={props.setPosition3D as Dispatch<SetStateAction<string | undefined>>} />
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

    else {
        return (
            <>
                <DataTransferModal open={transferModalOpen} transferring={transferring} result={result} loadingLabel='Saving Changes' closeFn={props.setAnnotationSavedOrDeleted} closeVar={props.annotationSavedOrDeleted} />

                <div className="w-[98%] h-fit flex flex-col border border-[#004C46] dark:border-white mt-4 ml-[1%] rounded-xl">
                    <section className="flex justify-around">
                        {
                            !props.new &&
                            <AnnotationReposition repositionEnabled={props.repositionEnabled} setRepositionEnabled={props.setRepositionEnabled} setPosition3D={props.setPosition3D as Dispatch<SetStateAction<string | undefined>>} />
                        }
                        <p className="text-2xl mb-4 mt-2">Annotation {props.index}</p>
                        <section className="flex">
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center">
                                    <RadioButtons
                                        setAnnotationType={setAnnotationType}
                                        setPhotoChecked={setPhotoChecked as Dispatch<SetStateAction<boolean>>}
                                        setVideoChecked={setVideoChecked as Dispatch<SetStateAction<boolean>>}
                                        setMediaType={setMediaType as Dispatch<SetStateAction<string>>}
                                        setModelChecked={setModelChecked as Dispatch<SetStateAction<boolean>>}
                                        photoChecked={photoChecked as boolean}
                                        videoChecked={videoChecked as boolean}
                                        annotationType={annotationType}
                                        modelChecked={modelChecked as boolean}
                                    />
                                </div>
                            </div>
                        </section>
                    </section>
                    <section className="w-full h-fit">
                        {
                            annotationType == 'photo' && mediaType && mediaType === 'upload' &&
                            <section className="mt-4 w-full h-fit">
                                <div className="flex h-[530px]">
                                    <div className="flex flex-col w-1/2">
                                        <div className="ml-12">
                                            <TextInput value={annotationTitle as string} setValue={setAnnotationTitle as Dispatch<SetStateAction<string>>} title='Annotation Title' required />
                                        </div>

                                        <div className="ml-12 mb-4">
                                            <FileInput setFile={setFile as Dispatch<SetStateAction<File>>} />
                                        </div>

                                        <div className="ml-12">
                                            <TextInput value={author as string} setValue={setAuthor} title='Author' required />
                                            <License setLicense={setLicense} license={license} />
                                            <TextInput value={photoTitle as string} setValue={setPhotoTitle} title='Photo Title' />
                                            <TextInput value={website as string} setValue={setWebsite} title='Website' />
                                        </div>

                                    </div>
                                    {
                                        imageVisible &&
                                        <img className='rounded-sm inline-block w-1/2 max-w-[600px] h-full' src={imageSource as string} alt={'Annotation Image'}></img>
                                    }
                                </div>
                                <div className="ml-12">
                                    <Annotation annotation={annotation} setAnnotation={setAnnotation} />
                                </div>
                            </section>
                        }
                        {
                            annotationType == 'video' &&
                            <section className="flex my-12">
                                <div className="flex ml-12 mt-12 flex-col w-1/2 max-w-[750px]">
                                    <TextInput value={annotationTitle as string} setValue={setAnnotationTitle as Dispatch<SetStateAction<string>>} title='Annotation Title' required />
                                    <TextInput value={videoSource as string} setValue={setVideoSource} title='URL' required />
                                    <TextInput value={length as string} setValue={setLength} title='Length' required />
                                </div>
                                <div className="flex h-[50vh] w-[45%]">
                                    {
                                        videoSource?.includes('https://www.youtube.com/embed/') &&
                                        <iframe
                                            src={videoSource}
                                            className="h-full w-full ml-[1%] rounded-xl"
                                        >
                                        </iframe>
                                    }
                                </div>
                            </section>
                        }
                        {
                            annotationType === 'model' &&
                            <section className="flex my-12 w-full">
                                <div className="flex ml-12 mt-12 flex-col w-3/5 max-w-[750px] mr-12">
                                    <TextInput value={annotationTitle as string} setValue={setAnnotationTitle as Dispatch<SetStateAction<string>>} title='Annotation Title' required />
                                    <ModelAnnotationSelect value={modelAnnotationUid} setValue={setModelAnnotationUid} modelAnnotations={props.annotationModels} />
                                    <Annotation annotation={annotation} setAnnotation={setAnnotation} />
                                </div>
                                {
                                    modelAnnotationUid && modelAnnotationUid !== 'select' &&
                                    <div className="w-1/3">
                                        <ModelViewer uid={modelAnnotationUid} />
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
            </>
        )
    }
}
export default AnnotationEntry
