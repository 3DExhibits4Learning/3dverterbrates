'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Progress } from "@nextui-org/progress";
import { useRouter } from "next/navigation";

const ProgressModal = (props: { progress: number, success: boolean | null, errorMsg: string }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const nullOrTrue = [null, true]
    const router = useRouter()

    return (
        <>
            <Button id='progressModalButton' onClick={onOpen} className="hidden">Open Modal</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='h-1/2 w-[500px] overflow-hidden text-center'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="mt-16">
                                {nullOrTrue.includes(props.success) && <>
                                    <p>Upload Progress</p>
                                    <p>(Closing this window will not stop upload)</p>
                                    <p><Progress aria-label="Loading..." value={props.progress * 100} className="max-w-md" /></p>
                                    <p>{'Upload is ' + Math.round(props.progress * 100) + '% Complete'}</p>
                                </>}
                                {props.success === false && <>
                                    <p className="text-[#cc0000] text-3xl mt-24">ERROR</p>
                                    <p className="text-[#cc0000]">{props.errorMsg}</p>
                                    <p className="text-[#cc0000]">See our <u>guide</u> for assistance</p>
                                </>}
                                {props.success === true &&
                                    <>
                                        <div>
                                            <br></br>
                                            <p>Model uploaded successfully!</p><br></br>
                                            <p>The model can be seen <a href='/admin'><u>here</u> (The servers may need a few minutes to refresh)</a></p>
                                        </div>
                                        <div className="flex justify-around mb-8">
                                            <div>
                                                <Button color="primary" onPress={() => {
                                                    window.scrollTo(0, 0)
                                                    router.refresh()
                                                }}>
                                                    Submit New Model
                                                </Button>
                                            </div>
                                            <div>
                                                <Button color="primary" onPress={() => router.push('/admin')}>
                                                    Dashboard
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                }
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
export default ProgressModal
