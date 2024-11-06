/**
 * @file src\components\Admin\Administrator\Annotations\AnnotationAssignment.tsx
 * 
 * @fileoverview client component interface for administrators to assign 3D models to students for annotation
 */

'use client'

import { User } from "@prisma/client";
import { fullModel } from "@/api/types";
import Select from "@/components/Shared/Form Fields/Select";
import { SetStateAction, Dispatch, useState} from "react";

export default function AnnotationAssignment(props: { students: User[], unannotatedModels: fullModel[], assignmentUid: string, setAssignmentUid: Dispatch<SetStateAction<string>>, }) {

    const [student, setStudent] = useState<string>()

    return (
        <section className="flex">
            <Select value={props.assignmentUid} setValue={props.setAssignmentUid} models={props.unannotatedModels} title='Select Model' />
            <select
                onChange={(e) => setStudent(e.target.value)}
                className={`w-4/5 min-w-[300px] max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                value={student}
            >
                <option hidden key={Math.random()} value='select'>Select a student</option>
                {
                    props.students.map((student, index) => {
                        return (
                            <option key={index} value={student.email as string}>{`${student.email} - ${student.name}`}</option>
                        )
                    })
                }
            </select>
            

        </section>
    )
}