'use client'

export default async function addStudent(email: string, name: string) {
    
    const result = await fetch('/api/admin/student', {
        method: 'POST',
        body: JSON.stringify({ email: email, name: name })
    })
        .then(res => res.json())
        .then(json => json.data)

    return result
}