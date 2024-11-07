'use client'

import { model } from "@prisma/client";
import { SetStateAction, useState, Dispatch, createContext } from "react";
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
import RemoveStudent from "./Students/RemoveStudent";
export const DataTransferContext = createContext<any>('');
import AddStudent from "./Students/AddStudent";

export default function ManagerClient(props: ManagerClientProps) {

    try {

        // Variable Declarations
        const models: fullModel[] = JSON.parse(props.stringifiedModels)
        const modelsWithThumbnails: fullModel[] = models.filter(model => model.thumbnail !== null)
        const modelsNeedingThumbnails: fullModel[] = models.filter(model => model.thumbnail === null && model.base_model === true)
        const unannotatedModels: fullModel[] = models.filter(model => !model.annotated)

        // Data transfer state variables
        const [openModal, setOpenModal] = useState<boolean>(false)
        const [transferring, setTransferring] = useState<boolean>(false)
        const [result, setResult] = useState<string>('')
        const [loadingLabel, setLoadingLabel] = useState<string>()

        // Data transfer functions
        const initializeDataTransferFn = (loadingLabel: string) => initializeDataTransfer(setOpenModal, setTransferring, setLoadingLabel as Dispatch<SetStateAction<string>>, loadingLabel)
        const terminateDataTransferFn = (result: string) => terminateDataTransfer(setResult, setTransferring, result)

        return (
            <>
                <DataTransferModal open={openModal} setOpen={setOpenModal} transferring={transferring} loadingLabel={loadingLabel as string} result={result} href='/admin/management' />

                <DataTransferContext.Provider value={{ initializeDataTransferFn, terminateDataTransferFn }}>

                    {/* Main admin Accordion */}
                    <Accordion>

                        {/* AccordionItem holds nested "Models" accordion */}
                        <AccordionItem key={'adminModels'} aria-label={'adminModels'} title='Models' classNames={{ title: 'text-[#004C46] text-2xl' }}>

                            {/* "Models" nested accordion */}
                            <Accordion>

                                {/* Model upload form */}
                                <AccordionItem key='uploadModel' aria-label={'uploadModel'} title='Upload' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                    <ModelSubmitForm />
                                </AccordionItem>

                                {/* Model update form*/}
                                <AccordionItem key='updateModel' aria-label={'updateModel'} title='Update' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                    <UpdateModelContainer models={models} />
                                </AccordionItem>

                                {/* Model delete form*/}
                                <AccordionItem key='deleteModel' aria-label={'deleteModel'} title='Delete' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                    <DeleteModel models={models} />
                                </AccordionItem>

                            </Accordion>

                        </AccordionItem>

                        {/* AccordionItem holds nested "Thumbnails" accordion */}
                        <AccordionItem key={'adminThumbnails'} aria-label={'New Specimen'} title='Thumbnails' classNames={{ title: 'text-[#004C46] text-2xl' }}>

                            {/* "Thumbnails" nested accordion */}
                            <Accordion>

                                {/* Add thumbnail form */}
                                <AccordionItem key='modelsWithoutThumbnails' aria-label={'modelsWithoutThumbnails'} title='Models' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                    <AddThumbnail modelsNeedingThumbnails={modelsNeedingThumbnails as model[] | undefined} />
                                </AccordionItem>

                                {/* Update thumbnail form */}
                                <AccordionItem key='updateThumbnail' aria-label={'updateThumbnail'} title='Update' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                    <UpdateThumbnailContainer modelsWithThumbnails={modelsWithThumbnails} />
                                </AccordionItem>

                            </Accordion>

                        </AccordionItem>

                        {/* AccordionItem holds nested "Annotations" accordion */}
                        <AccordionItem key={'adminAnnotations'} aria-label={'New Image Set'} title={"Annotations"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>

                            {/* "Annotations" nested accordion */}
                            <Accordion>

                                {/* Annotation Client */}
                                <AccordionItem key='AnnotateModel' aria-label={'AnnotateModel'} title='Models' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                    <AnnotationClient modelsToAnnotate={models.filter(model => model.base_model)} annotationModels={models.filter(model => !model.base_model)} />
                                </AccordionItem>
                                
                                {/* Annotation assignment form*/}
                                <AccordionItem key='AnnotationAssignment' aria-label={'AnnotationAssignment'} title='Assignment' classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                                    <AnnotationAssignment students={props.students} unannotatedModels={unannotatedModels} />
                                </AccordionItem>

                            </Accordion>

                        </AccordionItem>

                        {/* AccordionItem holds nested "Students" accordion */}
                        <AccordionItem key='adminStudents' aria-label='adminStudents' title='Students' classNames={{ title: 'text-[#004C46] text-2xl' }}>

                            {/* "Students" nested accordion */}
                            <Accordion>

                                {/* Active students table */}
                                <AccordionItem key='activeStudents' aria-label='activeStudents' title='Active' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                    Students currently active on the project and their assignments
                                </AccordionItem>

                                {/* Add student form */}
                                <AccordionItem key='inviteStudents' aria-label={'uploadModel'} title='Invite' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                    <AddStudent />
                                </AccordionItem>

                                {/* Remove student form*/}
                                <AccordionItem key='removeStudents' aria-label='removeStudents' title='Remove' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                    <RemoveStudent />

                                </AccordionItem>

                            </Accordion>

                        </AccordionItem>

                    </Accordion>

                </DataTransferContext.Provider>
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