import { forwardRef, LegacyRef, MutableRefObject } from "react"

const SpeciesAcquisitionDate = forwardRef((props, ref) => {
    const speciesAcquisitionDate = ref as LegacyRef<HTMLInputElement>
    return (
        <>
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>Specimen Acquisition Date </label>
                <input ref={speciesAcquisitionDate as LegacyRef<HTMLInputElement>} type='date' className={`w-4/5 md:w-3/5 max-w-[500px] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 !placeholder-[#9797A0] outline-[#004C46]`}></input>
            </div>
        </>
    )
})

SpeciesAcquisitionDate.displayName = 'SpeciesAcquisitionDate'
export default SpeciesAcquisitionDate