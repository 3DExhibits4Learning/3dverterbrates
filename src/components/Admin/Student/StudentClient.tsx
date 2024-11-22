'use client'

import AnnotationClient from "../Annotation/AnnotationClient"
import { model } from "@prisma/client"
import ModelSubmitForm from "../ModelSubmit/Form"
import { Accordion, AccordionItem } from "@nextui-org/react"

export default function StudentClient(props: { modelsToAnnotate: string, annotationModels: string }) {

    // Tailwind variables
    const accordionTitlesCss = 'text-[#004C46] text-2xl dark:text-[#F5F3E7]'

    return (
        <Accordion className="dark: text-[#F5F3E7]">
            <AccordionItem key='assignments' aria-label='assignments' title='Models to Annotate' classNames={{ title: accordionTitlesCss }}>
                <AnnotationClient modelsToAnnotate={JSON.parse(props.modelsToAnnotate)} annotationModels={JSON.parse(props.annotationModels)} admin={false} />
            </AccordionItem>
            <AccordionItem key='modelSumbit' aria-label='modelSumbit' title='Submit Model' classNames={{ title: accordionTitlesCss }}>
                <ModelSubmitForm />
            </AccordionItem>
        </Accordion>
    )
}