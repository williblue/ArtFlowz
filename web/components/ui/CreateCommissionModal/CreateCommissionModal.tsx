import { FC, useState } from "react"
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
} from "./styles"

type Props = {
  isOpen: boolean
  onClose: () => void
  creatorName: string
  creatorImage: string
}

const CreateCommissionModal: FC<Props> = ({
  isOpen,
  onClose,
  creatorName,
  creatorImage,
}) => {
  const [genre, setGenre] = useState("")
  const [offerAmount, setOfferAmount] = useState("")
  const [nsfw, setNsfw] = useState(false)
  const [notes, setNotes] = useState("")
  const [link, setLink] = useState("")
  const [agree, setAgree] = useState(false)
  const [genreFile, setGenreFile] = useState<File | undefined>(undefined)

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!agree) {
      alert("Please agree to the terms and conditions.")
      return
    }
    // Submit commission request
    onClose()
  }

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>New Commission</Title>
        <p>Specify your commission preferences</p>
        <p>
          Creator: <img src={creatorImage} alt={creatorName} /> {creatorName}
        </p>
        <form onSubmit={handleSubmit}>
          <Row>
            <Column>
              Genre:
              <Select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              >
                <option value="">Select Genre</option>
                <option value="artwork">Artwork</option>
                <option value="video">Video</option>
                <option value="pfp">Profile Picture</option>
              </Select>
              Offer amount (USD):
              <Input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                required
              />
              NSFW:
              <Select
                value={nsfw.toString()}
                onChange={(e) => setNsfw(e.target.value === "true")}
                required
              >
                <option value="">Select Option</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </Column>
            <Column>
              <label htmlFor="genre-file">File Upload</label>
              <UploadFile
                type="file"
                id="genre-file"
                name="genre-file"
                accept="image/*, video/*"
                onChange={(e) => setGenreFile(e.target.files?.[0])}
              />
            </Column>
          </Row>
          Notes:
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
          Link:
          <Input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
          <CheckBoxWrapper>
            <CheckBox
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
            />
            I agree to the terms and conditions.
          </CheckBoxWrapper>
          <SubmitButton type="submit">Submit</SubmitButton>
        </form>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default CreateCommissionModal
