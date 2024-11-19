/**
 * @file /components/Search/SearchPageContent.tsx
 * @fileoverview list of 3D models available on the site.
 */

'use client'

import { useEffect, useState, useRef } from "react"
import SearchPageModelList from "./SearchPageModelList"
import SubHeader from "./SubHeader"
import { fullUserSubmittal } from "@/interface/interface"
import { model } from "@prisma/client"

const getUniqueModelers = (models: model[]): string[] => {
  const uniqueModelers = new Set<string>();
  models.forEach(model => uniqueModelers.add(model.modeled_by as string))
  return Array.from(uniqueModelers);
};


const getUniqueAnnotators = (models: model[]): string[] => {
  const uniqueAnnotators = new Set<string>();
  models.forEach(model => uniqueAnnotators.add(model.annotator as string))
  return Array.from(uniqueAnnotators);
};

// Main Component

const SearchPageContent = () => {

  const siteReadyModels = useRef<model[]>()

  const [modeledByList, setModeledByList] = useState<string[]>()
  const [annotatedByList, setAnnotatedByList] = useState<string[]>()
  const [selectedModeler, setSelectedModeler] = useState<string | undefined>('')
  const [selectedAnnotator, setSelectedAnnotator] = useState<string | undefined>('')

  const handleModelerSelect = (modeler: string | undefined): void => {
    setSelectedModeler(modeler)
  };

  const handleAnnotatorSelect = (annotator: string | undefined): void => {
    setSelectedAnnotator(annotator)
  };

  useEffect(() => {

    let promises = []

    const getModels = async() => await fetch('/api/collections/models')
    .then(res => res.json())
    .then(json => {
        siteReadyModels.current = json.response
        let a = getUniqueModelers(siteReadyModels.current as model[])
        let b = getUniqueAnnotators(siteReadyModels.current as model[])
        a.unshift('All'); b.unshift('All')
        setModeledByList(a)
        setAnnotatedByList(b)
      })

    getModels()

  }, [])

  return (
    <>
      {
        modeledByList && annotatedByList && 
        <>
          <SubHeader modeledByList={modeledByList} annotatedByList={annotatedByList} handleModelerSelect={handleModelerSelect} handleAnnotatorSelect={handleAnnotatorSelect} />
          <br />
          {/* <PageWrapper> */}
            <SearchPageModelList models={siteReadyModels.current as model[]} selectedModeler={selectedModeler} selectedAnnotator={selectedAnnotator} />
            <br />
          {/* </PageWrapper> */}
        </>
      }
    </>
  )
};

export default SearchPageContent;