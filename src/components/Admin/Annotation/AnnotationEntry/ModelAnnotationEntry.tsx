'use client'

import { useContext } from "react"
import { AnnotationEntryData } from "../AnnotationEntry"
import { annotationEntryContext } from "@/interface/interface"
import TextInput from "@/components/Shared/Form Fields/TextInput"
import ModelAnnotationSelect from "../../AnnotationFields/ModelAnnotationSelect"
import Annotation from "../Annotation"
import dynamic from "next/dynamic"
import { model } from "@prisma/client"
const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'), { ssr: false })

export default function ModelAnnotationEntry(props:{annotationModels: model[]}) {

    const annotationEntryData = (useContext(AnnotationEntryData) as annotationEntryContext).annotationEntryData

    return (
        <>
            {
                annotationEntryData.annotationType === 'model' &&
                <section className="flex my-12 w-full">
                    <div className="flex ml-12 mt-12 flex-col w-3/5 max-w-[750px] mr-12">
                        <TextInput value={annotationEntryData.annotationTitle as string} field={'annotationTitle'} title='Annotation Title' required />
                        <ModelAnnotationSelect value={annotationEntryData.modelAnnotationUid} field={'modelAnnotationUid'} modelAnnotations={props.annotationModels} />
                        <Annotation annotation={annotationEntryData.annotation} field='annotation' />
                    </div>
                    {
                        annotationEntryData.modelAnnotationUid && annotationEntryData.modelAnnotationUid !== 'select' &&
                        <div className="w-full mr-12">
                            <ModelViewer uid={annotationEntryData.modelAnnotationUid} />
                        </div>
                    }
                </section>
            }
        </>
    )
}