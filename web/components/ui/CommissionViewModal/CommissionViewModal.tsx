import { FC } from "react"
import styled from "styled-components"

type Props = {
  isOpen: boolean
  onClose: () => void
  selected: any
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
  z-index: 1;
`

const ModalContainer = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 30px 60px;
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

const CommissionInfo = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: minmax(150px, 0.2fr) 1fr;
  gap: 10px;
  font-size: 16px;
  color: #333;
`

const CommissionLabel = styled.span`
  font-weight: bold;
`

const CommissionValue = styled.span`
  word-wrap: break-word;
`

const CommissionImage = styled.img`
  max-width: 200px;
  max-height: 300px;
  margin-top: 20px;
  border-radius: 5px;
  margin: 20px auto;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Button = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;

  position: absolute;
  bottom: 10px;
  right: 10px;
`

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
        <Wrapper>
          <CommissionImage
            src={`https://artflowz.infura-ipfs.io/ipfs/${selected?.uploadFile}`}
            alt="Commission image"
          />
          <CommissionInfo>
            <CommissionLabel>ID:</CommissionLabel>
            <CommissionValue>{selected?.commissionID}</CommissionValue>
            <CommissionLabel>Amount:</CommissionLabel>
            <CommissionValue>
              ${parseFloat(selected?.commissionAmount).toFixed(2)}
            </CommissionValue>
            <CommissionLabel>Creator:</CommissionLabel>
            <CommissionValue>{selected?.creatorAddress}</CommissionValue>
            <CommissionLabel>Status:</CommissionLabel>
            <CommissionValue>{selected?.status}</CommissionValue>
            <CommissionLabel>Genre:</CommissionLabel>
            <CommissionValue>{selected?.genre}</CommissionValue>
            <CommissionLabel>NSFW:</CommissionLabel>
            <CommissionValue>{selected?.nsfw ? "Yes" : "No"}</CommissionValue>
            <CommissionLabel>Notes:</CommissionLabel>
            <CommissionValue>{selected?.notes}</CommissionValue>
            <CommissionLabel>Link:</CommissionLabel>
            <CommissionValue>{selected?.link}</CommissionValue>
          </CommissionInfo>
        </Wrapper>
        <Button>Cancel</Button>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default CommissionViewModal
