'use client'

import { forwardRef, lazy, Suspense } from "react"
const BotanistModelViewer = lazy(() => import("./AnnotationModelViewer"))

const BotanistRefWrapper = forwardRef((ref: any) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BotanistModelViewer ref={ref} />
        </Suspense>
    )
})
BotanistRefWrapper.displayName = 'BotanistRefWrapper'
export default BotanistRefWrapper