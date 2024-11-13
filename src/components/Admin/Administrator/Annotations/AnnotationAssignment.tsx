/**
 * @file src\components\Admin\Administrator\Annotations\AnnotationAssignment.tsx
 * 
 * @fileoverview client component interface for administrators to assign 3D models to students for annotation
 * 
 * @todo append email string with "@humboldt.edu" (and indicate such on form) as opposed to @ being mandatory in the regEx
 */

'use client'

// Imports
import { authorized } from "@prisma/client";
import { fullModel, studentsAssignmentsAndModels } from "@/api/types";
import { useState, useEffect, useContext } from "react";
import { Button } from "@nextui-org/react";
import { DataTransferContext } from "../ManagerClient";
import dataTransferHandler from "@/functions/dataTransfer/dataTransferHandler";
import assignAnnotation from "@/functions/managerClient/assignAnnotation";
import Select from "@/components/Shared/Form Fields/Select";

// Main component
export default function AnnotationAssignment(props: { students: studentsAssignmentsAndModels[], unannotatedModels: fullModel[] }) {

    // Data transfer context
    const initializeDataTransfer = useContext(DataTransferContext).initializeDataTransferHandler
    const terminateDataTransfer = useContext(DataTransferContext).terminateDataTransferHandler

    // email regular expression
    const re = /^\w{5}@humboldt.edu$/

    // Form states
    const [student, setStudent] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [assignmentUid, setAssignmentUid] = useState<string>('')

    // Annotation assigned/unassigned state
    const [annotationAssigned, setAnnotationAssigned] = useState<boolean>(false)

    // Set name and email states
    const setNameAndEmailStates = (name: string, email: string) => {
        setEmail(email)
        setStudent(name)
    }

    // Annotation assign (or unassign) handler
    const assignAnnotationHandler = async () => {
        const args = annotationAssigned ? [assignmentUid, null, email] : [assignmentUid, student, email]
        const label = annotationAssigned ? 'Unassigning model to student for annotation' : 'Assigning model to student for annotation'
        await dataTransferHandler(initializeDataTransfer, terminateDataTransfer, assignAnnotation, args, label)
    }

    // Effect determines whether an assignment is assigned to a student (if both an assignment and a student are selected)
    useEffect(() => {
        if (assignmentUid && student) {
            const model = props.unannotatedModels.find(model => model.uid === assignmentUid)
            if (student === model?.annotator) setAnnotationAssigned(true)
        }
    }, [assignmentUid, student])

    return (
        <>
        <section className="flex justify-center w-full h-3/4 flex-col ml-12">

            <section className="flex flex-col w-1/2 mt-8">
                <Select value={assignmentUid} setValue={setAssignmentUid} models={props.unannotatedModels} title='Select Model' />
            </section>

            <section className="flex flex-col w-1/2 mt-8">
                <p className="text-xl font-medium">Select Student</p>
                <select
                    onChange={(e) => setNameAndEmailStates(e.target.value.slice(0, -18), e.target.value.slice(-18)) /* Email string is expected to be 18 characters long*/}
                    className={`w-4/5 min-w-[300px] max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                >
                    <option hidden key={'defaultStudentOption'} value='select'>Select a student</option>

                    {
                        props.students.map((student, index) =>
                            <option key={index} value={`${student.name}${student.email}`}>{`${student.name}\u00A0\u00A0-\u00A0\u00A0(${student.email})`}</option>
                        )
                    }

                </select>
            </section>

        </section>

                {
        annotationAssigned &&
            <p className="tmb-4 text-xl ml-12 mb-8">* This model is already assigned to this student, click below to unassign the model</p>
    }

    <section className="flex ml-12">
        <Button className="text-white text-xl py-2 mb-8" onPress={assignAnnotationHandler} isDisabled={!(assignmentUid && student)}>
            {annotationAssigned ? 'Unassign model' : 'Assign model'}
        </Button>
    </section>
    </>
    )
}