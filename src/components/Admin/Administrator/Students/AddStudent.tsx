'use client'

import TextInput from "@/components/Shared/Form Fields/TextInput"
import { useState, useEffect, useContext } from "react"
import { Button } from "@nextui-org/react"
import { DataTransferContext } from "../ManagerClient"
import dataTransferHandler from "@/functions/dataTransfer/dataTransferHandler"
import addStudent from "@/functions/managerClient/addStudent"

export default function AddStudent() {

    const initializeDataTransfer = useContext(DataTransferContext).initializeDataTransferHandler
    const terminateDataTransfer = useContext(DataTransferContext).terminateDataTransferHandler

    const [email, setEmail] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [buttonDisabled, setButtonDiabled] = useState<boolean>(true)
    const re = /^\w{5}@humboldt.edu$/

    const addStudentHandler = async () => await dataTransferHandler(initializeDataTransfer, terminateDataTransfer, addStudent, [email, name], 'Adding student')

    useEffect(() => {
        if (re.test(email) && name) setButtonDiabled(false)
        else setButtonDiabled(true)
    }, [email])

    return (
        <section className="flex justify-center mb-8">
            <div className="flex flex-col bg-[#D5CB9F] w-1/2 rounded-xl border border-[#004C46] py-8">
                <section className="flex-col ml-12">
                    <div className="my-8 flex flex-col w-full "><TextInput value={name} setValue={setName} title='Name' /></div>
                    <div className="my-8 flex flex-col w-full"><TextInput value={email} setValue={setEmail} title='Email' /></div>
                    <Button className="mt-2 mb-8 text-xl text-white" isDisabled={buttonDisabled} onPress={addStudentHandler}>Add Student</Button>
                </section>
            </div>
        </section>
    )
}