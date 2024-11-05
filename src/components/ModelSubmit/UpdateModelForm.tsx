'use client'

import { useState, useRef, useEffect, RefObject } from 'react';
import axios, { AxiosHeaderValue } from 'axios';
import ProcessSelect from './ProcessSelectField';
import { Button } from "@nextui-org/react";
import { Divider } from '@nextui-org/react';
import TagInput from './Tags';
import Leaflet, { LatLngLiteral } from 'leaflet';
import FormMap from '../Map/Form';
import DataTransferModal from '../Shared/Modals/DataTransferModal';
import { UpdateModelFormProps } from '@/api/types';
import TextInput from '../Shared/Form Fields/TextInput';
import AutoCompleteWrapper from '../Shared/Form Fields/AutoCompleteWrapper';
import DateInput from '../Shared/Form Fields/DateInput';

export default function UpdateModelForm(props: UpdateModelFormProps) {

    // Variable initialization

    const model = props.model
    var uid: string
    const tagArr = model.tags.map((tagObject) => tagObject.tag)
    const softwareArr = model.software.map((softwareObject) => softwareObject.software)
    var tagString = ''
    var softwareString = ''

    for (let i in tagArr) {
        tagString += tagArr[i] + ','
    }
    for (let i in softwareArr) {
        softwareString += softwareArr[i] + ','
    }

    const [speciesName, setSpeciesName] = useState<string>(model.spec_name)
    const [acquisitionDate, setAcquisitionDate] = useState<string | undefined>(model.spec_acquis_date ?? undefined)
    //@ts-ignore - Decimal appears to be equal to number, contrary to the error
    const [position, setPosition] = useState<Leaflet.LatLngExpression | null>({ lat: model.lat, lng: model.lng })
    const [reRenderKey, setReRenderKey] = useState<number>(Math.random())
    const [reRenderKey1, setReRenderKey1] = useState<number>(Math.random())
    const [uploadDisabled, setUploadDisabled] = useState<boolean>(true)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [open, setOpen] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [modeler, setModeler] = useState<string>(model.modeled_by)

    const artistName = useRef<string>(model.modeled_by)
    const radioValue = useRef<string>(model.build_process)
    const software = useRef<string>(model.software[0].software)
    const file = useRef<File | null>(null)
    const softwareArray = useRef<Array<object>>()
    const tagArray = useRef<Array<object>>()
    //@ts-ignore - Decimal appears to be equal to number, contrary to the error
    const positionRef = useRef<LatLngLiteral>({ lat: model.lat, lng: model.lng })
    const speciesAcquisitionDate = useRef<HTMLInputElement>()

    // Handler that is called everytime a field is updated; it checks all mandatory fields for values, enabling the upload button if those fields exist

    const isUploadable = () => {
        if (speciesName && artistName.current && radioValue.current && software.current && file.current && positionRef.current) { setUploadDisabled(false) }
        else { setUploadDisabled(true) }
    }

    // This is the database entry handler
    const modelDbEntry = async () => {
        //softwareArray.current.unshift(software.current)

        const data = {
            email: props.email,
            artist: artistName.current,
            species: speciesName,
            methodology: radioValue.current,
            uid: uid,
            software: softwareArray.current,
            tags: tagArray.current,
            position: positionRef.current,
            speciesAcquisitionDate: (speciesAcquisitionDate.current as HTMLInputElement).value ?? null,
            user: props.user
        }
        await fetch('/api/modelSubmit', {
            method: 'POST',
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(json => {
                setResult(json.data)
                setTransferring(false)
            })
            .catch(e => {
                setResult(e.message)
                setTransferring(false)
            })
    }

    // Upload handler

    const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {

        e.preventDefault()
        setOpen(true)
        setTransferring(true)

        // Handler for fileUpload
        if (!file.current) return

        try {
            //Create / set formData
            const data = new FormData()

            data.set('orgProject', props.projectUid)
            data.set('modelFile', file.current)
            data.set('visibility', 'private')
            data.set('options', JSON.stringify({ background: { color: "#000000" } }))

            // Axios request features upload progress
            const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${props.orgUid}/models`

            const res = await axios.post(orgModelUploadEnd, data, {
                onUploadProgress: (axiosProgressEvent) => setUploadProgress(axiosProgressEvent.progress as number),
                headers: {
                    'Authorization': props.token as AxiosHeaderValue
                }
            }).catch((e) => {
                if (process.env.NODE_ENV === 'development') console.error(e.message)
                throw Error("Couldn't upload model")
            })

            // Grab uid of model for db for storage
            uid = res.data.uid

            // We then make a post request to our route handler which creates a db record containing the metadata associated with the model
            await modelDbEntry()
        }
        catch (e: any) {
            setResult(e.message)
            setTransferring(false)
        }
    }

    useEffect(() => {
        setSpeciesName(props.model.spec_name)
        setAcquisitionDate(model.spec_acquis_date ?? undefined)
        //@ts-ignore - Decimal appears to be equal to number, contrary to the error
        setPosition({ lat: model.lat, lng: model.lng })
        setReRenderKey(reRenderKey + 1)
        setReRenderKey1(reRenderKey1 + 1)
    }, [props.model])

    return (
        <>
            <DataTransferModal open={open} transferring={transferring} result={result} loadingLabel='Uploading 3D Model' href='/admin' modelUpload progress={uploadProgress} />
            <form className='w-full lg:w-3/5 lg:border-2 m-auto lg:border-[#004C46] lg:rounded-md bg-[#D5CB9F] dark:bg-[#212121] lg:mb-16'>
                <Divider />
                <div className='flex items-center h-[75px]'>
                    <p className='ml-12 text-3xl'>Specimen Data</p>
                </div>
                <Divider className='mb-6' />
                <AutoCompleteWrapper value={speciesName} setValue={setSpeciesName} />
                <DateInput value={acquisitionDate} setValue={setAcquisitionDate} />
                <FormMap position={position} setPosition={setPosition} ref={positionRef} title />
                <TagInput key={reRenderKey} ref={tagArray as RefObject<object[]>} defaultValues={tagString} />
                <Divider className='mt-8' />
                <h1 className='ml-12 text-3xl mt-4 mb-4'>Model Data</h1>
                <Divider className='mb-8' />
                <TextInput value={modeler} setValue={setModeler} title='3D Modeler Name' required leftMargin='ml-12' textSize='text-2xl' />
                <ProcessSelect ref={radioValue} handler={isUploadable} defaultValue={model.build_process} />
                <TagInput key={reRenderKey1} ref={softwareArray as RefObject<object[]>} defaultValues={softwareString} title='Enter any software used to create the model' marginTop='mt-12' marginBottom='mb-4'/>
                <div className='my-6 mx-12'>
                    <p className='text-2xl mb-6'>Select your 3D model file.
                        The supported file formats can be found <a href='https://support.fab.com/s/article/Supported-3D-File-Formats' target='_blank'><u>here</u></a>.
                        If your format requires more than one file, zip the files then upload the folder. Maximum upload size is 500 MB.</p>
                    <input onChange={(e) => {
                        if (e.target.files?.[0])
                            file.current = e.target.files[0]
                        isUploadable()
                    }}
                        type='file'
                        name='file'
                        id='formFileInput'
                    >
                    </input>
                </div>
                <Button
                    isDisabled={uploadDisabled}
                    color='primary'
                    onClick={handleUpload}
                    onPress={() => document.getElementById('progressModalButton')?.click()}
                    className='text-white text-xl mb-24 mt-8 ml-12'>Update 3D Model
                </Button>
            </form>
        </>
    )
}
