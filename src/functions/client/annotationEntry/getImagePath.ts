'use client'

import { photo_annotation } from "@prisma/client"

export default function getImagePath(photoAnnotation: photo_annotation) {
    const path = process.env.NEXT_PUBLIC_LOCAL === 'true' ? `X:${photoAnnotation.url.slice(5)}` : `public${photoAnnotation.url}`
    return `/api/nfs?path=${path}`
}