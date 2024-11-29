'use client'

import { Modal, ModalContent, ModalBody, ModalFooter, Spinner, Button } from "@nextui-org/react"
import { useContext } from "react";
import { AnnotationEntryData } from "./AnnotationEntry";
import { annotationClientData, annotationEntryContext } from "@/interface/interface";
import { AnnotationClientData } from "./AnnotationClient";

export default function AnnotationEntryTransferModal() {

    const context = useContext(AnnotationEntryData) as annotationEntryContext
    const dispatch = (useContext(AnnotationClientData) as annotationClientData).annotationsAndPositionsDispatch
    const transferState = context.transferState

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
                        <Button color="primary" onPress={() => dispatch({type:'annotationSavedOrDeleted'})}>OK</Button>
                    }
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
