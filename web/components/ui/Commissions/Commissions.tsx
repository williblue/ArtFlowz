import { useAuth } from "@components/auth/AuthProvider"
import { useUser } from "@components/user/UserProvider"
import React, { FC, useState } from "react"
import styled from "styled-components"
import CommissionTable from "../CommissionTable"
import CommissionViewModal from "../CommissionViewModal"

const Container = styled.div`
  margin: 0 auto;
  padding: 40px 0;
  min-height: min-content;
  max-height: max-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Sinhala MN", Arial, sans-serif;
  background: linear-gradient(
    to bottom,
    #ffffff,
    #d8cbed
  ); /* Sets the linear gradient background color */
`

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h2`
  font-size: 3rem;
  font-weight: normal;
  margin-bottom: 40px;
  margin-top: 60px;
`

const HeroText = styled.div`
  font-size: 30px;
  color: #7539d4;
  font-weight: bold;
  width: 100%;
  line-height: 0.95;
  letter-spacing: 2px;
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    font-size: 80px;
    width: 85%;
    padding-top: 200px;
  }
`

const Button = styled.button`
  background-color: #7539d4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`

const Hero: FC = () => {
  const { loggedIn, logIn } = useAuth()
  const { allCommissions } = useUser()
  const [selected, select] = useState()
  const [showModal, setShowModal] = useState(false)

  const handleModalClose = () => {
    setShowModal(false)
  }

  const handleButtonClick = () => {
    setShowModal(true)
  }

  const data = [
    {
      requestId: "12345",
      offerAmount: "1000",
      creator: "John Doe",
      genre: "Artwork",
      status: "completed",
    },
    {
      requestId: "67890",
      offerAmount: "500",
      creator: "Jane Doe",
      genre: "Artwork",
      status: "Pending",
    },
    {
      requestId: "67890",
      offerAmount: "500",
      creator: "Jane Doe",
      genre: "Artwork",
      status: "completed",
    },
  ]
  return (
    <Container>
      {loggedIn ? (
        <Wrapper>
          <Title>Ongoing Commissions</Title>
          <CommissionTable
            data={allCommissions}
            select={select}
            handleButtonClick={handleButtonClick}
          />
          <Title>Completed Commissions</Title>
          <CommissionTable
            data={allCommissions?.filter(
              (item: any) => item.status === "completed",
            )}
            select={select}
            handleButtonClick={handleButtonClick}
          />
        </Wrapper>
      ) : (
        <Button onClick={() => logIn()}>Connect Wallet</Button>
      )}
      <HeroText>Art made personal.</HeroText>
      <CommissionViewModal
        isOpen={showModal}
        onClose={handleModalClose}
        selected={selected}
      />
    </Container>
  )
}

export default Hero
