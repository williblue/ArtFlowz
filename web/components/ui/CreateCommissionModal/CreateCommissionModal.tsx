import { FC, useEffect, useState } from "react"
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
import { create } from "ipfs-http-client"
import { useUser } from "@components/user/UserProvider"
import { toast } from "react-toastify"
import {
  query,
  send,
  transaction,
  args,
  arg,
  payer,
  proposer,
  authorizations,
  limit,
  authz,
  decode,
  tx,
} from "@onflow/fcl"
import * as t from "@onflow/types"
import { toastStatus } from "../../../framework/toastStatus"

type Props = {
  isOpen: boolean
  onClose: () => void
  creatorName: string
  creatorImage: string
  creatorAddress: string
  handleThankYouModalOpen: () => void
}

const CreateCommissionModal: FC<Props> = ({
  isOpen,
  onClose,
  creatorName,
  creatorImage,
  creatorAddress,
  handleThankYouModalOpen,
}) => {
  const [genre, setGenre] = useState("")
  const [offerAmount, setOfferAmount] = useState("")
  const [nsfw, setNsfw] = useState(false)
  const [notes, setNotes] = useState("")
  const [link, setLink] = useState("")
  const [agree, setAgree] = useState(false)
  const [genreFile, setGenreFile] = useState<File | undefined>(undefined)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)
  const [cid, setCid] = useState("")
  const [fileUrl, updateFileUrl] = useState<any>()

  const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
  const projectSecret = process.env.NEXT_PUBLIC_INFURA_API_SECRET
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64")
  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    apiPath: "/api/v0",
    headers: {
      authorization: auth,
    },
  })

  useEffect(() => {
    console.log("cid changed: ", cid)
  }, [cid])

  const { createCommission } = useUser()

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
    createCommission(
      creatorAddress,
      offerAmount,
      genre,
      nsfw,
      notes,
      link,
      cid,
      handleThankYouModalOpen,
    )
  }

  const handleFileDrop = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    readFile(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    // const { cid } = await ipfs.add(file)
    try {
      const added = await client.add(file)
      const url = `https://artflowz.infura-ipfs.io/ipfs/${added.path}`
      updateFileUrl(url)
      console.log(url)
      // set the cid
      setCid(added.path)
      readFile(file)
    } catch (error) {
      console.log("Error uploading file: ", error)
    }
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
              <Label htmlFor="offer-amount">Offer amount (USDC):</Label>
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
              {/* {previewUrl && (
                <img
                  width={50}
                  height={"auto"}
                  src={previewUrl}
                  alt="Preview"
                />
              )} */}
              {fileUrl && <img src={fileUrl} width="50px" />}
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
