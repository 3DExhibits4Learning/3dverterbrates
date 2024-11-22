/**
 * @file src/components/Admin/Administrator/ManagerClient.tsx
 * 
 * @fileoverview client wrapper for the administrator page; it's simply a nested <Accordion>
 * 
 * @todo add <AccordionItem> that allows administrator to mark or unmark a 3d model as annotated; or add it as a modelUpdate form field
 * 
 * @todo check if and what error is generated upon duplicate assignment of a model due to db constraint violation
 */
'use client'

// Typical imports
import { model } from "@prisma/client";
import { useState, createContext, useMemo } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { ManagerClientProps, studentsAssignmentsAndModels } from "@/interface/interface";
import { fullModel } from "@/interface/interface";

// Default imports
import AnnotationClient from "@/components/Admin/Annotation/AnnotationClient";
import initializeDataTransfer from "@/functions/client/dataTransfer/initializeDataTransfer";
import terminateDataTransfer from "@/functions/client/dataTransfer/terminateDataTransfer";
import RemoveStudent from "./Students/RemoveStudent";
import AddStudent from "./Students/AddStudent";
import dynamic from "next/dynamic";
import DeleteModel from "./Model/DeleteModel";
import AddThumbnail from "./Thumbnails/AddThumbnail";
import UpdateThumbnailContainer from "./Thumbnails/UpdateThumbnailContainer";
import UpdateModelContainer from "./Model/UpdateModelContainer";
import DataTransferModal from "../../Shared/Modals/DataTransferModal";
import StudentTable from "./Students/GetStudents";
import Assignments from "./Assignments/Assignments";
import FindModel from "./Model/Find";
import ApproveModel from "./Model/Approve";

// Dynamic imports
const ModelSubmitForm = dynamic(() => import("@/components/Admin/ModelSubmit/Form"))

// Exported context
export const DataTransferContext = createContext<any>('');

