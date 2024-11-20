/**
 * @file /app/collections/[specimenName]/page.tsx
 * @fileoverview the collections page for when users are viewing a specific specimen (genus or species).
 * Contains the 3D model (if it exists), images and inaturalist observations, map and leaderboard.
 */

// Typical Imports
import { GbifImageResponse, GbifResponse } from "@/interface/interface"
import { getModel } from '@/functions/server/queries'
import { fetchCommonNameInfo, fetchSpecimenGbifInfo, fetchGbifImages } from "@/functions/server/fetchFunctions"
import { model } from "@prisma/client"
import { redirect } from "next/navigation"

// Default Imports
import dynamic from "next/dynamic"
import NoDataFound from "@/components/Collections/NoDataFound"

// Dynamic Imports
const Header = dynamic(() => import('@/components/Header/Header'), { ssr: false })
const CollectionsWrapper = dynamic(() => import('@/components/Collections/CollectionsWrapper'), { ssr: false })

// Main JSX
export default async function Page({ params }: { params: { specimenName: string } }) {

  // Variable declarations
  let redirectUrl: string | null = null;
  var promises = []
  var gMatch: any
  var _3dmodel: any
  var noModelData: any
  var images: any
  const decodedSpecimenName = decodeURI(params.specimenName)

  // Push GBIF fetch and getModel onto promise array
  promises.push(fetchSpecimenGbifInfo(params.specimenName), getModel(decodedSpecimenName))

  // Await the promises
  await Promise.all(promises).then(results => {

    // Populate variables with types
    gMatch = results[0] as { hasInfo: boolean, data?: GbifResponse }
    _3dmodel = results[1] as model[]

    // If there is a GBIF record of the specimen, fetch images
    if (gMatch.hasInfo) return fetchGbifImages(gMatch.data.usageKey, gMatch.data.rank)
  })
    // Populate variables with images (or undefined if there are no images)
    .then(res => {
      images = res
      noModelData = { title: 'Images from the Global Biodiversity Information Facility', images: images }
    })

  // If there is no model or GBIF record of the specimen, we test for a common name
  if (!(_3dmodel.length || gMatch.hasInfo)) {

    // Await common name data
    const commonNameInfo = await fetchCommonNameInfo(params.specimenName)

    // If there is no common name data, retrun <NoDataFound/>, else redirect to common name search
    if (commonNameInfo.length <= 0) return <NoDataFound specimenName={params.specimenName} />
    else redirect(`/collections/common-name/${params.specimenName}`)
  }


  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <title>3D Herbarium Collections</title>

      <Header
        searchTerm={params.specimenName}
        headerTitle={params.specimenName}
        hasModel={!!_3dmodel.length}
        pageRoute="collections"
      />

      <CollectionsWrapper
        model={JSON.stringify(_3dmodel)}
        gMatch={gMatch}
        specimenName={params.specimenName}
        noModelData={noModelData as { title: string, images: GbifImageResponse[] }}
      />
    </>
  )
}


