'use client'

import { model } from "@prisma/client";
import { SetStateAction, useState, Dispatch } from "react";
import DataTransferModal from "../../Shared/Modals/DataTransferModal";
import { Accordion, AccordionItem } from "@nextui-org/react";
import dynamic from "next/dynamic";
const ModelSubmitForm = dynamic(() => import("@/components/ModelSubmit/Form"))
import DeleteModel from "./Model/DeleteModel";
import AddThumbnail from "./Thumbnails/AddThumbnail";
import UpdateThumbnailContainer from "./Thumbnails/UpdateThumbnailContainer";
import { ManagerClientProps } from "@/api/types";
import UpdateModelContainer from "./Model/UpdateModelContainer";
import { fullModel } from "@/api/types";
import AnnotationClient from "../AnnotationClient";
import AnnotationAssignment from "./Annotations/AnnotationAssignment";
import initializeDataTransfer from "@/functions/dataTransfer/initializeDataTransfer";
import terminateDataTransfer from "@/functions/dataTransfer/terminateDataTransfer";
import dataTransferHandler from "@/functions/dataTransfer/dataTransferHandler";
import addThumbnail from "@/functions/managerClient/addThumbnail";
import updateThumbnail from "@/functions/managerClient/updateThumbnail";
import deleteModel from "@/functions/managerClient/deleteModel";
import RemoveStudent from "./Students/RemoveStudent";

export default function ManagerClient(props: ManagerClientProps) {

    try {

        // Variable Declarations
        const models: fullModel[] = JSON.parse(props.stringifiedModels)
        const modelsWithThumbnails: fullModel[] = models.filter(model => model.thumbnail !== null)
        const modelsNeedingThumbnails: fullModel[] = models.filter(model => model.thumbnail === null && model.base_model === true)
        const unannotatedModels: fullModel[] = models.filter(model => !model.annotated)

        // Form field state variables
        const [uid, setUid] = useState<string>()
        const [file, setFile] = useState<File>()
        const [updateFile, setUpdateFile] = useState<File>()
        const [updateThumbUid, setUpdateThumbUid] = useState<string>('')

        // Data transfer state variables
        const [openModal, setOpenModal] = useState<boolean>(false)
        const [transferring, setTransferring] = useState<boolean>(false)
        const [result, setResult] = useState<string>('')
        const [loadingLabel, setLoadingLabel] = useState<string>()

        // Function decalarations - data transfer modal
        const initializeDataTransferFn = (loadingLabel: string) => initializeDataTransfer(setOpenModal, setTransferring, setLoadingLabel as Dispatch<SetStateAction<string>>, loadingLabel)
        const terminateDataTransferFn = (result: string) => terminateDataTransfer(setResult, setTransferring, result)

        // Thumbnail functions
        const addThumbnailFn = async (uid: string) => await dataTransferHandler(initializeDataTransferFn, terminateDataTransferFn, addThumbnail, [uid, file], 'Adding Thumbnail')
        const updateThumbnailFn = async (uid: string) => await dataTransferHandler(initializeDataTransferFn, terminateDataTransferFn, updateThumbnail, [uid, updateFile], 'Updating Thumbnail')

        // Delete model function
        const deleteModelFn = async (uid: string) => await dataTransferHandler(initializeDataTransferFn, terminateDataTransferFn, deleteModel, [uid], "Deleting Model and Annotations")

        return (
            <>
                <DataTransferModal open={openModal} setOpen={setOpenModal} transferring={transferring} loadingLabel={loadingLabel as string} result={result} href='/admin/management' />
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
                                <DeleteModel
                                    uid={uid as string}
                                    setUid={setUid as Dispatch<SetStateAction<string>>}
                                    deleteModel={deleteModelFn} models={models}
                                />
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>
                    <AccordionItem key={'adminThumbnails'} aria-label={'New Specimen'} title='Thumbnails' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                        <Accordion>
                            <AccordionItem key='modelsWithoutThumbnails' aria-label={'modelsWithoutThumbnails'} title='Models' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                <AddThumbnail
                                    file={file}
                                    setFile={setFile as Dispatch<SetStateAction<File>>}
                                    modelsNeedingThumbnails={modelsNeedingThumbnails as model[] | undefined}
                                    addThumbnail={addThumbnailFn}
                                />
                            </AccordionItem>
                            <AccordionItem key='updateThumbnail' aria-label={'updateThumbnail'} title='Update' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                <UpdateThumbnailContainer
                                    {...props}
                                    modelsWithThumbnails={modelsWithThumbnails}
                                    updateThumbUid={updateThumbUid}
                                    setUpdateThumbUid={setUpdateThumbUid}
                                    updateFile={updateFile}
                                    setUpdateFile={setUpdateFile as Dispatch<SetStateAction<File>>}
                                    updateThumbnail={updateThumbnailFn}
                                />
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>
                    <AccordionItem key={'adminAnnotations'} aria-label={'New Image Set'} title={"Annotations"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                        <Accordion>
                            <AccordionItem key='AnnotateModel' aria-label={'AnnotateModel'} title='Models' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                <AnnotationClient modelsToAnnotate={models.filter(model => model.base_model)} annotationModels={models.filter(model => !model.base_model)} />
                            </AccordionItem>
                            <AccordionItem key='AnnotationAssignment' aria-label={'AnnotationAssignment'} title='Assignment' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                Here you can assign or unassign a 3D model to a student for annotation. When the student marks the annotations as complete,
                                the administrator will receive a notification email and must approve the annotations before they are published online.
                                <AnnotationAssignment
                                    students={props.students}
                                    unannotatedModels={unannotatedModels}
                                    initializeDataTransfer={initializeDataTransferFn}
                                    terminateDataTransfer={terminateDataTransferFn}
                                />
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>
                    <AccordionItem key='adminStudents' aria-label='adminStudents' title='Students' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                        <Accordion>
                            <AccordionItem key='activeStudents' aria-label='activeStudents' title='Active' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                Students currently active on the project and their assignments
                            </AccordionItem>
                            <AccordionItem key='inviteStudents' aria-label={'uploadModel'} title='Invite' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                Invite students to join the project
                            </AccordionItem>
                            <AccordionItem key='removeStudents' aria-label='removeStudents' title='Remove' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                <RemoveStudent />
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>
                </Accordion>
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