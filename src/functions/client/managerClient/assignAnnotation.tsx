'use client'

export default async function assignAnnotation(uid: string, student: string | null, email: string) {

    const body = {
        uid: uid,
        student: student,
        email: email
    }

    const result = await fetch(`/api/admin/annotations/assign`, {
        method: 'POST',
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(json => json.data)

    return result
}