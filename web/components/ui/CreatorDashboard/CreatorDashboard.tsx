import { FC } from "react"
import styled from "styled-components"
import BannerImg from "/public/dashboardbanner.png"
import DalleImg from "/public/dalle.jpg"

const ProfileCardContainer = styled.div`
  background: #fff;
  color: #00000;
  border-radius: 15px;
  /*
  padding: 35px 0px 0px;
  margin-top: -30%;
  filter: drop-shadow(0 1px 10px #383232);
  @media (max-width: 1024px) {
    margin-top: 0;
    padding-top: 50px;
  }
  */

  rx="24" ry="24" x="0" y="0" width="387" height="918"
  filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.161));
  position: absolute;
  overflow: visible;
  width: 405px;
  height: 936px;
  left: 30px;
  top: 35px;
`

const CardImage = styled.img`
  position: absolute;
  width: 121px;
  height: 123px;
  left: 164px;
  top: 233px;
  overflow: visible;

  width: 50px;
  height: 50px;
  border-radius: 50%;
  padding-right: 8px;
`

const CreatorImage = styled.img`
  background-image: url(${DalleImg.src});
  position: absolute;
  width: 121px;
  height: 123px;
  left: 164px;
  top: 233px;
  overflow: visible;
`

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Content = styled.div`
  margin-top: 20px;
  text-align: center;
  line-height: 2em;
  width: 300px;
  height: 220px;
  @media (max-width: 1024px) {
    width: auto;
  }
`

const ProfileName = styled.div`
  font-size: 2em;
`
const ProfileAddress = styled.div`
  font-size: 1.5em;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  &:focus {
    color: #cead29;
  }
  &:active {
    color: #cead29;
  }
`

const BannerImage = styled.div`
  background-image: url(${BannerImg.src});
  width: 100%;
  height: 150px;
  background-size: cover;
  background-position: center;
`

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

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr); /* Creates 2 rows with equal height */
  grid-template-columns: repeat(
    8,
    1fr
  ); /* Creates 8 columns with equal width */
  grid-gap: 10px; /* Adds 10px gap between grid items */
`

const AvailableText = styled.div`
  left: 807px;
  top: 208px;
  position: absolute;
  overflow: visible;
  width: 89px;
  white-space: nowrap;
  text-align: left;
`

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem 0rem;
`
const DashboardHeaderContainer = styled.div`
  display: block;
`

const DashboardHeader = styled.div`
  left: 551px;
  top: 190px;
  position: absolute;
  overflow: visible;
  width: 208px;
  white-space: nowrap;
  text-align: left;
  font-size: 40px;
  color: #000000;
`

const TotalReactionBox = styled.div`
  filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.161));
  fill: rgba(255,255,255,1);
  position: absolute;
  overflow: visible;
  width: 553px;
  height: 334px;
  left: 551px;
  top: 408px;
  z-index: 1;
  rx="22" ry="22" x="0" y="0"

`
const TotalReactionBoxHeader = styled.div`
  left: 582px;
  top: 442px;
  position: absolute;
  overflow: visible;
  width: 163px;
  white-space: nowrap;
  text-align: left;
`

const CreatorDashboard: FC = () => {
  return (
    <Container>
      <BannerImage />
      <div>
        <ProfileCardContainer>
          <CreatorImage src={CreatorImage.src} />
          <div>.find name</div>
          <div>profile name</div>
          <div>account name</div>
          <div>sales amount</div>
          <div>USDC</div>
          <div>Dashboars</div>
          <div>Requests</div>
        </ProfileCardContainer>

        <DashboardHeaderContainer>
          <DashboardHeader>Dashboard</DashboardHeader>
          <AvailableText>Avaliable</AvailableText>
        </DashboardHeaderContainer>

        <Wrapper>
          <TotalReactionBox></TotalReactionBox>
          <TotalReactionBoxHeader>Total Reactionnnnnn</TotalReactionBoxHeader>
        </Wrapper>

        <div> div 2.4</div>
      </div>
    </Container>
  )
}

export default CreatorDashboard
