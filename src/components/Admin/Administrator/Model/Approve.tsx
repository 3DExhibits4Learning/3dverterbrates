'use client'

import { model } from "@prisma/client"
import AdminItemContainer from "../ItemContainer"
import Select from "@/components/Shared/Form Fields/Select"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
const ModelViewer = dynamic(() => import("@/components/Shared/ModelViewer"), { ssr: false })
import ApproveModelData from "./ApproveModelData"
import { Button } from "@nextui-org/react"

export default function ApproveModel(props: { unapprovedModels: model[] }) {

    const [uid, setUid] = useState<string>('')
    const [model, setModel] = useState<model>()

    const setModelHandler = () => setModel(props.unapprovedModels.find(model => model.uid === uid))

    useEffect(() => { if (uid) setModelHandler() }, [uid])

    return (
        <AdminItemContainer>
            <Select value={uid} setValue={setUid} models={props.unapprovedModels} />
            <div className="flex w-full">
                {
                    uid &&
                    <div className="w-full h-full">
                        <ModelViewer uid={uid} />
                    </div>
                }
                {
                    model &&
                    <>
                        <ApproveModelData model={model} />
                        <div>
                            <Button>
                                Approve 3D Model
                            </Button>
                        </div>
                    </>
                }
            </div>
        </AdminItemContainer>
    )
}