'use client'

import { useState, useEffect } from 'react';
import axios, { AxiosHeaderValue } from 'axios';
import ArtistName from './ArtistNameField';
import SpeciesName from './SpeciesNameField';
import MobileSelect from './MobileSelectField';
import ProcessSelect from './ProcessSelectField';
import { Button } from "@nextui-org/react";
import { Divider } from '@nextui-org/react';
import TagInput from './Tags';
import { LatLngLiteral } from 'leaflet';
import FormMap from '../Map/Form';
import DataTransferModal from '../Shared/Modals/DataTransferModal';
import SpeciesAcquisitionDate from './AcquisitionDate';

export default function ModelSubmitForm(props: { token: AxiosHeaderValue | string, email: string, isSketchfabLinked?: boolean, orgUid: string, projectUid: string, user: string }) {

    // Variable initialization

    const [species, setSpecies] = useState<string>('')
    const [speciesAcquisitionDate, setSpeciesAcquisitionDate] = useState<string>('')
    const [position, setPosition] = useState<LatLngLiteral | null>(null)
    const [artist, setArtist] = useState<string>('')
    const [isMobile, setIsMobile] = useState<string>('')
    const [buildMethod, setBuildMethod] = useState<string>('')
    const [software, setSoftware] = useState<{ value: string }[]>([])
    const [tags, setTags] = useState<{ value: string }[]>([])
    const [file, setFile] = useState<File | null>(null)

    const [uploadDisabled, setUploadDisabled] = useState<boolean>(true)
    const [open, setOpen] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')

    var uid: string

    // Handler that is called everytime a field is updated; it checks all mandatory fields for values, enabling the upload button if those fields exist

    const isUploadable = () => {
        if (species && artist && isMobile && buildMethod && software.length && file && position) { setUploadDisabled(false) }
        else { setUploadDisabled(true) }
    }

    // This is the database entry handler
    const modelDbEntry = async () => {

        const formSoftware = JSON.stringify(software.filter(obj => obj.value))
        const formTags = JSON.stringify(software.filter(obj => obj.value))
        const formPosition = JSON.stringify(position)

        const data = new FormData()

        data.set('artist', artist)
        data.set('species', species)
        data.set('buildMethod', buildMethod)
        data.set('software', formSoftware)
        data.set('tags', formTags)
        data.set('position', formPosition)
        data.set('speciesAcquisitionDate', speciesAcquisitionDate ?? null)
        data.set('modelFile', file as File)

        await fetch('/api/modelSubmit', {
            method: 'POST',
            body: data
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
        if (!file) return

        try {
            //Create / set formData
            const data = new FormData()

            data.set('orgProject', props.projectUid)
            data.set('modelFile', file)
            data.set('visibility', 'private')
            data.set('options', JSON.stringify({ background: { color: "#000000" } }))

            // Axios request features upload progress
            const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${props.orgUid}/models`

            const res = await axios.post(orgModelUploadEnd, data, {
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

        if (species && artist && isMobile && buildMethod && software.length && file && position) setUploadDisabled(false) 
        else setUploadDisabled(true) 

    }, [species, artist, isMobile, buildMethod, software.length, file, position])

    return (
        <>
            <DataTransferModal open={open} transferring={transferring} result={result} loadingLabel='Uploading 3D Model' href='/admin' modelUpload />
            <form className='w-full lg:w-3/5 lg:border-2 m-auto lg:border-[#004C46] lg:rounded-md bg-[#D5CB9F] dark:bg-[#212121] lg:mb-16'>

                <Divider />

                <div className='flex items-center h-[75px]'>
                    <p className='ml-12 text-3xl'>Specimen Data</p>
                </div>

                <Divider className='mb-6' />

                <SpeciesName value={species} setValue={setSpecies} />
                <SpeciesAcquisitionDate value={speciesAcquisitionDate} setValue={setSpeciesAcquisitionDate} />
                <FormMap position={position} setPosition={setPosition} title />
                <TagInput value={tags} setValue={setTags} />

                <Divider className='mt-8' />

                <h1 className='ml-12 text-3xl mt-4 mb-4'>Model Data</h1>

                <Divider />

                <ArtistName value={artist} setValue={setArtist} />
                <MobileSelect value={isMobile} setValue={setIsMobile} />
                <ProcessSelect value={buildMethod} setValue={setBuildMethod} />
                <TagInput value={software} setValue={setSoftware} />

                <div className='my-6 mx-12'>
                    <p className='text-2xl mb-6'>Select your 3D model file.
                        The supported file formats can be found <a href='https://support.fab.com/s/article/Supported-3D-File-Formats' target='_blank'><u>here</u></a>.
                        If your format requires more than one file, zip the files then upload the folder. Maximum upload size is 500 MB.</p>
                    <input onChange={(e) => {
                        if (e.target.files?.[0])
                            setFile(e.target.files[0])
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
