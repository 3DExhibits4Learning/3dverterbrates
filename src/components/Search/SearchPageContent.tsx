/**
 * @file /components/Search/SearchPageContent.tsx
 * @fileoverview list of 3D models available on the site.
 */

'use client'

import { useEffect, useState, useRef } from "react"
import SearchPageModelList from "./SearchPageModelList"
import SubHeader from "./SubHeader"
import { model } from "@prisma/client"

const getUniqueModelers = (models: model[]): string[] => {
  const uniqueModelers = new Set<string>()
  models.forEach(model => uniqueModelers.add(model.modeled_by as string))
  return Array.from(uniqueModelers)
}

const getUniqueAnnotators = (models: model[]): string[] => {
  const uniqueAnnotators = new Set<string>()
  models.forEach(model => { if (model.annotator) uniqueAnnotators.add(model.annotator as string) })
  return Array.from(uniqueAnnotators)
}

// Main Component

const SearchPageContent = () => {

  const siteReadyModels = useRef<model[]>()

  const [modeledByList, setModeledByList] = useState<string[]>()
  const [annotatedByList, setAnnotatedByList] = useState<string[]>()
  const [selectedModeler, setSelectedModeler] = useState<string>('All')
  const [selectedAnnotator, setSelectedAnnotator] = useState<string>('All')

  useEffect(() => {

    const getModels = async () => await fetch('/api/collections/models')
      .then(res => res.json())
      .then(json => {
        siteReadyModels.current = json.response
        if (siteReadyModels.current) {
          let a = getUniqueModelers(siteReadyModels.current as model[])
          let b = getUniqueAnnotators(siteReadyModels.current as model[])
          a.unshift('All'); b.unshift('All')
          setModeledByList(a)
          setAnnotatedByList(b)
        }
      })

    getModels()

  }, [])

  return (
    <>
      {
        modeledByList && annotatedByList &&
        <>
          <SubHeader
            modeledByList={modeledByList}
            annotatedByList={annotatedByList}
            modeler={selectedModeler}
            annotator={selectedAnnotator}
            setSelectedModeler={setSelectedModeler}
            setSelectedAnnotator={(setSelectedAnnotator)}
          />
          <br />
          <SearchPageModelList models={siteReadyModels.current as model[]} selectedModeler={selectedModeler} selectedAnnotator={selectedAnnotator} />
          <br />
        </>
      }
    </>
  )
}

export default SearchPageContent