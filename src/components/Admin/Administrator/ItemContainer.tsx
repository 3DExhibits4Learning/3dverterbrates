'use client'

import { ReactElement } from "react"

export default function AdminItemContainer({children}: {children: Array<"" | ReactElement>}){
    return(
        <section className="flex w-full justify-center">
            <div className="flex flex-col w-1/2 bg-[#D5CB9F] min-h-[400px] rounded-xl border border-[#004C46] mb-8 ml-12">
                {children}
            </div>
        </section>
    )
}