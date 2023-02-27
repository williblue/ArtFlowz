import { FC } from "react"
import {
  ModalOverlay,
  ModalContainer,
  CloseButton,
  Title,
  Label,
  Input,
  Select,
  TextArea,
  CheckBoxWrapper,
  CheckBox,
  SubmitButton,
  Row,
  Column,
  UploadFile,
  CreatorImg,
} from "./styles"

type Props = {
  isOpen: boolean
  onClose: () => void
  creatorName: string
  creatorImage: string
}

const ThankYouModal: FC<Props> = ({
  isOpen,
  onClose,
  creatorName,
  creatorImage,
}) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Thank you for submitting your request</Title>
        <p>
          <CreatorImg src={creatorImage} alt={creatorName} /> @{creatorName}
        </p>
        <p>The artist will confirm before proceeding; expect an update soon!</p>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default ThankYouModal
