import { FC, useState } from "react"
import styled from "styled-components"
import { create } from "ipfs-http-client"
import placeholder from "/public/no_image.png"
import { useUser } from "@components/user/UserProvider"

type Props = {
  isOpen: boolean
  onClose: () => void
  selected: any
  closeParent: () => void
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
  height: 30%;
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

const Button = styled.button<{ disabled?: boolean }>`
  background-color: ${(props) => (props.disabled ? "#ccc" : "green")};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  position: absolute;
  bottom: 10px;
  right: 10px;
  &:hover {
    background-color: ${(props) => (props.disabled ? "#ccc" : "DarkGreen")};
  }
`

const UploadFile = styled.input``

const UploadWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
`

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`

const Input = styled.input`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  width: 80%;
  margin-bottom: 10px;
`
const TextArea = styled.textarea`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
`

const MintModal: FC<Props> = ({ isOpen, onClose, selected, closeParent }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const { mintCommission } = useUser()

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
            src={`https://artflowz.infura-ipfs.io/ipfs/${selected?.commissionedArtPiece}`}
            alt="no image placeholder"
          />
          <CommissionInfo>
            <Label htmlFor="name">Art Piece Name:</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Label htmlFor="link">Description:</Label>

            <TextArea
              id="notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <CommissionLabel>ID:</CommissionLabel>
            <CommissionValue>{selected?.commissionID}</CommissionValue>
            <CommissionLabel>You receive:</CommissionLabel>
            <CommissionValue>
              ${(parseFloat(selected?.commissionAmount) * 0.975).toFixed(2)}
            </CommissionValue>
            <CommissionLabel>Creator Royalty</CommissionLabel>
            <CommissionValue>10%</CommissionValue>
          </CommissionInfo>
        </Wrapper>
        <Button
          onClick={() =>
            mintCommission(
              selected?.commissionID,
              name,
              description,
              onClose,
              closeParent,
            )
          }
          disabled={!name || !description}
        >
          Mint
        </Button>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default MintModal
