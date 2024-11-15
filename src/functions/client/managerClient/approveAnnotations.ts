'use client'

export async function approveAnnotations(uid: string) {

    const result = await fetch(`/api/admin/annotations/approve?uid=${uid}`, {
        method: 'PATCH',
    })
        .then(res => res.json())
        .then(json => json.data)

    return result
}

export async function unapproveAnnotations(uid: string) {

    const result = await fetch(`/api/admin/annotations/unapprove?uid=${uid}`, {
        method: 'PATCH',
    })
        .then(res => res.json())
        .then(json => json.data)

    return result
}