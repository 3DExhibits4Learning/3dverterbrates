import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";
import { getAllPendingModels, getAllSiteReadyModels, deleteAllAnnotations, delete3DModel } from "@/api/queries";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { management } from "@/utils/devAuthed"
import ManagerClient from "@/components/Admin/Administrator/ManagerClient";
//import prisma from "@/utils/prisma";

export default async function Page() {

    // management AUTH redirect

    const session = await getServerSession(authOptions)
    const email = session?.user?.email as string
    const user = session.user.name ?? ''

    if (!management.includes(email)) {
        return <h1>NOT AUTHORIZED</h1>
    }

    const pendingModels = await getAllPendingModels()

    return (
        <>
            <Header pageRoute="collections" headerTitle='Management' />
            <main className="flex flex-col !min-h-[calc(100vh-177px)]">
                <ManagerClient 
                pendingModels={pendingModels} 
                projectUid={process.env.SKETCHFAB_PROJECT_3DVERTEBRATES as string} 
                email={email} 
                orgUid={process.env.SKETCHFAB_ORGANIZATION as string}
                user={user} 
                />
            </main>
            <Foot />
        </>
    )
}

// KEEP *** Run to restore integrity in 3D herbarium db

// const models = await prisma.model.findMany({
//     select: {
//         spec_name: true,
//         spec_acquis_date: true
//     }
// })
// const specimen = await prisma.specimen.findMany({
//     select: {
//         spec_name: true,
//         spec_acquis_date: true
//     }
// })

// let results = []

// for (let i in models) {
//     const specimenExists = specimen.some(specimen => models[i].spec_name.toLowerCase() === specimen.spec_name && models[i].spec_acquis_date.toDateString() === specimen.spec_acquis_date.toDateString())
//     if (!specimenExists) results.push(models[i])
// }


// for (let i in results) {
//     if (!results[i].spec_name.includes('Ceanothus')) {
//         const specimenRecordCreated = await prisma.specimen.create({
//             data: {
//                 spec_name: results[i].spec_name,
//                 spec_acquis_date: results[i].spec_acquis_date,
//                 procurer: 'Heather Davis'
//             }
//         })
//         console.log('specimenRecordCreated ', specimenRecordCreated)
//     }
// }

//console.log(results.length)
//console.log(results)
//console.log(specimen[0])