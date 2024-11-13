/**
 * @file CommunitySFAPI.tsx
 * @fileoverview Client component which renders the 3D models and annotations.
 */

"use client";

import { useEffect, useState } from 'react'
import { boolRinse, addCommas } from './SketchfabDom'
import { toUpperFirstLetter } from '@/functions/utils/toUpperFirstLetter'
import dynamic from 'next/dynamic'
import { Chip } from '@nextui-org/react';
const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'))
import Image from 'next/image';
import CommunityHerbarium from '@/functions/utils/Community3dModel';
import { userSubmittal } from '@prisma/client';
import { GbifImageResponse, GbifResponse } from '@/api/types';

const CommunitySFAPI = (props: { model: userSubmittal, gMatch: { hasInfo: boolean, data?: GbifResponse }, images: GbifImageResponse[], imageTitle: string }) => {

    const [s, setS] = useState<CommunityHerbarium>() // s = specimen

    useEffect(() => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        const instantiateHerbarium = async () => {
            setS(await CommunityHerbarium.model(props.model, props.gMatch, props.images, props.imageTitle))
        }
        instantiateHerbarium()
    }, []);

    return (
        <>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>

            <div className="flex bg-black m-auto min-h-[150px]" style={{ height: "100%", width: "100%" }}>

                <article className='w-full lg:w-3/5 h-full'>
                    <Chip size='lg' color='secondary' className='z-[1] absolute ml-4 mt-4 lg:ml-8 lg:mt-8 text-black'>Community</Chip>
                    <ModelViewer uid={props.model.modeluid} />
                </article>

                <div className='hidden lg:flex lg:w-2/5' style={{ transition: "width 1.5s", color: "#F5F3E7", zIndex: "1", overflowY: "auto", overflowX: "hidden" }}>
                    
                    {
                        s &&
                        <div className="w-full h-[65%]" style={{ display: "block" }}>
                            <div className='fade flex w-[99%] mt-[25px]'>
                                <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                                    <p> Classification </p>
                                </div>
                                <div className='w-[65%] py-[20px] justify-center items-center text-center'>
                                    <p>Species: <i><span className='text-[#FFC72C]'>{s.gMatch.data?.species}</span></i></p>
                                    <p>Kingdom: {s.gMatch.data?.kingdom}</p>
                                    <p>Phylum: {s.gMatch.data?.phylum}</p>
                                    <p>Order: {s.gMatch.data?.order}</p>
                                    <p>Family: {s.gMatch.data?.family}</p>
                                    <p>Genus: <i>{s.gMatch.data?.genus}</i></p>
                                </div>
                            </div>

                            <div className='fade flex w-[99%] mt-[25px]'>
                                <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                                    <p> Profile </p>
                                </div>
                                <div className='w-[65%] py-[20px] justify-center items-center text-center px-[2%]'>
                                    {s.commonNames.length > 1 && <p>Common Names: {addCommas(s.commonNames)}</p>}
                                    {s.commonNames.length == 1 && <p>Common Names: {s.commonNames[0]}</p>}
                                    {s.profile.extinct !== '' && <p>Extinct: {boolRinse(s.profile.extinct)}</p>}
                                    {s.profile.habitat && <p>Habitat: {toUpperFirstLetter(s.profile.habitat)}</p>}
                                    {s.profile.freshwater !== '' && <p>Freshwater: {boolRinse(s.profile.freshwater)}</p>}
                                    {s.profile.marine !== '' && <p>Marine: {boolRinse(s.profile.marine)}</p>}
                                </div>
                            </div>

                            <div className='fade flex w-[99%] mt-[25px]'>
                                <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                                    <p> 3D Model </p>
                                </div>
                                <div className='w-[65%] py-[20px] justify-center items-center text-center'>
                                    <p>Modeler: {s.model.artistName}</p>
                                    <p>Build method: {s.model.methodology}</p>

                                    {
                                        s.model.createdWithMobile &&
                                        <>
                                            <div className="flex items-center justify-center">
                                                <div className='relative h-[24px] w-[24px] inline-block my-2'>
                                                    <Image src='../../../cellPhone.svg' alt='Mobile Device Icon' fill></Image>
                                                </div>
                                                <span className="ml-1">Made with mobile app</span>
                                            </div>
                                        </>
                                    }

                                    {
                                        s.tags.length > 0 &&
                                        <div className="flex items-center h-fit mt-1 justify-center">
                                            <div className='relative h-[24px] w-[24px] mr-2 mt-2'>
                                                <Image src='../../../tagSvg.svg' alt='Tag Icon' fill></Image>
                                            </div>
                                            {
                                                s.tags.map((tag, i) => {
                                                    return (
                                                        <p key={i} className="bg-[#004C46] dark:bg-[#E5E5E5] text-white dark:text-black mx-[3px] px-[8px] py-[4px] rounded-[3px] mt-[1%] border border-[#00856A] dark:border-none">{tag}</p>
                                                    )
                                                })

                                            }

                                        </div>
                                    }

                                    {
                                        s.software.length > 0 &&
                                        <div className="flex items-center h-fit mt-1 justify-center">
                                            <div className='relative h-[24px] w-[24px] mr-2 mt-1'>
                                                <Image src='../../../desktopSvg.svg' alt='Computer Icon' fill></Image>
                                            </div>
                                            {
                                                s.software.map((software, i) => {
                                                    return (
                                                        <p key={i} className="bg-[#004C46] dark:bg-[#E5E5E5] text-white dark:text-black mx-[3px] px-[8px] py-[4px] rounded-[3px] mt-[1%] border border-[#00856A] dark:border-none">{software}</p>
                                                    )
                                                })
                                            }
                                        </div>
                                    }
                                </div>
                            </div>

                            <br></br>

                            {
                                s.summary &&
                                <>
                                    <br></br>
                                    <h1 className='fade text-center text-[1.5rem]'>Description</h1>
                                    <p dangerouslySetInnerHTML={{ __html: s.summary.extract_html }} className='fade text-center pr-[1.5%] pl-[0.5%]'></p>
                                    <br></br>
                                    <p className='fade text-center text-[0.9rem]'>from <a href={s.summary.content_urls.desktop.page} target='_blank'><u>Wikipedia</u></a></p>
                                </>
                            }

                        </div>
                    }

                </div>
            </div>
        </>
    )
}
export default CommunitySFAPI