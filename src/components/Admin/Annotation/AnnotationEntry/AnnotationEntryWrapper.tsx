'use client'

import RepositionAndRadio from "./RepositionAndRadio"
import PhotoAnnotationEntry from "./PhotoAnnotation"
import VideoAnnotationEntry from "./VideoAnnotation"
import ModelAnnotationEntry from "./ModelAnnotationEntry"
import AnnotationEntryButtons from "./Buttons"
import { model } from "@prisma/client"

interface AnnotationEntryWrapper {
    new: boolean,
    index: number,
    createAnnotation: Function,
    updateAnnotation: Function,
    deleteAnnotation: Function,
    createDisabled: boolean,
    saveDisabled: boolean
    annotationModels: model[]
}

export default function AnnotationEntryWrapper(props: AnnotationEntryWrapper) {
    return (
        <div className="w-[98%] min-w-[925px] h-fit flex flex-col border border-[#004C46] dark:border-white mt-4 ml-[1%] rounded-xl">
            <RepositionAndRadio new={props.new} index={props.index} />
            <section className="w-full h-fit">
                <PhotoAnnotationEntry />
                <VideoAnnotationEntry />
                <ModelAnnotationEntry annotationModels={props.annotationModels} />
            </section>
            <AnnotationEntryButtons {...props}/>
        </div>
    )
}