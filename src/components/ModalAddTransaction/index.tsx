import { useState } from "react";
import AddTransaction from "../AddTransaction";
import { 
  Overlay, 
  ModalBox, 
  CloseButton, 
  OpenButton 
} from "./style";

const ModalAddTransaction = () => {
  const [open, setOpen] = useState(false);

  const handleAdded = () => {
    setOpen(false); // fecha o modal quando adicionar
  };

  return (
    <>
      <OpenButton onClick={() => setOpen(true)}>
        + 
      </OpenButton>

      {open && (
        <Overlay onClick={() => setOpen(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setOpen(false)}>×</CloseButton>

            <AddTransaction onAdded={handleAdded} />
          </ModalBox>
        </Overlay>
      )}
    </>
  );
};

export default ModalAddTransaction;
