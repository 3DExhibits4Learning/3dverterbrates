'use client'

import Select from "@/components/Shared/Form Fields/Select"
import { model } from "@prisma/client"
import { useState } from "react"
import ModelViewer from "@/components/Shared/ModelViewer"
import dynamic from "next/dynamic"
import ModelDataTable from "./DataTable"

const ModelSubmitForm = dynamic(() => import("@/components/Admin/ModelSubmit/Form"))


export default function FindModel(props: { models: model[] }) {

    const [uid, setUid] = useState<string>('')

    return (
        <section className="w-full">
            <Select models={props.models} value={uid} setValue={setUid} />
            {
                uid &&
                <div className="w-[500px] h-[600px]">
                    <ModelViewer uid={uid} />
                </div>
            }
            <ModelDataTable />
        </section>
    )
}