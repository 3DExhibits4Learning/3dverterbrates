'use client'

import { userSubmittal } from "@prisma/client";
import { SetStateAction, useState, Dispatch } from "react";
import PendingModelsAdmin from "@/components/Admin/PendingModels";
import DataTransferModal from "../../Shared/DataTransferModal";
import { Accordion, AccordionItem } from "@nextui-org/react";
import dynamic from "next/dynamic";
const ModelSubmitForm = dynamic(() => import("@/components/ModelSubmit/Form"))
import DeleteModel from "./Model/DeleteModel";


export default function ManagerClient(props: { pendingModels: userSubmittal[], projectUid: string, email: string, orgUid: string, user: string, token:string }) {

    const [uid, setUid] = useState<string>()
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [loadingLabel, setLoadingLabel] = useState<string>()

    const updateThumbnail = async (uid: string) => {

        setOpenModal(true)
        setTransferring(true)
        setLoadingLabel("Updating Thumbnail")

        await fetch(`/api/sketchfab/thumbnail?uid=${uid}&nonCommunity=true`)
            .then(res => res.json())
            .then(res => {
                setResult(res.data)
                setTransferring(false)
            })
    }

    const deleteModel = async(uid: string) => {
        
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

    return (
        <>
            <Accordion>
                <AccordionItem key={'adminModels'} aria-label={'New Specimen'} title='Models' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                    <Accordion>
                        <AccordionItem key='uploadModel' aria-label={'uploadModel'} title='Upload' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                            <ModelSubmitForm token={props.token} email={props.email} orgUid={props.orgUid} projectUid={props.projectUid} user={props.user}/>
                        </AccordionItem>
                        <AccordionItem key='updateModel' aria-label={'updateModel'} title='Update' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                            Form fields to update 3D Model
                        </AccordionItem>
                        <DeleteModel uid={uid as string} setUid={setUid as Dispatch<SetStateAction<string>>} deleteModel={deleteModel} />
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