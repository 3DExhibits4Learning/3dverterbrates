/**
 * @file src\components\Admin\Administrator\Annotations\AnnotationAssignment.tsx
 * 
 * @fileoverview client component interface for administrators to assign 3D models to students for annotation
 */

'use client'

import { User } from "@prisma/client";
import { fullModel } from "@/api/types";
import Select from "@/components/Shared/Form Fields/Select";
import { SetStateAction, Dispatch} from "react";

export default function AnnotationAssignment(props: { students: User[], unannotatedModels: fullModel[], assignmentUid: string, setAssignmentUid: Dispatch<SetStateAction<string>> }) {
    return (
        <section className="flex">
            <Select value={props.assignmentUid} setValue={props.setAssignmentUid} models={props.unannotatedModels} title='Select Model' />
            <Select value={props.assignmentUid} setValue={props.setAssignmentUid} models={props.unannotatedModels} title='Select Model' />

        </section>
    )
}