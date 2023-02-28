import { FC } from "react"
import styled from "styled-components"
import BannerImg from "/public/dashboardbanner.png"
import DalleImg from "/public/dalle.jpg"

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
  background-color: rgba(250, 250, 250, 1);
  height: 100vh;
`

const ProfileCardContainer = styled.div`
  background: #fff;
  color: #00000;
  border-radius: 15px;
  overflow: visible;
  width: 480px;
  height: 700px;
  border-radius: 15px;
  filter: drop-shadow(0 1px 6px rgba(0, 0, 0, 0.161));
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  margin-top: -100px;
  margin-left: 50px;
`

const CreatorImage = styled.img`
  background-image: url(${DalleImg.src});
  width: 121px;
  height: 123px;
  border-radius: 50%;
`

const BannerImage = styled.div`
  background-image: url(${BannerImg.src});
  width: 100%;
  height: 150px;
  background-size: cover;
  background-position: center;
`

const DashboardHeaderContainer = styled.div`
  display: block;
  background: red;
  width: 100%;
`

const DashboardHeader = styled.div`
  overflow: visible;
  width: 208px;
  white-space: nowrap;
  text-align: left;
  font-size: 40px;
  color: #000000;
`

const Wrapper = styled.div`
  background-color: black;
  display: flex;
  width: 100%;
`

const CreatorDashboard: FC = () => {
  return (
    <Container>
      <BannerImage />
      <Wrapper>
        <ProfileCardContainer>
          <CreatorImage src={DalleImg.src} />
          <div>dalle.find</div>
          <div>@dalle e</div>
          <div>32,212</div>
          <div>USDC</div>
          <div>Total Sales</div>
          <div>Dashboard</div>
          <div>Requests</div>
        </ProfileCardContainer>

        <DashboardHeaderContainer>
          <DashboardHeader>Dashboard</DashboardHeader>
        </DashboardHeaderContainer>
      </Wrapper>
    </Container>
  )
}

export default CreatorDashboard
