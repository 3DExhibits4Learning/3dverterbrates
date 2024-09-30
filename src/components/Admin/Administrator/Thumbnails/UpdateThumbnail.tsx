'use client'

import { model } from "@prisma/client"
import PhotoInput from "@/components/Shared/Form Fields/PhotoInput";
import dynamic from "next/dynamic";
const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'))
import { Button } from "@nextui-org/react";
import { SetStateAction, Dispatch, useState } from "react";
import Select from "@/components/Shared/Form Fields/Select";

export default function UpdateThumbnail(props: { setFile: Dispatch<SetStateAction<File>>, file: File | undefined, updateThumbnail: Function, uid: string }) {

    const [updateThumbUid, setUpdateThumbUid] = useState<string>('')

    return (
        <>
            <section className="flex flex-col">
                <div key={Math.random()} className="border border-[#004C46] rounded-xl w-fit px-4 font-medium mb-8 pb-4 bg-[#D5CB9F] pt-4">
                    <div className="w-[500px] h-[500px] mb-8">
                        <ModelViewer uid={props.uid} />
                    </div>
                    <p className="text-center mb-8 text-xl">Upload Thumbnail:</p>
                    <div className="flex justify-between">
                        <PhotoInput setFile={props.setFile as Dispatch<SetStateAction<File>>} />
                        <Button
                            isDisabled={!props.file}
                            className="bg-[#004C46] text-white text-[16px] font-medium rounded-md px-4 h-[34px]"
                            radius='none'
                            onClick={() => { props.updateThumbnail(props.uid, props.file as File) }}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </section>
        </>
    )
}