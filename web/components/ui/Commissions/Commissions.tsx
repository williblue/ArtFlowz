import React, { FC } from "react"
import styled from "styled-components"

const Container = styled.div`
  margin: 0 auto;
  min-height: min-content;
  max-height: max-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: "Sinhala MN", Arial, sans-serif;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
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
    width: 75%;
    padding-bottom: 40px;
    padding-top: 300px;
  }
`

const Wrapper = styled.div`
  padding: 0 4vw;
`

const Hero: FC = () => {
  return (
    <Container>
      <Wrapper>
        <HeroText>Art made personal.</HeroText>
      </Wrapper>
    </Container>
  )
}

export default Hero
