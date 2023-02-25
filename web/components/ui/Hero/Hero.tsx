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
  padding: 2rem 1rem;
  @media (max-width: 1010px) {
    flex-direction: column;
    height: min-content;
  }
`

const Text = styled.div`
  color: red;
`

const ButtonContainer = styled.div`
  display: flex;
`

const Hero: FC = () => {
  return (
    <Container>
      <div>
        <div>image</div>
      </div>
      <div>
        <div></div>
        <div></div>
        <ButtonContainer>
          <div>button view</div>
          <div>button request</div>
        </ButtonContainer>
      </div>
    </Container>
  )
}
export default Hero
