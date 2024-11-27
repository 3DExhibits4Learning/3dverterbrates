'use client'

import { Modal, ModalContent, ModalBody, ModalFooter, Spinner, Button } from "@nextui-org/react"
import { useContext } from "react";
import { AnnotationEntryData } from "./AnnotationEntry";
import { annotationEntryContext } from "@/interface/interface";

export default function AnnotationEntryTransferModal() {

    const context = useContext(AnnotationEntryData) as annotationEntryContext
    const transferState = context.transferState
    const dispatch = context.transferStateDispatch

    return (
        <Modal isOpen={transferState.transferModalOpen} isDismissable={false} hideCloseButton isKeyboardDismissDisabled={true}>
            <ModalContent>
                <ModalBody className="text-center">
                    {
                        transferState.transferring &&
                        <Spinner label={transferState.loadingLabel} />

                    }
                    {
                        !transferState.transferring &&
                        <p>{transferState.result}</p>
                    }
                </ModalBody>
                <ModalFooter className="flex justify-center">
                    {
                        !transferState.transferring &&
                        <Button color="primary" onPress={() => dispatch({type:'annotationSavedOrDeleted', result: transferState.result})}>OK</Button>
                    }
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
