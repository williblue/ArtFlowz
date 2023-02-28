import { FC } from "react"
import {
  ModalOverlay,
  ModalContainer,
  CloseButton,
  Title,
  ShareLink,
  Label,
} from "./styles"
import queryString from "query-string"
import { FaTwitter, FaTelegramPlane } from "react-icons/fa"
import styled from "styled-components"

type Props = {
  isOpen: boolean
  onClose: () => void
  creatorName: string
  creatorImage: string
}

const AccountCreatedModal: FC<Props> = ({
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

  const message = "I just created an account at ArtFlowz check it out!"

  // Generate Twitter share link
  const twitterShareLink = `https://twitter.com/intent/tweet?${queryString.stringify(
    {
      text: message,
      url: window.location.href,
    },
  )}`

  // Generate Telegram share link
  const telegramShareLink = `https://t.me/share/url?${queryString.stringify({
    text: message,
    url: window.location.href,
  })}`

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Your creator account has been created!</Title>
        <p>
          <ShareLink
            href={twitterShareLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter /> Share on Twitter
          </ShareLink>
          <ShareLink
            href={telegramShareLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegramPlane /> Share on Telegram
          </ShareLink>
        </p>
        <Label>Share it with your friends!</Label>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default AccountCreatedModal
