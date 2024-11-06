'use client'

export default async function deleteModel(uid: string){
    
    const deletion = await fetch(`/api/admin/models/delete?uid=${uid}`, {
        method: 'DELETE',
    })
        .then(res => res.json())
        .then(json => json.data)

    return deletion
}