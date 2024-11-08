/**
 * @file src\components\Admin\Administrator\Annotations\AnnotationAssignment.tsx
 * 
 * @fileoverview client component interface for administrators to assign 3D models to students for annotation
 */

'use client'

import { authorized } from "@prisma/client";
import { fullModel } from "@/api/types";
import Select from "@/components/Shared/Form Fields/Select";
import { useState, useEffect, useContext } from "react";
import { Button } from "@nextui-org/react";
import dataTransferHandler from "@/functions/dataTransfer/dataTransferHandler";
import assignAnnotation from "@/functions/managerClient/assignAnnotation";
import { DataTransferContext } from "../ManagerClient";


export default function AnnotationAssignment(props: { students: authorized[], unannotatedModels: fullModel[] }) {

    const initializeDataTransfer = useContext(DataTransferContext).initializeDataTransfer
    const terminateDataTransfer = useContext(DataTransferContext).terminateDataTransfer

    const re = /^\w{5}@humboldt.edu$/

    const [student, setStudent] = useState<string>()
    const [email, setEmail] = useState<string>('')
    const [assignmentUid, setAssignmentUid] = useState<string>('')
    const [annotationAssigned, setAnnotationAssigned] = useState<boolean>(false)

    const assignAnnotationFn = async () => {
        const args = annotationAssigned ? [assignmentUid, null, email] : [assignmentUid, student, email]
        const label = annotationAssigned ? 'Unassigning model to student for annotation' : 'Assigning model to student for annotation'
        await dataTransferHandler(initializeDataTransfer, terminateDataTransfer, assignAnnotation, args, label)
    }

    useEffect(() => {
        if (assignmentUid && student) {
            const model = props.unannotatedModels.find(model => model.uid === assignmentUid)
            if (student === model?.annotator) setAnnotationAssigned(true)
        }
    }, [assignmentUid, student])

    useEffect(() => console.log(student))

    return (
        <article className="flex justify-center">
            <div className="flex flex-col w-1/2 bg-[#D5CB9F] min-h-[400px] rounded-xl border border-[#004C46]">
                <section className="flex justify-center w-full h-3/4 flex-col ml-12">

                    <section className="flex flex-col w-1/2 mt-8">
                        <Select value={assignmentUid} setValue={setAssignmentUid} models={props.unannotatedModels} title='Select Model' />
                    </section>

                    <section className="flex flex-col w-1/2 mt-8">
                        <p className="text-xl font-medium">Select Student</p>
                        <select
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-4/5 min-w-[300px] max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                            value={student}
                        >
                            <option hidden key={'defaultStudentOption'} value='select'>Select a student</option>
                            {
                                props.students.map((student, index) =>
                                    <option onClick={() => console.log(student.name)} key={index} value={student.email as string}>{`${student.name}\u00A0\u00A0-\u00A0\u00A0(${student.email})`}</option>
                                )
                            }
                        </select>
                    </section>

                </section>

                {
                    annotationAssigned &&
                    <p className="text-center mb-4 text-xl">** This model is already assigned to this student, click below to unassign the model</p>
                }

                <section className="flex ml-12">
                    <Button className="text-white text-xl py-2" onPress={assignAnnotationFn} isDisabled={!(assignmentUid && student)}>
                        {annotationAssigned ? 'Unassign model' : 'Assign model'}
                    </Button>
                </section>
            </div>
        </article>
    )
}