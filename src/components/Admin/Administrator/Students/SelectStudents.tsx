'use client'

import { studentsAssignmentsAndModels } from "@/api/types"

export default function StudentSelect(props:{setNameAndEmailStates: Function, students: studentsAssignmentsAndModels[]}) {
    return (
        <section className="flex flex-col w-full mt-8">
            <p className="text-xl font-medium mb-1">Select Student to Assign</p>
            <select
                onChange={(e) => props.setNameAndEmailStates(e.target.value.slice(0, -18), e.target.value.slice(-18)) /* Email string is expected to be 18 characters long*/}
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
    )
}