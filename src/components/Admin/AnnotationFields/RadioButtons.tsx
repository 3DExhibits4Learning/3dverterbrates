'use client'

import { SetStateAction, Dispatch } from "react"

export default function RadioButtons(props: {
    setAnnotationType: Dispatch<SetStateAction<string>>
    setPhotoChecked: Dispatch<SetStateAction<boolean>>
    setVideoChecked: Dispatch<SetStateAction<boolean>>
    setMediaType: Dispatch<SetStateAction<string>>
    setModelChecked: Dispatch<SetStateAction<boolean>>
    photoChecked: boolean
    videoChecked: boolean
    modelChecked: boolean
    annotationType: string
}) {

    return (
        <>
            <div className="grid grid-cols-6 items-center justify-center">
                <p>Photo</p>
                <div>
                    <input
                        type='radio'
                        value='photo'
                        name='typeOfAnnotation'
                        onChange={(e) => {
                            props.setAnnotationType(e.target.value)
                            props.setPhotoChecked(true)
                            props.setVideoChecked(false)
                            props.setModelChecked(false)
                            props.setMediaType('upload')
                        }}
                        checked={props.photoChecked}
                    >
                    </input>
                </div>
                <p className="mr-2">Video</p>
                <div>
                    <input
                        type='radio'
                        value='video'
                        name='typeOfAnnotation'
                        onChange={(e) => {
                            props.setAnnotationType(e.target.value)
                            props.setPhotoChecked(false)
                            props.setVideoChecked(true)
                            props.setModelChecked(false)
                            props.setMediaType('url')
                        }}
                        checked={props.videoChecked}
                    >
                    </input>
                </div>
                <p className="mr-4">Model</p>
                <div>
                    <input
                        type='radio'
                        value='model'
                        name='typeOfAnnotation'
                        onChange={(e) => {
                            props.setAnnotationType(e.target.value)
                            props.setPhotoChecked(false)
                            props.setVideoChecked(false)
                            props.setModelChecked(true)
                            props.setMediaType('model')
                        }}
                        checked={props.modelChecked}
                    >
                    </input>
                </div>
            </div>
        </>
    )
}