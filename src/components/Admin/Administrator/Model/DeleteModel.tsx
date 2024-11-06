/**
 * @file src/components/Admin/Administrator/Model/DeleteModel.tsx
 * 
 * @fileoverview client component that allows the admin to permanantly delete a 3d model and any associated annotations
 * 
 * @todo swap general text input for a <select> component
 */

'use client'

import { Button } from "@nextui-org/react";
import { SetStateAction, Dispatch } from "react";
import Select from "@/components/Shared/Form Fields/Select";
import { fullModel } from "@/api/types";

export default function DeleteModel(props: { uid: string, setUid: Dispatch<SetStateAction<string>>, deleteModel: Function, models: fullModel[] | undefined }) {
    return (
        <section className="w-full flex justify-center">
            <div className="h-[400px] w-[600px] flex flex-col items-center border-2 border-[#00856A] rounded-xl bg-[#D5CB9F]">
                <p className="my-8 text-xl text-center">This will <b>permanantly delete</b> the 3D model <b>and</b> any annotations associated with it.</p>
                {
                    props.models &&
                    <Select value={props.uid} setValue={props.setUid as Dispatch<SetStateAction<string>>} models={props.models} title='Select Model' />
                }
                <Button
                    className="w-1/2 text-white"
                    isDisabled={!props.uid}
                    onClick={() => props.deleteModel(props.uid as string)}
                >
                    Delete 3D Model
                </Button>
            </div>
        </section>
    )
}