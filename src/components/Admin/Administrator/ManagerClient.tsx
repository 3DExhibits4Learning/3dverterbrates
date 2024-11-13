/**
 * @file src/components/Admin/Administrator/ManagerClient.tsx
 * 
 * @fileoverview client wrapper for the administrator page; it's simply a nested <Accordion>
 * 
 * @todo add <AccordionItem> that allows administrator to mark or unmark a 3d model as annotated; or add it as a modelUpdate form field
 */

'use client'

// Typical imports
import { model } from "@prisma/client";
import { useState, createContext } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { ManagerClientProps, studentsAndAssignments, studentsAssignmentsAndModels } from "@/api/types";
import { fullModel } from "@/api/types";

// Default imports
import AnnotationClient from "../AnnotationClient";
import AnnotationAssignment from "./Annotations/AnnotationAssignment";
import initializeDataTransfer from "@/functions/dataTransfer/initializeDataTransfer";
import terminateDataTransfer from "@/functions/dataTransfer/terminateDataTransfer";
import RemoveStudent from "./Students/RemoveStudent";
import AddStudent from "./Students/AddStudent";
import dynamic from "next/dynamic";
import DeleteModel from "./Model/DeleteModel";
import AddThumbnail from "./Thumbnails/AddThumbnail";
import UpdateThumbnailContainer from "./Thumbnails/UpdateThumbnailContainer";
import UpdateModelContainer from "./Model/UpdateModelContainer";
import DataTransferModal from "../../Shared/Modals/DataTransferModal";
import StudentTable from "./Students/GetStudents";
import AdminItemContainer from "./ItemContainer";
import Assignments from "./Assignments/Assignments";

// Dynamic imports
const ModelSubmitForm = dynamic(() => import("@/components/ModelSubmit/Form"))

// Exported context
export const DataTransferContext = createContext<any>('');

// Main JSX component
export default function ManagerClient(props: ManagerClientProps) {

    // Variable Declarations - prop conversions
    const models: fullModel[] = JSON.parse(props.models)
    const modelsNeedingThumbnails: fullModel[] = JSON.parse(props.modelsNeedingThumbnails)
    const modelsWithThumbnails: fullModel[] = JSON.parse(props.modelsWithThumbnails)
    const unannotatedModels: fullModel[] = JSON.parse(props.unannotatedModels)
    const studentsAssignmentsAndModels: studentsAssignmentsAndModels[] = JSON.parse(props.studentsAssignmentsAndModels)

    // Data transfer state variables
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [loadingLabel, setLoadingLabel] = useState<string>('')

    // Data transfer functions for context
    const initializeDataTransferHandler = (loadingLabel: string) => initializeDataTransfer(setOpenModal, setTransferring, setLoadingLabel, loadingLabel)
    const terminateDataTransferHandler = (result: string) => terminateDataTransfer(setResult, setTransferring, result)

    return (
        <>
            <DataTransferModal open={openModal} setOpen={setOpenModal} transferring={transferring} loadingLabel={loadingLabel as string} result={result} href='/admin/management' />
            <DataTransferContext.Provider value={{ initializeDataTransferHandler, terminateDataTransferHandler }}>

                {/* Main admin Accordion */}
                <Accordion>

                    {/* AccordionItem holds nested "Students" accordion */}
                    <AccordionItem key='adminStudents' aria-label='adminStudents' title='Students' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                        {/* "Students" nested accordion */}
                        <Accordion>
                            {/* Active students table */}
                            <AccordionItem key='activeStudents' aria-label='activeStudents' title='Active' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                <StudentTable assignments={props.assignments} models={models} students={props.students as studentsAndAssignments[]} />
                            </AccordionItem>
                            {/* Add student form */}
                            <AccordionItem key='addStudent' aria-label='addStudent' title='Add' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                <AddStudent />
                            </AccordionItem>
                            {/* Remove student form*/}
                            <AccordionItem key='removeStudent' aria-label='removeStudent' title='Remove' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                <RemoveStudent />
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>

                    {/* AccordionItem holds nested "Assignments" accordion */}
                    <AccordionItem key={'assignments'} aria-label={'assignments'} title='Assignments' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                        {/* "Assignments" nested accordion */}
                        <Accordion>
                            {/* Add thumbnail form */}
                            <AccordionItem key='assignModels' aria-label={'assignModels'} title='Assign' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                <AdminItemContainer >
                                    {/* Annotation assignment form*/}
                                        <AnnotationAssignment students={props.students} unannotatedModels={unannotatedModels} />
                                </AdminItemContainer>
                            </AccordionItem>
                            {/* Update thumbnail form */}
                            <AccordionItem key='currentAssignments' aria-label={'currentAssignments'} title='Current' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                                <Assignments studentsAssignmentsAndModels={studentsAssignmentsAndModels}/>
                            </AccordionItem>
                        </Accordion>
                    </AccordionItem>

                    {/* AccordionItem holds nested "Models" accordion */}
                    <AccordionItem key={'adminModels'} aria-label={'adminModels'} title='Models' classNames={{ title: 'text-[#004C46] text-2xl' }}>
                        {/* "Models" nested accordion */}
                        <Accordion>
                            {/* Model submit form */}
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
                        </Accordion>
                    </AccordionItem>

                </Accordion>
            </DataTransferContext.Provider>
        </>
    )
}