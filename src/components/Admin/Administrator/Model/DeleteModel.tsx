import { AccordionItem, Button } from "@nextui-org/react";
import { SetStateAction, Dispatch } from "react";

export default function DeleteModel(props:{uid: string, setUid: Dispatch<SetStateAction<string>>, deleteModel: Function }) {
    return (
        <section className="w-full flex justify-center">
                <div className="h-[400px] w-[600px] flex flex-col items-center border-2 border-[#00856A] rounded-xl bg-[#D5CB9F]">
                    <p className="my-8 text-xl text-center">This will <b>permanantly delete</b> the 3D model <b>and</b> any annotations associated with it.</p>
                    <label className='text-xl block mb-2 font-medium'>UID</label>
                    <input
                        type='text'
                        className={`w-3/5 max-w-[500px] rounded-xl mb-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                        value={props.uid}
                        onChange={(e) => props.setUid(e.target.value)}
                    >
                    </input>
                    <Button
                        className="w-1/2 text-white"
                        isDisabled={!props.uid}
                        onClick={() => props.deleteModel(props.uid as string)}
                    >
                        Delete 3D Model
                    </Button>
                </div>
        </section>
    )
}