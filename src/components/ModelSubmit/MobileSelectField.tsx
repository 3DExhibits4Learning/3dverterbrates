import { useEffect, SetStateAction, Dispatch } from "react"

const MobileSelect = (props : { defaultValue?: string, value: string, setValue: Dispatch<SetStateAction<string>>}) => {

    return (
        <>
        <p className='text-2xl mt-8 ml-12'>Was the 3D Model created with a mobile 3D modeling app, such as PhotoCatch or PolyCam?</p>
        <div className='grid grid-cols-2 w-[90px] mt-4 ml-12'>
            <div className='flex items-center'><label className='text-xl'>Yes</label></div>
            <div className='flex items-center'><input onChange={(e) => props.setValue(e.target.value)} className='mt-1' type='radio' value='Yes' name='usedMobileApp' id='Yes'></input></div>
            <div className='flex items-center'><label className='text-xl mr-4'>No</label></div>
            <div className='flex items-center'><input onChange={(e) => props.setValue(e.target.value)} className='mt-1' type='radio' value='No' name='usedMobileApp' id='No'></input></div>
        </div>
        </>
    )
}

export default MobileSelect