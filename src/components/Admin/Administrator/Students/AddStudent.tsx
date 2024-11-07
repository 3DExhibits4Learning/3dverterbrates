'use client'

import TextInput from "@/components/Shared/Form Fields/TextInput"
import { useState, useEffect, useContext } from "react"
import { Button } from "@nextui-org/react"
import { DataTransferContext } from "../ManagerClient"
import dataTransferHandler from "@/functions/dataTransfer/dataTransferHandler"
import addStudent from "@/functions/managerClient/addStudent"

export default function AddStudent() {

    const initializeDataTransfer = useContext(DataTransferContext).initializeDataTransfer
    const terminateDataTransfer = useContext(DataTransferContext).terminateDataTransfer

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
        <section className="flex justify-center">
            <div className="flex bg-[#D5CB9F] flex-col w-1/2 rounded-xl border border-[#004C46] items-center py-8">
                <div className="my-8 flex flex-col w-full items-center"><TextInput value={name} setValue={setName} title='Enter Student Name' /></div>
                <TextInput value={email} setValue={setEmail} title='Enter Student Email' />
                <Button className="mt-16 text-xl text-white" isDisabled={buttonDisabled} onPress={addStudentHandler}>Add Student</Button>
            </div>
        </section>
    )
}