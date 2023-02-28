import { useUser } from "@components/user/UserProvider"
import { FC, useState } from "react"
import styled from "styled-components"
import CompleteModal from "../CompleteModal"
import MintModal from "../MintModal"

type Props = {
  isOpen: boolean
  onClose: () => void
  selected: any
  asCreator: boolean
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
  &:hover {
    background-color: DarkRed;
  }
`

const AcceptButton = styled.button`
  background-color: green;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;

  position: absolute;
  bottom: 10px;
  right: 100px;
  &:hover {
    background-color: DarkGreen;
  }
`

const CompleteButton = styled.button`
  background-color: green;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;

  position: absolute;
  bottom: 10px;
  right: 10px;
  &:hover {
    background-color: DarkGreen;
  }
`

const CompleteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
`

const DownloadButton = styled.button`
  background-color: transparent;
  color: #7539d4;
  border: solid 2px #7539d4;
  padding: 10px 40px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #7539d4;
    color: white;
  }
`

const MintButton = styled.button`
  background-color: #7539d4;
  color: white;
  border: none;
  padding: 10px 40px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #7539f4;

    transform: scale(1.05);
  }
`

const CommissionedArtPiece = styled.img`
  margin-top: 20px;
  border-radius: 5px;
  margin: 20px auto;
`

const CommissionViewModal: FC<Props> = ({
  isOpen,
  onClose,
  selected,
  asCreator,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [mintModal, setMintModal] = useState(false)

  const handleModalClose = () => {
    setShowModal(false)
  }

  const handleButtonClick = () => {
    setShowModal(true)
  }

  const handleMintModalClose = () => {
    setMintModal(false)
  }

  const handleMintButtonClick = () => {
    setMintModal(true)
  }

  const { cancelCommission, acceptCommission, rejectCommission } = useUser()

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `https://artflowz.infura-ipfs.io/ipfs/${selected?.commissionedArtPiece}`,
      )
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "commissioned-art-piece.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        {selected?.status === "completed" ? (
          <CompleteWrapper>
            <CommissionedArtPiece
              width={400}
              src={`https://artflowz.infura-ipfs.io/ipfs/${selected?.commissionedArtPiece}`}
              alt="Commission image"
            />
            <ButtonWrapper>
              <DownloadButton onClick={handleDownload}>Download</DownloadButton>
              <MintButton onClick={handleMintButtonClick}>
                Mint as NFT
              </MintButton>
            </ButtonWrapper>
          </CompleteWrapper>
        ) : (
          <>
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
                {asCreator && (
                  <>
                    <CommissionLabel>Platform fee:</CommissionLabel>
                    <CommissionValue>2.5%</CommissionValue>
                  </>
                )}
                <CommissionLabel>
                  {asCreator ? "Commissioner" : "Creator:"}
                </CommissionLabel>
                <CommissionValue>
                  {asCreator
                    ? selected?.commissionerAddress
                    : selected?.creatorAddress}
                </CommissionValue>
                <CommissionLabel>Status:</CommissionLabel>
                <CommissionValue>{selected?.status}</CommissionValue>
                <CommissionLabel>Genre:</CommissionLabel>
                <CommissionValue>{selected?.genre}</CommissionValue>
                <CommissionLabel>NSFW:</CommissionLabel>
                <CommissionValue>
                  {selected?.nsfw ? "Yes" : "No"}
                </CommissionValue>
                <CommissionLabel>Notes:</CommissionLabel>
                <CommissionValue>{selected?.notes}</CommissionValue>
                <CommissionLabel>Link:</CommissionLabel>
                <CommissionValue>{selected?.link}</CommissionValue>
              </CommissionInfo>
            </Wrapper>
            {asCreator ? (
              <>
                {selected?.status !== "accepted" ? (
                  <div>
                    <AcceptButton
                      onClick={() =>
                        acceptCommission(
                          selected?.commissionerAddress,
                          selected?.commissionID,
                          onClose,
                        )
                      }
                    >
                      Accept
                    </AcceptButton>
                    <Button
                      onClick={() =>
                        rejectCommission(
                          selected?.commissionerAddress,
                          selected?.commissionID,
                          onClose,
                        )
                      }
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <CompleteButton onClick={handleButtonClick}>
                    Complete
                  </CompleteButton>
                )}
              </>
            ) : (
              <Button
                onClick={() =>
                  cancelCommission(selected?.commissionID, onClose)
                }
              >
                {selected?.status === "rejected" ? "Remove" : "Cancel"}
              </Button>
            )}
          </>
        )}
      </ModalContainer>
      <CompleteModal
        isOpen={showModal}
        onClose={handleModalClose}
        selected={selected}
        closeParent={onClose}
      />
      <MintModal
        isOpen={mintModal}
        onClose={handleMintModalClose}
        selected={selected}
        closeParent={onClose}
      />
    </ModalOverlay>
  )
}

export default CommissionViewModal
