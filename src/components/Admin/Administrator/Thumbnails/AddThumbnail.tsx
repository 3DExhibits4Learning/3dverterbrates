'use client'

import { model } from "@prisma/client"
import PhotoInput from "@/components/Shared/Form Fields/PhotoInput";
import dynamic from "next/dynamic";
const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'))
import { Button } from "@nextui-org/react";
import { SetStateAction, Dispatch } from "react";


export default function AddThumbnail(props: { modelsNeedingThumbnails: model[] | undefined, setFile: Dispatch<SetStateAction<File>>, file: File | undefined, addThumbnail: Function }) {

    return (
        <>
            {
                props.modelsNeedingThumbnails && props.modelsNeedingThumbnails.length > 0 &&

                props.modelsNeedingThumbnails.map((model, index) =>
                    <section className="flex flex-col items-center">
                        <div key={index} className="border border-[#004C46] rounded-xl w-fit px-4 font-medium mb-8 pb-4 bg-[#D5CB9F] pt-4">
                            <p>Species Name: {model.spec_name}</p>
                            <p className="mb-8">UID: {model.uid}</p>
                            <div className="w-[500px] h-[500px] mb-8">
                                <ModelViewer uid={model.uid} />
                            </div>
                            <p className="text-center mb-8 text-xl">Upload Thumbnail:</p>
                            <div className="flex justify-between">
                                <PhotoInput setFile={props.setFile as Dispatch<SetStateAction<File>>} />
                                <Button
                                    isDisabled={!props.file}
                                    className="bg-[#004C46] text-white text-[16px] font-medium rounded-md px-4 h-[34px]"
                                    radius='none'
                                    onClick={() => { props.addThumbnail(model.uid, props.file as File) }}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </section>
                )
            }
            
            {
                !props.modelsNeedingThumbnails &&
                <p className="text-xl"> There are no models without thumbnails </p>
            }
            
            {
                props.modelsNeedingThumbnails && props.modelsNeedingThumbnails.length === 0 &&
                <p className="text-xl"> There are no models without thumbnails </p>
            }
        </>
    )
}