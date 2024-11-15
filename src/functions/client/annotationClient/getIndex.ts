    'use client'
    
    // Returns the index(annotation_no in the annotations table) of the activeAnnotation
    export default function getIndex(numberOfAnnotations: number, firstAnnotationPosition: string, activeAnnotationIndex: number | 'new' | undefined){
        
        let index

        if (!numberOfAnnotations && !firstAnnotationPosition || activeAnnotationIndex == 1) index = 1
        else if (!numberOfAnnotations) index = 2
        else if (numberOfAnnotations && activeAnnotationIndex != 'new') index = activeAnnotationIndex
        else if (activeAnnotationIndex == 'new') index = numberOfAnnotations + 2

        return index
    }