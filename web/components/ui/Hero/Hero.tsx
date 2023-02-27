import React, { FC, useState } from "react"
import styled from "styled-components"
import HeroImg from "/public/dalleart.png"
import DalleImg from "/public/dalle.jpg"
import CreateCommissionModal from "../CreateCommissionModal"

const Container = styled.div`
  margin: 0 auto;
  min-height: min-content;
  max-height: max-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem 0rem;
  @media (max-width: 1010px) {
    flex-direction: column;
    height: min-content;
  }
  font-family: "Sinhala MN", Arial, sans-serif;
  display: grid;
  grid-template-columns: 1fr 1fr; /* Creates two columns with equal width */
  align-items: center; /* Vertically aligns the grid items */
  background: linear-gradient(
    to bottom,
    #ffffff,
    #d8cbed
  ); /* Sets the linear gradient background color */
`

const HeroImage = styled.div`
  background-image: url(${HeroImg.src}); /* Sets the image for the left column */
  background-size: cover; /* Makes the image cover the entire column */
  height: 800px; /* Sets the height of the column */
`

const HeroText = styled.div`
  font-size: 80px;
  color: #7539d4;
  font-weight: bold;
  width: 75%;
  line-height: 0.95;
  letter-spacing: 4px;
  padding-bottom: 40px;
  padding-top: 300px;
`

const ButtonContainer = styled.div`
  display: flex;
`

const ButtonUnfilled = styled.button`
  background-color: #ffffff00;
  color: #802bdc;
  border-width: 2px;
  border-color: #802bdc;
  border-radius: 4px;
  padding: 15px 50px;
  margin-right: 10px;
  cursor: pointer;
  font-family: "Sinhala MN", Arial, sans-serif;
  letter-spacing: 3px;
  font-size: 10px;
  font-weight: bold;
  margin-right: 20px;

  &:hover {
    background-color: #af73f5;
    border-color: #af73f5;
    color: #fff;
  }
`

const Button = styled.button`
  background-color: #af73f5;
  color: #fff;
  border-width: 2px;
  border-color: #af73f5;
  border-radius: 4px;
  padding: 15px 50px;
  margin-right: 10px;
  cursor: pointer;
  font-family: "Sinhala MN", Arial, sans-serif;
  letter-spacing: 3px;
  font-size: 10px;
  margin-right: 20px;

  &:hover {
    background-color: #802bdc;
    border-color: #802bdc;
    color: #fff;
  }
`

const Wrapper = styled.div`
  display: flex;
`

const GridContainerWrapper = styled.div`
  background: linear-gradient(to right, #802bdc, #bca6ff);
  border-radius: 10px;
  width: 97%;
  position: relative;
  //top: -200px;
  padding-top: 10px;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  grid-gap: 10px;
  justify-items: center;
  align-items: center;
  text-align: left;
`

const SmallWhiteText = styled.div`
  font-size: 11px;
  color: #ffffff;
`

const WhiteText = styled.div`
  font-size: 16px;
  color: #ffffff;
`

const RoundImage = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  padding-right: 8px;
`

const RightColumn = styled.div`
  padding: 0 4vw;
`

const Hero: FC = () => {
  const [showModal, setShowModal] = useState(false)

  const handleModalClose = () => {
    setShowModal(false)
  }

  const handleButtonClick = () => {
    setShowModal(true)
  }

  return (
    <Container>
      <HeroImage />
      <RightColumn>
        <Wrapper>
          <GridContainerWrapper>
            <GridContainer>
              <SmallWhiteText>Creator</SmallWhiteText>
              <SmallWhiteText>Ideal price</SmallWhiteText>
              <SmallWhiteText>Complete rate</SmallWhiteText>
              <Wrapper>
                <RoundImage
                  src={DalleImg.src}
                  alt="dalle-creator-profile-image"
                />
                <WhiteText>@dalle</WhiteText>
              </Wrapper>
              <WhiteText>100 USDC</WhiteText>
              <WhiteText>100%</WhiteText>
              <div>
                <div></div>
              </div>
            </GridContainer>
          </GridContainerWrapper>
        </Wrapper>
        <HeroText>Art made personal.</HeroText>
        <ButtonContainer>
          <ButtonUnfilled>VIEW PROFILE</ButtonUnfilled>
          <Button onClick={handleButtonClick}>NEW REQEUST</Button>
        </ButtonContainer>
      </RightColumn>
      <CreateCommissionModal
        isOpen={showModal}
        onClose={handleModalClose}
        creatorName={"dalle"}
        creatorImage={DalleImg.src}
        creatorAddress={"0x"}
      />
    </Container>
  )
}

export default Hero
