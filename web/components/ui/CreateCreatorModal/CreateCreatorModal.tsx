import { FC, useState } from "react"
import {
  ModalOverlay,
  ModalContainer,
  CloseButton,
  Title,
  CreatorImg,
  SubmitButton,
  UploadWrapper,
  Input,
  Label,
} from "./styles"
import defaultImg from "/public/default_image.png"
import { create } from "ipfs-http-client"
import { useUser } from "@components/user/UserProvider"

type Props = {
  isOpen: boolean
  onClose: () => void
  creatorName: string
  creatorImage: string
}

const CreateCreatorModal: FC<Props> = ({
  isOpen,
  onClose,
  creatorName,
  creatorImage,
}) => {
  const [name, setName] = useState("")
  const [genreFile, setGenreFile] = useState<File | undefined>(undefined)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)
  const [cid, setCid] = useState("")
  const [fileUrl, updateFileUrl] = useState<any>(defaultImg.src)

  const { createCreator } = useUser()

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

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
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
        <Title>Setup a creator account</Title>
        <p>
          {fileUrl ? (
            <CreatorImg src={fileUrl} alt="creator profile image" />
          ) : (
            <CreatorImg src={defaultImg.src} alt={"default image"} />
          )}
        </p>
        {/* <p>
          <Label>Change image</Label>{" "}
        </p> */}
        <UploadWrapper>
          <input
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            type="file"
            id="genre-file"
            name="genre-file"
            accept="image/*, video/*"
            onChange={handleFileChange}
          />
        </UploadWrapper>
        <p>
          <Label htmlFor="name">Username</Label>
        </p>
        <p>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </p>
        {fileUrl ? (
          <SubmitButton
            onClick={() => {
              createCreator(name, fileUrl)
              onClose()
            }}
          >
            Confirm
          </SubmitButton>
        ) : (
          <SubmitButton
            onClick={() => {
              createCreator(
                name,
                "https://raw.githubusercontent.com/williblue/ArtFlowz/main/web/public/default_image.png",
              )
              onClose()
            }}
          >
            Confirm
          </SubmitButton>
        )}
      </ModalContainer>
    </ModalOverlay>
  )
}

export default CreateCreatorModal
