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

const CompleteModal: FC<Props> = ({
  isOpen,
  onClose,
  selected,
  closeParent,
}) => {
  const [genreFile, setGenreFile] = useState<File | undefined>(undefined)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)
  const [cid, setCid] = useState("")
  const [fileUrl, updateFileUrl] = useState<any>()

  const { completeCommission } = useUser()

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
        <Wrapper>
          {fileUrl ? (
            <CommissionImage src={fileUrl} alt="Commissioned artwork" />
          ) : (
            <CommissionImage src={placeholder.src} alt="no image placeholder" />
          )}
          <CommissionInfo>
            <CommissionLabel>ID:</CommissionLabel>
            <CommissionValue>{selected?.commissionID}</CommissionValue>
            <CommissionLabel>You receive:</CommissionLabel>
            <CommissionValue>
              ${(parseFloat(selected?.commissionAmount) * 0.975).toFixed(2)}
            </CommissionValue>
            <CommissionLabel>Commissioner</CommissionLabel>
            <CommissionValue>{selected?.commissionerAddress}</CommissionValue>
          </CommissionInfo>
        </Wrapper>
        <UploadWrapper>
          <CommissionLabel>Upload:</CommissionLabel>{" "}
          <UploadFile
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            type="file"
            id="genre-file"
            name="genre-file"
            accept="image/*, video/*"
            onChange={handleFileChange}
          />
        </UploadWrapper>
        <Button
          onClick={() =>
            completeCommission(
              selected?.commissionerAddress,
              selected?.commissionID,
              cid,
              onClose,
              closeParent,
            )
          }
          disabled={!cid}
        >
          Submit
        </Button>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default CompleteModal
