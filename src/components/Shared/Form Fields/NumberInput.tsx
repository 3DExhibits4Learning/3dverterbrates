'use client'

import { SetStateAction, Dispatch } from "react"

export default function NumberInput(props: { value: string, setValue: Dispatch<SetStateAction<string>>, title: string, required?: boolean, leftMargin?: string, textSize?: string }) {
    const textSize = props.textSize ?? 'text-xl'
    return (
        <>
            <p className={`mb-1 ${props.leftMargin} ${textSize}`}>{props.title}
                
                {
                    props.required &&
                    <span className="text-red-600 ml-1">*</span>
                }

            </p>
            <input
                className={`w-4/5 min-w-[300px] max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46] ${props.leftMargin}`}
                type='number'
                onChange={(e) => {
                    props.setValue(e.target.value)
                }}
                value={props.value}
            >
            </input>
        </>
    )
}