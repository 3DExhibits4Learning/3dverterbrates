/**
 * @file src/components/Admin/Administrator/Students/GetStudents.tsx
 * 
 * @fileoverview admin client display table of students and their assignments
 * 
 * @todo add species name of assigned 3d model to the table
 */

'use client'

import { studentsAssignmentsAndModels } from "@/api/types"

export default function Assignments(props: { studentsAssignmentsAndModels: studentsAssignmentsAndModels[] }) {

    const sam = props.studentsAssignmentsAndModels // sam = students, assignments and models
    console.log(sam)

    return (
        <section className="flex w-full items-center flex-col">
            <p className="text-3xl font-medium mb-4">Assignments</p>
            <div className="flex w-1/2 rounded-lg overflow-hidden">
                <table className="w-full bg-[#D5CB9F]">
                    <tr>
                        <th className="text-xl border-b border-[#004C46] border-r py-4">Name</th>
                        {/* <th className="text-xl border-b border-[#004C46] border-r py-4">Email</th> */}
                        <th className="text-xl border-b border-[#004C46] border-r py-4">Species Assigned</th>
                        <th className="text-xl border-b border-[#004C46] border-r py-4">Annotated</th>
                        <th className="text-xl border-b border-[#004C46] border-r py-4">Admin approved</th>
                        <th className="text-xl border-b border-[#004C46] py-4">Assignment Uid</th>
                    </tr>
                    {
                        sam.map((student, index) =>
                            <>
                                <tr>
                                    <td className={index === sam.length - 1 ? "border-[#004C46] border-r py-2 pl-2" : "border-b border-[#004C46] border-r py-2 pl-2"} key={Math.random()}>{student.name}</td>
                                    {/* <td className={index === sam.length - 1 ? "py-2 pl-2 border-r border-[#004C46]" : "border-b border-[#004C46] border-r py-2 pl-2"} key={Math.random()}>{student.email}</td> */}
                                    <td className={index === sam.length - 1 ? "py-2 pl-2 border-r border-[#004C46]" : "border-b border-[#004C46] border-r py-2 pl-2"} key={Math.random()}>{student.assignment.length ? student.models[0].spec_name : 'N/A'}</td>
                                    <td className={index === sam.length - 1 ? "py-2 pl-2 border-r border-[#004C46]" : "border-b border-[#004C46] border-r py-2 pl-2"} key={Math.random()}>{student.assignment.length ? student.models[0].annotated ? 'Yes' : 'No' : ''}</td>
                                    <td className={index === sam.length - 1 ? "py-2 pl-2 border-r border-[#004C46]" : "border-b border-[#004C46] border-r py-2 pl-2"} key={Math.random()}>{student.assignment.length ? student.models[0].annotationsApproved ? 'Yes' : 'No' : ''}</td>
                                    <td className={index === sam.length - 1 ? "py-2 pl-2" : "border-b border-[#004C46] py-2 pl-2"} key={Math.random()}>{student.assignment.length ? student.assignment[0].uid : ''}</td>
                                </tr>

                                {
                                    student.assignment.length > 1 &&
                                    student.assignment.map((assignment, index) =>
                                        <tr>
                                            <td className={index === student.assignment.length - 1 ? "border-[#004C46] border-r py-2 pl-2" : "border-b border-[#004C46] py-2 pl-2"} key={Math.random()}>{student.name}</td>
                                            {/* <td className={index === student.assignment.length - 1 ? "border-[#004C46] border-r py-2 pl-2" : "border-b border-[#004C46] border-r py-2 pl-2"} key={Math.random()}>{student.email}</td> */}
                                            <td className={index === student.assignment.length - 1 ? "border-[#004C46] border-r py-2 pl-2" : "border-b border-[#004C46] py-2 pl-2"} key={Math.random()}>{student.models[index].spec_name}</td>
                                            <td className={index === student.assignment.length - 1 ? "border-[#004C46] border-r py-2 pl-2" : "border-b border-[#004C46] py-2 pl-2"} key={Math.random()}>{student.models[index].annotated}</td>
                                            <td className={index === student.assignment.length - 1 ? "border-[#004C46] border-r py-2 pl-2" : "border-b border-[#004C46] py-2 pl-2"} key={Math.random()}>{student.models[index].annotationsApproved}</td>
                                            <td className={index === student.assignment.length - 1 ? "py-2 pl-2" : "border-b border-[#004C46] py-2 pl-2"} key={Math.random()}>{assignment.uid}</td>
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