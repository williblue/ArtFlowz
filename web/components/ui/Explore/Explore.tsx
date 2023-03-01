import { useUser } from "@components/user/UserProvider"
import { FC, useState } from "react"
import styled from "styled-components"
import CreateCommissionModal from "../CreateCommissionModal"

const Container = styled.div`
  margin: 0 auto;
  min-height: min-content;
  max-height: max-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0rem 0rem;
  @media (max-width: 1010px) {
    flex-direction: column;
    height: min-content;
  }
  font-family: "Sinhala MN", Arial, sans-serif;
  background: linear-gradient(
    to bottom,
    #ffffff,
    #d8cbed
  ); /* Sets the linear gradient background color */
  height: 100vh;
`

const CreatorCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  margin: 16px;
  cursor: pointer;
`

const CreatorImage = styled.img`
  width: 100%;
  max-width: 150px;
  height: auto;
  margin-bottom: 16px;
  border-radius: 50%;
`

const CreatorName = styled.h2`
  font-size: 24px;
  margin: 0;
  margin-bottom: 8px;
`

const CreatorUsername = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
  margin-bottom: 16px;
`

const CreatorBio = styled.p`
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
`

const CreatorList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const Title = styled.h2`
  font-size: 3rem;
  font-weight: normal;
  margin-bottom: 40px;
  margin-top: 60px;
`

const Explore: FC = () => {
  const { allProfiles } = useUser()
  const [selectedCreator, setSelectedCreator] = useState<any>()
  const [showModal, setShowModal] = useState(false)
  const [thankYouModal, setThankYouModal] = useState(false)

  const handleModalClose = () => {
    setShowModal(false)
  }

  const handleButtonClick = () => {
    setShowModal(true)
  }

  const handleThankYouModalClose = () => {
    setThankYouModal(false)
  }

  const handleThankYouModalOpen = () => {
    setThankYouModal(true)
  }
  return (
    <Container>
      <Title>Request Commissions</Title>
      <CreatorList>
        {allProfiles?.map((creator: any) => (
          <CreatorCard
            key={creator.address}
            onClick={() => {
              handleButtonClick()
              setSelectedCreator(creator)
            }}
          >
            <CreatorImage src={creator.avatar} alt={creator.name} />
            <CreatorName>{creator.name}</CreatorName>
            {creator.findName && (
              <CreatorUsername>@{creator.findName}</CreatorUsername>
            )}
            {creator.description && (
              <CreatorBio>{creator.description}</CreatorBio>
            )}
          </CreatorCard>
        ))}
      </CreatorList>
      <CreateCommissionModal
        isOpen={showModal}
        onClose={handleModalClose}
        creatorName={selectedCreator?.name}
        creatorImage={selectedCreator?.avatar}
        creatorAddress={selectedCreator?.address}
        handleThankYouModalOpen={handleThankYouModalOpen}
      />
    </Container>
  )
}

export default Explore
