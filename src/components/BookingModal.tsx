import {
  Modal,
  ModalContent,
} from "@nextui-org/react";

import MultiStepForm from "./multiStepForm";

function BookingModal({ isOpen, onOpenChange, room }: any) {
 
  const closeModal =()=>{
    onOpenChange(false)
  }


  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      
        <ModalContent>
          <MultiStepForm  closeModal={closeModal} room={room} />
        </ModalContent>
      
    </Modal>
  );
}

export default BookingModal;