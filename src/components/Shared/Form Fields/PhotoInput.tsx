'use client'

import { SetStateAction, Dispatch } from "react"

export default function PhotoInput(props: { setFile: Dispatch<SetStateAction<File>>, required?: boolean, title?: string }) {
    console.log('PhotoInput Render')
    return (
        <>
            {
                props.title &&
                <p className="text-xl mb-2">{props.title}
                    {
                        props.required &&
                        <span className="text-red-600 ml-1">*</span>
                    }
                </p>
            }
            <input
                id='formFileInput'
                accept='.jpg,.jpeg,.png'
                type='file'
                onChange={(e) => {
                    if (e.target.files) {
                        props.setFile(e.target.files[0])
                    }
                }}
            />
        </>
    )
}