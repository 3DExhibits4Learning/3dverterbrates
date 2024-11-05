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
import UpdateThumbnailContainer from "./Thumbnails/UpdateThumbnailContainer";
import { ManagerClientProps, UpdateModelFormContainerProps } from "@/api/types";
import UpdateModelContainer from "./Model/UpdateModelContainer";
import { fullModel } from "@/api/types";

export default function ManagerClient(props: ManagerClientProps) {

    try {

        // Variable Declarations
        const [uid, setUid] = useState<string>()
        const [openModal, setOpenModal] = useState<boolean>(false)
        const [transferring, setTransferring] = useState<boolean>(false)
        const [result, setResult] = useState<string>('')
        const [loadingLabel, setLoadingLabel] = useState<string>()
        const [models, setModels] = useState<fullModel[]>()
        const [modelsNeedingThumbnails, setModelsNeedingThumbnails] = useState<model[]>()
        const [modelsWithThumbnails, setModelsWithThumbnails] = useState<model[]>()
        const [file, setFile] = useState<File>()
        const [updateFile, setUpdateFile] = useState<File>()
        const [updateThumbUid, setUpdateThumbUid] = useState<string>('')

        // Models are fetched client side due to decimals within their data
        // Wishlist: Create type/query for models without decimal objects and fetch them server side, then add decimals with route handler client side
        const getModels = async () => {
            setModels(await fetch('/api/admin/models').then(res => res.json()).then(json => json.response as fullModel[]).catch((e) => { throw Error(e.message) }))
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
            getModels()
        }, [])

        useEffect(() => {
            if (models) {
                setModelsWithThumbnails(models.filter((model) => model.thumbnail !== null ))
                setModelsNeedingThumbnails(models.filter((model) => model.thumbnail === null && model.base_model === true))
            }
        }, [models])

        return (
            <>
                <Accordion>
                    <AccordionItem key={'adminModels'} aria-label={'adminModels'} title='Models' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                        <Accordion>
                            <AccordionItem key='uploadModel' aria-label={'uploadModel'} title='Upload' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                <ModelSubmitForm />
                            </AccordionItem>
                            <AccordionItem key='updateModel' aria-label={'updateModel'} title='Update' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                <UpdateModelContainer {...props} models={models} />
                            </AccordionItem>
                            <AccordionItem key='deleteModel' aria-label={'deleteModel'} title='Delete' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                <DeleteModel uid={uid as string} setUid={setUid as Dispatch<SetStateAction<string>>} deleteModel={deleteModel} />
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>
                    <AccordionItem key={'adminThumbnails'} aria-label={'New Specimen'} title='Thumbnails' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                        <Accordion>
                            <AccordionItem key='modelsWithoutThumbnails' aria-label={'modelsWithoutThumbnails'} title='Models' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                <AddThumbnail file={file} setFile={setFile as Dispatch<SetStateAction<File>>} modelsNeedingThumbnails={modelsNeedingThumbnails as model[] | undefined} addThumbnail={addThumbnail} />
                            </AccordionItem>
                            <AccordionItem key='updateThumbnail' aria-label={'updateThumbnail'} title='Update' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                <UpdateThumbnailContainer
                                    {...props}
                                    modelsWithThumbnails={modelsWithThumbnails}
                                    updateThumbUid={updateThumbUid}
                                    setUpdateThumbUid={setUpdateThumbUid}
                                    updateFile={updateFile}
                                    setUpdateFile={setUpdateFile as Dispatch<SetStateAction<File>>}
                                    updateThumbnail={updateThumbnail}
                                />
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>
                    <AccordionItem key={'adminAnnotations'} aria-label={'New Image Set'} title={"Annotations"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                        <Accordion>
                            <AccordionItem key='AnnotateModel' aria-label={'AnnotateModel'} title='Models' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                Here you can select a model for annotation CRUD (Create, read, update, delete)
                            </AccordionItem>
                            <AccordionItem key='AnnotationAssignment' aria-label={'AnnotationAssignment'} title='Assignment' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                Here you can assign or unassign a 3D model to a student for annotation. When the student marks the annotations as complete,
                                the administrator will receive a notification email and must approve the annotations before they are published online.
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