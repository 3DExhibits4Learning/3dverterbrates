/**
 * @file src/components/Admin/Administrator/Students/GetStudents.tsx
 * 
 * @fileoverview admin client display table of students and their assignments
 * 
 * @todo add species name of assigned 3d model to the table
 */

'use client'

import { assignment } from "@prisma/client"
import { fullModel, studentsAndAssignments } from "@/api/types"

export default function StudentTable(props: { assignments: assignment[], models: fullModel[], students: studentsAndAssignments[] }) {

    return (
        <section className="flex w-full items-center flex-col">
            <p className="text-3xl font-medium mb-4">Active Students and Assignments</p>
            <div className="flex w-1/2 rounded-lg overflow-hidden">
                <table className="w-full bg-[#D5CB9F]">
                    <tr>
                        <th className="text-xl border-b border-[#004C46] border-r py-4">Name</th>
                        <th className="text-xl border-b border-[#004C46] border-r py-4">Email</th>
                        <th className="text-xl border-b border-[#004C46] border-r py-4">Species Assigned</th>
                        <th className="text-xl border-b border-[#004C46] py-4">Assignment Uid</th>
                    </tr>
                    {
                        props.students.map((student, index) =>
                            <>
                                <tr>
                                    <td className={index === props.students.length - 1 ? "border-[#004C46] border-r py-2 pl-2" : "border-b border-[#004C46] border-r py-2 pl-2"} key={index}>{student.name}</td>
                                    <td className={index === props.students.length - 1 ? "py-2 pl-2 border-r border-[#004C46]" : "border-b border-[#004C46] border-r py-2 pl-2"} key={index}>{student.email}</td>
                                    <td className={index === props.students.length - 1 ? "py-2 pl-2 border-r border-[#004C46]" : "border-b border-[#004C46] border-r py-2 pl-2"} key={index}>{student.assignment.length ? props.models.find(model => model.uid === student.assignment[0].uid)?.spec_name : ''}</td>
                                    <td className={index === props.students.length - 1 ? "py-2 pl-2" : "border-b border-[#004C46] py-2 pl-2"} key={index}>{student.assignment.length ? student.assignment[0].uid : ''}</td>
                                </tr>

                                {
                                    student.assignment.length > 1 &&
                                    student.assignment.map((assignment, index) =>
                                        <tr>
                                            <td className={index === props.assignments.length - 1 ? "border-[#004C46] border-r py-2 pl-2" : "border-b border-[#004C46] border-r py-2 pl-2"} key={Math.random()}>{student.email}</td>
                                            <td className={index === props.assignments.length - 1 ? "py-2 pl-2" : "border-b border-[#004C46] py-2 pl-2"} key={Math.random()}>{student.name}</td>
                                            <td className={index === props.assignments.length - 1 ? "py-2 pl-2" : "border-b border-[#004C46] py-2 pl-2"} key={Math.random()}>{props.models.find(model => model.uid === assignment.uid)?.spec_name}</td>
                                            <td className={index === props.assignments.length - 1 ? "py-2 pl-2" : "border-b border-[#004C46] py-2 pl-2"} key={Math.random()}>{assignment.uid}</td>
                                        </tr>
                                    )
                                }
                            </>
                        )
                    }
                </table>
            </div>
        </section>
    )
}