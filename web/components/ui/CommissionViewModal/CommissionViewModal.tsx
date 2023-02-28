import { FC } from "react"
import styled from "styled-components"

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
  z-index: 1;
`

const ModalContainer = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 60px;
`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 30px;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
`

type Props = {
  isOpen: boolean
  onClose: () => void
  selected: any
}

const CommissionViewModal: FC<Props> = ({ isOpen, onClose, selected }) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <div>{selected?.commissionID}</div>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default CommissionViewModal
