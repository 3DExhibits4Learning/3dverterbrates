'use client'

import { model, userSubmittal } from "@prisma/client";
import { SetStateAction, useState, Dispatch, useEffect } from "react";
import PendingModelsAdmin from "@/components/Admin/PendingModels";
import DataTransferModal from "../../Shared/Modals/DataTransferModal";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import dynamic from "next/dynamic";
const ModelSubmitForm = dynamic(() => import("@/components/ModelSubmit/Form"))
import DeleteModel from "./Model/DeleteModel";
import AddThumbnail from "./Thumbnails/AddThumbnail";
import Select from "@/components/Shared/Form Fields/Select";
import UpdateThumbnail from "./Thumbnails/UpdateThumbnail";
const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'))

export default function ManagerClient(props: { pendingModels: userSubmittal[], projectUid: string, email: string, orgUid: string, user: string, token: string }) {

    try {

        // Variable Declarations
        const [uid, setUid] = useState<string>()
        const [openModal, setOpenModal] = useState<boolean>(false)
        const [transferring, setTransferring] = useState<boolean>(false)
        const [result, setResult] = useState<string>('')
        const [loadingLabel, setLoadingLabel] = useState<string>()
        const [modelsNeedingThumbnails, setModelsNeedingThumbnails] = useState<model[]>()
        const [modelsWithThumbnails, setModelsWithThumbnails] = useState<model[]>()
        const [file, setFile] = useState<File>()
        const [updateFile, setUpdateFile] = useState<File>()
        const [updateThumbUid, setUpdateThumbUid] = useState<string>('')

        // Models are fetched client side due to decimals within their data
        // Wishlist: Create type/query for models without decimal objects and fetch them server side, then add decimals with route handler client side
        const getModelsThatNeedThumbnails = async () => {
            setModelsNeedingThumbnails(await fetch('/api/admin/models/noThumb').then(res => res.json()).then(json => json.response).catch((e) => { throw Error(e.message) }))
        }
        const getModelsWithThumbnails = async () => {
            setModelsWithThumbnails(await fetch('/api/admin/models/withThumb').then(res => res.json()).then(json => json.response).catch((e) => { throw Error(e.message) }))
        }

        const addThumbnail = async (uid: string) => {

            setOpenModal(true)
            setTransferring(true)
            setLoadingLabel("Adding Thumbnail")

            const data = new FormData()
            data.set('uid', uid)
            data.set('file', file as File)

            await fetch(`/api/thumbnail/add`, {
                method: 'POST',
                body: data
            })
                .then(res => res.json())
                .then(res => {
                    setResult(res.data)
                    setTransferring(false)
                })
        }

        const updateThumbnail = async (uid: string) => {

            setOpenModal(true)
            setTransferring(true)
            setLoadingLabel("Updating Thumbnail")

            const data = new FormData()
            data.set('uid', uid)
            data.set('file', updateFile as File)

            await fetch(`/api/thumbnail/update`, {
                method: 'POST',
                body: data
            })
                .then(res => res.json())
                .then(res => {
                    setResult(res.data)
                    setTransferring(false)
                })
        }

        const deleteModel = async (uid: string) => {

            setOpenModal(true)
            setTransferring(true)
            setLoadingLabel("Deleting Model and Annotations")

            await fetch(`/api/admin/models/delete?uid=${uid}`, {
                method: 'DELETE',
            })
                .then(res => res.json()).then(res => {
                    setResult(res.data)
                    setTransferring(false)
                })
        }

        useEffect(() => {
            getModelsThatNeedThumbnails()
            getModelsWithThumbnails()
        }, [])

        useEffect(() => console.log(updateFile))

        return (
            <>
                <Accordion>
                    <AccordionItem key={'adminModels'} aria-label={'adminModels'} title='Models' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                        <Accordion>
                            <AccordionItem key='uploadModel' aria-label={'uploadModel'} title='Upload' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                <ModelSubmitForm token={props.token} email={props.email} orgUid={props.orgUid} projectUid={props.projectUid} user={props.user} />
                            </AccordionItem>
                            <AccordionItem key='updateModel' aria-label={'updateModel'} title='Update' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                Form fields to update 3D Model
                            </AccordionItem>
                            <AccordionItem key='deleteModel' aria-label={'deleteModel'} title='Delete' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                <DeleteModel uid={uid as string} setUid={setUid as Dispatch<SetStateAction<string>>} deleteModel={deleteModel} />
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>
                    <AccordionItem key={'adminThumbnails'} aria-label={'New Specimen'} title='Thumbnails' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                        <Accordion>
                            <AccordionItem key='modelsWithoutThumbnails' aria-label={'modelsWithoutThumbnails'} title='Models' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                <AddThumbnail file={file} setFile={setFile as Dispatch<SetStateAction<File>>} modelsNeedingThumbnails={modelsNeedingThumbnails as model[] | undefined} addThumbnail={addThumbnail} />
                            </AccordionItem>
                            <AccordionItem key='updateThumbnail' aria-label={'updateThumbnail'} title='Update' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                <section className="flex flex-col w-fit py-8 bg-[#D5CB9F] rounded-md px-4 border border-[#004C46]">
                                    {
                                        modelsWithThumbnails && modelsWithThumbnails.length > 0 &&
                                        <>
                                            <Select value={updateThumbUid} setValue={setUpdateThumbUid as Dispatch<SetStateAction<string>>} models={modelsWithThumbnails} title='Select Model' />

                                            {
                                                updateThumbUid &&
                                                <div className="my-4">
                                                    <div className="w-[500px] h-[500px] mb-8">
                                                        <ModelViewer uid={updateThumbUid} />
                                                    </div>
                                                    <UpdateThumbnail uid={updateThumbUid} file={updateFile} setFile={setUpdateFile as Dispatch<SetStateAction<File>>} updateThumbnail={updateThumbnail} />
                                                </div>
                                            }
                                        </>
                                    }
                                </section>
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>
                    <AccordionItem key={'adminAnnotations'} aria-label={'New Image Set'} title={"Annotations"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                        <Accordion>
                            <AccordionItem key='' aria-label={'New Specimen'} title='Upload' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                Form fields to upload 3D Model
                            </AccordionItem>
                            <AccordionItem key='updateModel' aria-label={'New Specimen'} title='Update' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                Form fields to update 3D Model
                            </AccordionItem>
                            <AccordionItem key='deleteModel' aria-label={'New Specimen'} title='Delete' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                Form fields to delete 3D Model
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>
                </Accordion>
                <DataTransferModal open={openModal} setOpen={setOpenModal} transferring={transferring} loadingLabel={loadingLabel as string} result={result} />
                {
                    props.pendingModels &&
                    //@ts-ignore - Typescript thinks decimal isn't assignable to number (it seems to be)
                    <PendingModelsAdmin pendingModels={props.pendingModels} />
                }
            </>
        )
    }
    catch (e: any) {
        return (
            <>
                <div className="flex mt-24 justify-center items-center">
                    {e.message}
                </div>
            </>
        )
    }
}

{/* <div className="flex h-48 w-full">
<div className="h-full w-1/3 flex flex-col items-center">
    <label className='text-2xl block mb-2'>Model UID</label>
    <input
        type='text'
        className={`w-3/5 max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
        value={uid}
        onChange={(e) => setUid(e.target.value)}
    >
    </input>
    <Button
        className="w-1/2 text-white"
        isDisabled={!uid}
        onClick={() => updateThumbnail(uid as string)}
    >
        Update User Thumbnail
    </Button>
</div>
</div> */}