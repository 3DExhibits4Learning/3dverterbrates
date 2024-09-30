'use client'
import { Modal, ModalContent, ModalBody, ModalFooter, Spinner, useDisclosure, Button } from "@nextui-org/react"
import { SetStateAction, Dispatch } from "react";
import { Progress } from "@nextui-org/progress";

export default function DataTransferModal(props: {
    open: boolean,
    transferring: boolean,
    result: string,
    loadingLabel: string,
    href?: string,
    setOpen?: Dispatch<SetStateAction<boolean>>,
    closeFn?: Function,
    closeVar?: boolean,
    modelUpload?: boolean,
    progress?: number
}) {
    const { onOpenChange } = useDisclosure();
    return (
        <>
            <Modal isOpen={props.open} onOpenChange={onOpenChange} isDismissable={false} hideCloseButton isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="text-center">
                                {
                                    props.transferring && !props.modelUpload &&
                                    <Spinner label={props.loadingLabel} />

                                }
                                {
                                    props.transferring && props.modelUpload && props.progress &&
                                    <>
                                        <p>Upload Progress</p>
                                        <p>(Closing this window will not stop upload)</p>
                                        <p><Progress aria-label="Loading..." value={props.progress * 100} className="max-w-md" /></p>
                                        <p>{'Upload is ' + Math.round(props.progress * 100) + '% Complete'}</p>
                                    </>

                                }
                                {
                                    !props.transferring &&
                                    <p>{props.result}</p>
                                }
                                {
                                    !props.transferring && props.modelUpload &&
                                    <>
                                        <p>It may take a few minutes before your model is viewable.</p>
                                        <p>When it is, submit a screen capture of it. This will be the thumbnail that will appear for users to click!</p>
                                    </>
                                }
                            </ModalBody>
                            <ModalFooter className="flex justify-center">
                                {
                                    !props.transferring && props.href &&
                                    // Note that onPress={router.refresh} would randomly not work for this button
                                    <a href={props.href}><Button color="primary">OK</Button></a>
                                }
                                {
                                    !props.transferring && !props.href && props.setOpen && !props.closeFn &&
                                    <Button color="primary" onPress={() => (props.setOpen as Dispatch<SetStateAction<boolean>>)(false)}>OK</Button>
                                }
                                {
                                    !props.transferring && !props.href && props.closeFn &&
                                    <Button color="primary" onPress={() => {
                                        (props.closeFn as Function)(!props.closeVar)
                                    }}>OK</Button>
                                }
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
