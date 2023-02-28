import { useUser } from "@components/user/UserProvider"
import { FC } from "react"
import styled from "styled-components"

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

const CommissionViewModal: FC<Props> = ({
  isOpen,
  onClose,
  selected,
  asCreator,
}) => {
  const { cancelCommission, acceptCommission, rejectCommission } = useUser()

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
            <CommissionValue>{selected?.nsfw ? "Yes" : "No"}</CommissionValue>
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
              <CompleteButton>Complete</CompleteButton>
            )}
          </>
        ) : (
          <Button
            onClick={() => cancelCommission(selected?.commissionID, onClose)}
          >
            {selected?.status === "rejected" ? "Remove" : "Cancel"}
          </Button>
        )}
      </ModalContainer>
    </ModalOverlay>
  )
}

export default CommissionViewModal
