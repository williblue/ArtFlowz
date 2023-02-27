import { FC } from "react"
import styled from "styled-components"
import AnonymImg from "/public/anonym.png"

const Container = styled.div`
  margin: 0 auto;
  min-height: min-content;
  max-height: max-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0rem 0rem;
  @media (max-width: 1010px) {
    flex-direction: column;
    height: min-content;
  }
  font-family: "Sinhala MN", Arial, sans-serif;
  height: 100vh;
`
const HeaderText = styled.div`
  left: 257px;
  top: 325px;
  position: absolute;
  overflow: visible;
  width: 708px;
  white-space: nowrap;
  line-height: 185px;
  margin-top: -63.5px;
  text-align: left;
  text-weight: bold;
  font-size: 35px;
`

const Text = styled.div`
  left: 323px;
  top: 417px;
  position: absolute;
  overflow: visible;
  width: 201px;
  white-space: nowrap;
  line-height: 99px;
  margin-top: -34px;
  text-align: left;
  font-weight: normal;
  font-size: 20px;
`

const BodyText = styled.div``

const EmailText = styled.div`
  left: 264px;
  top: 465px;
  position: absolute;
  overflow: visible;
  width: 447px;
  white-space: nowrap;
  line-height: 99px;
  margin-top: -34px;
  text-align: left;
  font-size: 20px;
`

const RoundImage = styled.img`
  position: absolute;
  width: 43px;
  height: 44px;
  left: 265px;
  top: 413px;
  overflow: visible;
  border-radius: 50%;
  padding-right: 8px;
`
const Wrapper = styled.div`
  display: flex;
`

const ButtonUnfilled = styled.button`
  background-color: #ffffff00;
  color: #000000;
  border-width: 2px;
  border-color: #000000;
  border-radius: 4px;
  padding: 15px 20px;
  margin-right: 10px;
  cursor: pointer;
  font-family: "Sinhala MN", Arial, sans-serif;
  letter-spacing: 3px;
  font-size: 10px;
  font-weight: bold;
  margin-right: 20px;

  &:hover {
    background-color: #00000;
    border-color: #ebeaef;
    color: #000000;
  }
`

const Button = styled.button`
  background-color: #000000;
  color: #fff;
  border-width: 2px;
  border-color: #000000;
  border-radius: 4px;
  padding: 15px 20px;
  margin-right: 10px;
  cursor: pointer;
  font-family: "Sinhala MN", Arial, sans-serif;
  letter-spacing: 3px;
  font-size: 10px;
  margin-right: 20px;

  &:hover {
    background-color: #303030;
    border-color: #303030;
    color: #fff;
  }
`

const CreateCommission: FC = () => {
  return (
    <Container>
      <HeaderText>New commission request</HeaderText>
      <Wrapper>
        <RoundImage src={AnonymImg.src} alt="anonym-profile-image" />
        <div>
          <Text>@anonymous</Text>
          <EmailText>Email: anonymous@gmail.com</EmailText>
        </div>
      </Wrapper>

      <Wrapper>
        <ButtonUnfilled>Reject</ButtonUnfilled>
        <Button>Confirm</Button>
      </Wrapper>
    </Container>
  )
}

export default CreateCommission
