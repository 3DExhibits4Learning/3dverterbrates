/**
 * @file src/components/Admin/Administrator/Model/DeleteModel.tsx
 * 
 * @fileoverview client component that allows the admin to permanantly delete a 3d model and any associated annotations
 * 
 * @todo swap general text input for a <select> component
 */

'use client'

import { Button } from "@nextui-org/react";
import { useState } from "react";
import Select from "@/components/Shared/Form Fields/Select";
import { fullModel } from "@/api/types";
import deleteModel from "@/functions/client/managerClient/deleteModel";
import { useContext } from "react";
import { DataTransferContext } from "../ManagerClient";
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler";

export default function DeleteModel(props: { models: fullModel[] | undefined }) {

    const initializeDataTransfer = useContext(DataTransferContext).initializeDataTransfer
    const terminateDataTransfer = useContext(DataTransferContext).terminateDataTransfer

    const [uid, setUid] = useState<string>('')

    const deleteModelHandler = async (uid: string) => await dataTransferHandler(initializeDataTransfer, terminateDataTransfer, deleteModel, [uid], "Deleting Model and Annotations")

    return (
        <section className="w-full flex justify-center">
            <div className="w-1/2 flex flex-col border-2 border-[#00856A] rounded-xl bg-[#D5CB9F]">
                <section className="ml-12">
                    <p className="my-12 text-xl">This will <b>permanantly delete</b> the 3D model <b>and</b> any annotations associated with it.</p>
                    {
                        props.models &&
                        <Select value={uid} setValue={setUid} models={props.models} title='Select Model' />
                    }
                    <div className="mb-8 mt-12">
                        <Button
                            className="text-white"
                            isDisabled={!uid}
                            onClick={() => deleteModelHandler}
                        >
                            Delete 3D Model
                        </Button>
                    </div>
                </section>
            </div>
        </section>
    )
}