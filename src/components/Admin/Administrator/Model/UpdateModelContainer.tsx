'use client'

import { useState, Dispatch, SetStateAction, useEffect } from "react"
import dynamic from "next/dynamic"
const UpdateModelForm = dynamic(() => import("@/components/ModelSubmit/UpdateModelForm"))
import { UpdateModelFormContainerProps } from "@/interface/interface"
import Select from "@/components/Shared/Form Fields/Select"
import { model } from "@prisma/client"
import { fullModel } from "@/interface/interface"

export default function UpdateModelContainer(props: UpdateModelFormContainerProps) {

    // Variable Declarations
    const [uid, setUid] = useState<string>('')
    const [model, setModel] = useState<fullModel | null>()

    useEffect(() => {
        if (props.models?.length && uid) {
            const model = props.models?.filter((model) => model.uid === uid)
            setModel(model.length > 0 ? model[0] : null)
        }
    }, [uid])

    return (
        <section className="flex flex-col w-full py-8 rounded-md px-4">
            <div className="flex flex-col items-center">
                <Select value={uid} setValue={setUid as Dispatch<SetStateAction<string>>} models={props.models as model[]} title='Select Model' />
            </div>
            {
                model && 
                <UpdateModelForm model={model} />
            }
        </section>
    )
}