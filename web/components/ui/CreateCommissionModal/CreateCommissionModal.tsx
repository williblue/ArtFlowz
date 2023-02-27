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
  CreatorImg,
} from "./styles"

type Props = {
  isOpen: boolean
  onClose: () => void
  creatorName: string
  creatorImage: string
  creatorAddress: string
}

const CreateCommissionModal: FC<Props> = ({
  isOpen,
  onClose,
  creatorName,
  creatorImage,
  creatorAddress,
}) => {
  const [genre, setGenre] = useState("")
  const [offerAmount, setOfferAmount] = useState("")
  const [nsfw, setNsfw] = useState(false)
  const [notes, setNotes] = useState("")
  const [link, setLink] = useState("")
  const [agree, setAgree] = useState(false)
  const [genreFile, setGenreFile] = useState<File | undefined>(undefined)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)

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
    //todo: add createCommission transaction
  }

  const handleFileDrop = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    readFile(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    readFile(file)
  }

  const readFile = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        const base64data = reader.result
        setGenreFile(file)
        setPreviewUrl(base64data as string)
      }
    }
  }

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>New Commission</Title>
        <p>Specify your commission preferences</p>
        <p>
          <CreatorImg src={creatorImage} alt={creatorName} /> @{creatorName}
        </p>
        <form onSubmit={handleSubmit}>
          <Row>
            <Column>
              <Label htmlFor="genre">Genre:</Label>
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
              <Label htmlFor="offer-amount">Offer amount (USD):</Label>
              <Input
                type="number"
                id="offer-amount"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                required
              />
              <Label htmlFor="nsfw">NSFW:</Label>
              <Select
                id="nsfw"
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
              <Label htmlFor="genre-file">File Upload</Label>
              <UploadFile
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                type="file"
                id="genre-file"
                name="genre-file"
                accept="image/*, video/*"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <img
                  width={50}
                  height={"auto"}
                  src={previewUrl}
                  alt="Preview"
                />
              )}
            </Column>
          </Row>
          <Label htmlFor="notes">Notes:</Label>
          <TextArea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
          <Label htmlFor="link">Link:</Label>
          <Input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
          <CheckBoxWrapper>
            <CheckBox
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
            />
            I agree to the terms and conditions.
          </CheckBoxWrapper>
          <SubmitButton type="submit">Confirm</SubmitButton>
        </form>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default CreateCommissionModal
