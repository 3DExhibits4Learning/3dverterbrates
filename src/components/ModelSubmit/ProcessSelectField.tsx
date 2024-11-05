import { Dispatch, SetStateAction } from "react"

const ProcessSelect = (props: {defaultValue?: string, value: string, setValue: Dispatch<SetStateAction<string>>}) => {

    return (
        <>
            <p className='text-2xl mt-8 ml-12'>What process was used to create the 3D model?</p>
            <div className='grid grid-cols-2 w-[210px] ml-12 mt-4' style={{ gridTemplateColumns: 'auto auto' }}>
                <div className='flex items-center'><label className='text-xl'>Photogrammetry</label></div>
                <div className='flex items-center'>
                    <input
                        onChange={(e) => props.setValue(e.target.value)} className='mt-1' type='radio' value='photogrammetry' name='modelMethod' id='photogrammetry'>
                    </input>
                </div>
                <div className='flex items-center'>
                    <label className='text-xl mr-4'>X-Ray or Laser Scan</label>
                </div>
                <div className='flex items-center'>
                    <input onChange={(e) => props.setValue(e.target.value)} className='mt-1' type='radio' value='scan' name='modelMethod' id='scan'>
                    </input>
                </div>
                <div className='flex items-center'>
                    <label className='text-xl mr-4'>Other</label>
                </div>
                <div className='flex items-center'>
                    <input onChange={(e) => props.setValue(e.target.value)} className='mt-1' type='radio' value='other' name='modelMethod' id='other'>
                    </input>
                </div>
            </div>
        </>
    )
}

export default ProcessSelect