'use client'

import PhotoInput from "@/components/Shared/Form Fields/PhotoInput";
import { Button } from "@nextui-org/react";
import { SetStateAction, Dispatch } from "react";

export default function UpdateThumbnail(props: { setFile: Dispatch<SetStateAction<File>>, file: File | undefined, updateThumbnail: Function, uid: string }) {
    return (
        <>
            <section className="flex flex-col">
                <div className="rounded-xl w-full px-4 font-medium mb-8 pb-4 bg-[#D5CB9F] pt-4">
                    <p className="text-center mb-8 text-xl">Upload Thumbnail:</p>
                    <div className="flex justify-between">
                        <PhotoInput setFile={props.setFile as Dispatch<SetStateAction<File>>}/>
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