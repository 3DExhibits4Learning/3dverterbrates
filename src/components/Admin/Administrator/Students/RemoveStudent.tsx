'use client'

import TextInput from "@/components/Shared/Form Fields/TextInput"
import { useState, useEffect, useContext } from "react"
import { Button } from "@nextui-org/react"
import { DataTransferContext } from "../ManagerClient"
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"
import removeStudent from "@/functions/client/managerClient/removeStudent"

export default function RemoveStudent() {

    const initializeDataTransfer = useContext(DataTransferContext).initializeDataTransferHandler
    const terminateDataTransfer = useContext(DataTransferContext).terminateDataTransferHandler

    const [email, setEmail] = useState<string>('')
    const [buttonDisabled, setButtonDiabled] = useState<boolean>(true)

    const removeStudentHandler = async () => await dataTransferHandler(initializeDataTransfer, terminateDataTransfer, removeStudent, [email], 'Removing student')

    useEffect(() => {
        if (email.includes('@humboldt.edu')) setButtonDiabled(false)
        else setButtonDiabled(true)
    }, [email])

    return (
        <section className="flex justify-center mb-16">
            <div className="flex bg-[#D5CB9F] flex-col w-1/2 rounded-xl border border-[#004C46] py-8 dark:bg-[#212121]">
                <section className="ml-12 flex-col">
                    <TextInput value={email} setValue={setEmail} title='Email' />
                    <div><Button className="mt-4 text-xl text-white" isDisabled={buttonDisabled} onPress={removeStudentHandler}>Remove Student</Button></div>
                </section>
            </div>
        </section>
    )
}