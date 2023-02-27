import { FC } from "react"
import styled from "styled-components"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
`

const ModalContainer = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
`

const CreateCommissionModal: FC<Props> = ({ isOpen, onClose }) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer>
        <h2>Create Commission Modal</h2>
        <p>Modal content goes here...</p>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default CreateCommissionModal
