'use client'

export default async function approveModel(uid: string) {
    
    const result = await fetch(`/api/admin/models/approve?uid=${uid}`, {
        method: 'POST',
    })
        .then(res => res.json())
        .then(json => json.data)

    return result
}