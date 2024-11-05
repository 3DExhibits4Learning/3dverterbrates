'use client'

import { model } from "@prisma/client"
import Select from "@/components/Shared/Form Fields/Select"
import dynamic from "next/dynamic"
const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'))
import UpdateThumbnail from "./UpdateThumbnail"
import { SetStateAction, Dispatch } from "react"


export default function UpdateThumbnailContainer(props: {
    modelsWithThumbnails: model[] | undefined,
    updateThumbUid: string,
    setUpdateThumbUid: Dispatch<SetStateAction<string>>,
    updateFile: File | undefined,
    setUpdateFile: Dispatch<SetStateAction<File>>,
    updateThumbnail: Function
}) {
    return (
        <div className="w-full flex justify-center">
            <section className="flex flex-col w-fit py-8 bg-[#D5CB9F] rounded-md px-4 border border-[#004C46]">
                {
                    props.modelsWithThumbnails && props.modelsWithThumbnails.length > 0 &&
                    <>
                        <Select value={props.updateThumbUid} setValue={props.setUpdateThumbUid as Dispatch<SetStateAction<string>>} models={props.modelsWithThumbnails} title='Select Model' />

                        {
                            props.updateThumbUid &&
                            <div className="my-4">
                                <div className="w-[500px] h-[500px] mb-8">
                                    <ModelViewer uid={props.updateThumbUid} />
                                </div>
                                <UpdateThumbnail uid={props.updateThumbUid} file={props.updateFile} setFile={props.setUpdateFile as Dispatch<SetStateAction<File>>} updateThumbnail={props.updateThumbnail} />
                            </div>
                        }
                    </>
                }
            </section>
        </div>
    )
}