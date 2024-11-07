'use client'

import TextInput from "@/components/Shared/Form Fields/TextInput"
import { useState, useEffect } from "react"
import { Button } from "@nextui-org/react"

export default function RemoveStudent() {

    const [email, setEmail] = useState<string>('')
    const [buttonDisabled, setButtonDiabled] = useState<boolean>(true)

    useEffect(() => {
        if(email && email.includes('@humboldt.edu')) setButtonDiabled(false)
    }, [email])

    const re = /^\w{5}@humboldt.edu/
    console.log(re.test('ab632@humboldt.edu'))

    return (
        <section className="flex justify-center">
            <div className="flex bg-[#D5CB9F] flex-col w-1/2 rounded-xl border border-[#004C46] items-center py-8">
                <TextInput value={email} setValue={setEmail} title='Enter Student Email' />
                <Button className="mt-16 text-xl text-white" isDisabled={buttonDisabled}>Remove Student</Button>
            </div>
        </section>
    )
}