// Main JSX component
export default function ManagerClient(props: ManagerClientProps) {

    // Variable Declarations - prop conversions (decimals can't be passed directly from server to client)
    const models: fullModel[] = JSON.parse(props.models)
    const modelsNeedingThumbnails: fullModel[] = (JSON.parse(props.modelsNeedingThumbnails) as fullModel[]).filter(model => model.modelApproved)
    //const modelsWithThumbnails: fullModel[] = JSON.parse(props.modelsWithThumbnails)
    //const unannotatedModels: fullModel[] = JSON.parse(props.unannotatedModels)
    const studentsAssignmentsAndModels: studentsAssignmentsAndModels[] = JSON.parse(props.studentsAssignmentsAndModels)
    const unapprovedModels = useMemo(() => models.filter(model => !model.modelApproved), [props.models])
    const approvedModels = useMemo(() => models.filter(model => model.modelApproved), [props.models])

    // Data transfer state variables
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [loadingLabel, setLoadingLabel] = useState<string>('')

    // Data transfer handlers for context
    const initializeDataTransferHandler = (loadingLabel: string) => initializeDataTransfer(setOpenModal, setTransferring, setLoadingLabel, loadingLabel)
    const terminateDataTransferHandler = (result: string) => terminateDataTransfer(setResult, setTransferring, result)

    // Tailwind variables
    const accordionTitlesCss = 'text-[#004C46] text-2xl dark:text-[#F5F3E7]'

    return (
        <>
            {/* Data transfer (fetch or query) modal */}
            <DataTransferModal open={openModal} setOpen={setOpenModal} transferring={transferring} loadingLabel={loadingLabel as string} result={result} href='/admin/management' />

            {/* Data transfer handlers context provider */}
            <DataTransferContext.Provider value={{ initializeDataTransferHandler, terminateDataTransferHandler }}>

                {/* Main admin Accordion */}
                <Accordion className="dark: text-[#F5F3E7]">

                    {/* AccordionItem holds nested "Students" accordion */}
                    <AccordionItem key='adminStudents' aria-label='adminStudents' title='Students' classNames={{ title: accordionTitlesCss }}>
                        {/* "Students" nested accordion */}
                        <Accordion>
                            {/* Active students table */}
                            <AccordionItem key='activeStudents' aria-label='activeStudents' title='Active' classNames={{ title: accordionTitlesCss }}>
                                <StudentTable studentsAssignmentsAndModels={studentsAssignmentsAndModels} />
                            </AccordionItem>
                            {/* Add student form */}
                            <AccordionItem key='addStudent' aria-label='addStudent' title='Add' classNames={{ title: accordionTitlesCss }}>
                                <AddStudent />
                            </AccordionItem>
                            {/* Remove student form*/}
                            <AccordionItem key='removeStudent' aria-label='removeStudent' title='Remove' classNames={{ title: accordionTitlesCss }}>
                                <RemoveStudent />
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>

                    {/* AccordionItem holds nested "Assignments" accordion */}
                    <AccordionItem key={'assignments'} aria-label={'assignments'} title='Assignments' classNames={{ title: accordionTitlesCss }}>
                        <Assignments studentsAssignmentsAndModels={studentsAssignmentsAndModels} />
                    </AccordionItem>

                    {/* AccordionItem holds nested "Models" accordion */}
                    <AccordionItem key={'adminModels'} aria-label={'adminModels'} title='Models' classNames={{ title: accordionTitlesCss }}>
                        {/* "Models" nested accordion */}
                        <Accordion>
                            {/* Model submit form */}
                            <AccordionItem key='findModel' aria-label={'findModel'} title='Find' classNames={{ title: accordionTitlesCss }}>
                                <FindModel models={approvedModels}/>
                            </AccordionItem>
                            <AccordionItem key='approveModel' aria-label={'approveModel'} title='Approve' classNames={{ title: accordionTitlesCss }}>
                                <ApproveModel unapprovedModels={unapprovedModels}/>
                            </AccordionItem>
                            {/* Model submit form */}
                            <AccordionItem key='uploadModel' aria-label={'uploadModel'} title='Upload' classNames={{ title: accordionTitlesCss }}>
                                <ModelSubmitForm />
                            </AccordionItem>
                            {/* Model update form*/}
                            <AccordionItem key='updateModel' aria-label={'updateModel'} title='Update' classNames={{ title: accordionTitlesCss }}>
                                <UpdateModelContainer models={approvedModels} />
                            </AccordionItem>
                            {/* Model delete form*/}
                            <AccordionItem key='deleteModel' aria-label={'deleteModel'} title='Delete' classNames={{ title: accordionTitlesCss }}>
                                <DeleteModel models={approvedModels} />
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>

                    {/* AccordionItem holds nested "Thumbnails" accordion */}
                    <AccordionItem key={'adminThumbnails'} aria-label={'New Specimen'} title='Thumbnails' classNames={{ title: accordionTitlesCss }}>
                        {/* "Thumbnails" nested accordion */}
                        <Accordion>
                            {/* Add thumbnail form */}
                            <AccordionItem key='modelsWithoutThumbnails' aria-label={'modelsWithoutThumbnails'} title='Models' classNames={{ title: accordionTitlesCss }}>
                                <AddThumbnail modelsNeedingThumbnails={modelsNeedingThumbnails as model[] | undefined} />
                            </AccordionItem>
                            {/* Update thumbnail form */}
                            <AccordionItem key='updateThumbnail' aria-label={'updateThumbnail'} title='Update' classNames={{ title: accordionTitlesCss }}>
                                <UpdateThumbnailContainer modelsWithThumbnails={approvedModels} />
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>

                    {/* AccordionItem holds nested "Annotations" accordion */}
                    <AccordionItem key={'adminAnnotations'} aria-label={'New Image Set'} title={"Annotations"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                        <AnnotationClient
                            modelsToAnnotate={approvedModels.filter(model => model.base_model)}
                            annotationModels={approvedModels.filter(model => !model.base_model)}
                            admin={props.admin}
                            students={studentsAssignmentsAndModels}
                        />
                    </AccordionItem>

                </Accordion>
            </DataTransferContext.Provider>
        </>
    )
}