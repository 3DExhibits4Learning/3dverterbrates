"use client";

import { useEffect, useState } from 'react'
import ComponentDivider from '@/components/Shared/ComponentDivider'
import OccurrenceSwiper from "@/components/Collections/GbifSwiper"
import Foot from '@/components/Shared/Foot'
import { Switch } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import Inaturalist from '@/components/Collections/iNaturalist'
import dynamic from 'next/dynamic'
import { isMobileOrTablet } from '../../functions/utils/isMobile';
const SketchfabApi = dynamic(() => import('@/components/Collections/SketchFabAPI'), { ssr: false })
import { GbifResponse, GbifImageResponse } from '@/interface/interface';

export default function MainWrap(props: {
  redirectUrl: string | null,
  model: string,
  gMatch: { hasInfo: boolean, data?: GbifResponse },
  specimenName: string,
  noModelData: { title: string, images: GbifImageResponse[] }
}) {

  const redirectUrl: string | null = props.redirectUrl
  const router = useRouter();
  const model = JSON.parse(props.model).length ? JSON.parse(props.model) : []

  //const mediaQuery = window.matchMedia('(max-width: 1023.5px)')
  var modelHeight = isMobileOrTablet() ? "calc(100vh - 160px)" : "calc(100vh - 104.67px)"

  const [isSelected, setIsSelected] = useState(true)
  //const [scaleSelected, setScaleSelected] = useState(false)
  const [viewWidthInPx, setViewWidthInPx] = useState(window.outerWidth)
  const [viewportHeightInPx, setViewportHeightInPx] = useState(window.outerHeight + 200)
  const [swiperHeight, setSwiperHeight] = useState(window.outerHeight - 96)
  const [imgHeight, setImageHeight] = useState(window.outerHeight - 208)

  useEffect(() => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  }, [redirectUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  if (typeof (window)) {
    window.onresize = () => {
      setViewportHeightInPx(window.outerHeight + 200)
      setViewWidthInPx(window.outerWidth)
      setSwiperHeight(window.outerHeight)
      setImageHeight(window.outerHeight - 112)
    }
  }

  //var screenSize: boolean = window.matchMedia(("(max-width: 768px)")).matches
  //var txtSize: string = screenSize ? "1rem" : "1.4rem"

  return (
    <>
      {
        !!model.length && props.gMatch.hasInfo &&
        <>
          <div className="hidden lg:flex h-10 bg-[#00856A] dark:bg-[#212121] text-white items-center justify-between ">
            <p style={{ paddingLeft: "2.5%" }}>Also on this page: <a className="mx-4" href="#imageSection"><u>Images</u></a> <a href="#mapSection"><u>iNaturalist Observations</u></a></p>
            <div className='flex mr-4'>
              {/* <Switch className='mr-12' defaultSelected id="scaleSwitch" isSelected={scaleSelected} color='secondary' onValueChange={setScaleSelected}>
            <span className="text-white">Scale</span>
          </Switch> */}
              <Switch style={{ paddingRight: "2.5%" }} defaultSelected id="annotationSwitch" isSelected={isSelected} color='secondary' onValueChange={setIsSelected}>
                <span className="text-white">Annotations</span>
              </Switch>
            </div>
          </div>
          <div className="flex flex-col m-auto" style={{ width: "100vw", maxWidth: viewWidthInPx, margin: "0 auto !important" }}>
            <div style={{ height: modelHeight, maxHeight: viewportHeightInPx }}>
              <SketchfabApi
                model={model[0]}
                gMatch={props.gMatch}
                images={props.noModelData.images}
                imageTitle={props.noModelData.title}
              />
            </div>
            {/* Tailwind utility class "mb" was literally broken here. Anything less than mb-4 was treated as zero margin. Only style would work. */}
            <div id="imageSection" style={{ marginBottom: "14px" }} className="mt-4">
              <ComponentDivider title={props.noModelData.title} />
            </div>
            <div style={{ maxHeight: viewportHeightInPx }}>
              <OccurrenceSwiper
                info={props.noModelData.images} swiperHeight={swiperHeight} imageHeight={imgHeight} />
            </div>
            <div className="mt-4">
              <ComponentDivider title={'Observations from iNaturalist'} />
            </div>
            <div style={{ height: "calc(100vh - 176px)", maxHeight: viewportHeightInPx, minHeight: '750px' }}>
              <Inaturalist activeSpecies={props.specimenName} />
            </div>
            <Foot />
          </div>
        </>
      }
      {
        !model.length && props.gMatch.hasInfo &&
        <div className="flex flex-col m-auto" style={{ width: "100vw", maxWidth: viewWidthInPx, margin: "0 auto !important" }}>
          {/* lg breakpoint in tailwind not working here, hence id and hard coded breakpoint in globals */}
          <div id='tailwindBroken' className="h-14 !lg:h-8 bg-[#00856A] dark:bg-[#3d3d3d] text-white flex justify-center items-center text-center">
            <p><i>{`"${decodeURI(props.specimenName)}" `}</i>{`${props.noModelData.title}`}</p>
          </div>
          <div style={{ maxHeight: viewportHeightInPx }}>
            <OccurrenceSwiper
              info={props.noModelData.images} swiperHeight={swiperHeight} imageHeight={imgHeight} />
          </div>
          <div className="mt-4">
            <ComponentDivider title='iNaturalist Observations' />
          </div>
          <div style={{ height: "calc(100vh - 176px)", maxHeight: viewportHeightInPx }}>
            <Inaturalist activeSpecies={props.specimenName} />
          </div>
          <Foot />
        </div>
      }
    </>
  )
}


