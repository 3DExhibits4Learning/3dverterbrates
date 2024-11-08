'use client'

import { authorized } from "@prisma/client"

export default function StudentTable(props:{students: authorized[]}){
    return(
        <table>
            <caption>Active Students</caption>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th></th>
            </tr>
        </table>
    )
}