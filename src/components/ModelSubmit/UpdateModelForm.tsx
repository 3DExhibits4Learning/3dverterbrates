'use client'

import { useState, useRef, useEffect } from 'react';
import axios, { AxiosHeaderValue } from 'axios';
import ArtistName from './ArtistNameField';
import SpeciesName from './SpeciesNameField';
import ProcessSelect from './ProcessSelectField';
import Software from './SoftwareField';
import { Button } from "@nextui-org/react";
import AdditionalSoftware from './AdditionalSoftwareField';
import { Divider } from '@nextui-org/react';
import TagInput from './Tags';
import Leaflet, { LatLngLiteral } from 'leaflet';
import FormMap from '../Map/Form';
import DataTransferModal from '../Shared/Modals/DataTransferModal';
import SpeciesAcquisitionDate from './AcquisitionDate';
import { UpdateModelFormProps } from '@/api/types';
import TextInput from '../Shared/Form Fields/TextInput';
import AutoCompleteWrapper from '../Shared/Form Fields/AutoCompleteWrapper';

export default function UpdateModelForm(props: UpdateModelFormProps) {

    console.log(props.model.spec_name)
    console.log(props.model.spec_acquis_date)

    // Variable initialization
    const model = props.model
    const [speciesName, setSpeciesName] = useState<string>(model.spec_name)
    const artistName = useRef<string>(model.modeled_by)
    const radioValue = useRef<string>(model.build_process)
    const software = useRef<string>(model.software[0].software)
    const file = useRef<File | null>(null)
    const softwareArray = useRef<Array<string>>(model.software.map((softwareObject) => softwareObject.software).splice(0, 1))
    const tagArray = useRef<Array<string>>(model.tags.map((tagObject) => tagObject.tag))
    //@ts-ignore Decimal appears to be equal to number, contrary to the error
    const positionRef = useRef<LatLngLiteral>({ lat: model.lat, lng: model.lng })
    const speciesAcquisitionDate = useRef<HTMLInputElement>()

    const [additionalSoftware, setAdditionalSoftware] = useState(0)
    const [uploadDisabled, setUploadDisabled] = useState<boolean>(true)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [position, setPosition] = useState<Leaflet.LatLngExpression | null>(null)
    const [open, setOpen] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')

    var uid: string

    // Handler that is called everytime a field is updated; it checks all mandatory fields for values, enabling the upload button if those fields exist

    const isUploadable = () => {
        if (speciesName && artistName.current && radioValue.current && software.current && file.current && positionRef.current) { setUploadDisabled(false) }
        else { setUploadDisabled(true) }
    }

    // This is the database entry handler
    const modelDbEntry = async () => {
        softwareArray.current.unshift(software.current)

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
                <SpeciesAcquisitionDate ref={speciesAcquisitionDate} defaultValue={props.model.spec_acquis_date as string}/>
                <FormMap position={position} setPosition={setPosition} ref={positionRef} title />
                {/* <TagInput ref={tagArray as RefObject<string[]>} /> */}
                <Divider className='mt-8' />
                <h1 className='ml-12 text-3xl mt-4 mb-4'>Model Data</h1>
                <Divider />
                <ArtistName ref={artistName} handler={isUploadable} defaultValue={model.modeled_by} />
                <ProcessSelect ref={radioValue} handler={isUploadable} />
                <Software ref={software} handler={isUploadable} />
                <AdditionalSoftware ref={softwareArray} handler={isUploadable} stateVar={additionalSoftware} stateFn={setAdditionalSoftware} />
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
                    className='text-white text-xl mb-24 mt-8 ml-12'>Upload 3D Model
                </Button>
            </form>
        </>
    )
}
