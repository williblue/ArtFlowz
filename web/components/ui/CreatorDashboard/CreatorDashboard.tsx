import { FC } from "react"
import styled from "styled-components"
import BannerImg from "/public/dashboardbanner.png"

const ProfileCardContainer = styled.div`
  background: #fff;
  color: #00000;
  border-radius: 15px;
  padding: 35px 0px 0px;
  margin-top: -30%;
  filter: drop-shadow(0 1px 10px #383232);
  @media (max-width: 1024px) {
    margin-top: 0;
    padding-top: 50px;
  }
`

const CardImage = styled.img`
  width: 180px;
  cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC)
      14 0,
    pointer !important;
  border-radius: 10px;
  /* border: solid 2px #e4be23;
  background: #e4be23; */
`

const BannerImage = styled.div`
  background-image: url(${BannerImg.src});
  width: 100%;
  height: 200px;
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

const CreatorDashboard: FC = () => {
  return (
    <Container>
      <BannerImage />

      <div>
        <ProfileCardContainer>Profile card</ProfileCardContainer>
        <div>.find name</div>
        <div>account name</div>
        <div>sales amount</div>
        <div>USDC</div>
        <div>Dashboars</div>
        <div>Requests</div>
      </div>

      <div>Dashboard</div>
      <div>Avaliable button</div>

      <div>
        <div>Total reactions</div>
        <div>Views</div>
        <div>Likes</div>
        <div>Bookmarks</div>
      </div>

      <div>
        <div>Float Milestones</div>
      </div>
      <div>New Reqeusts</div>
      <GridContainer>
        <div>Date</div>
        <div>Time</div>
        <div>Request ID</div>
        <div>Offer Amount (UDSC)</div>
        <div>Commissioner</div>
        <div>Email</div>
        <div>Status</div>
        <div></div>
        <div>26/02/2023</div>
        <div>10:20</div>
        <div>1069</div>
        <div>100.00</div>
        <div>@Anonymous</div>
        <div>anonymous@gmail.com</div>
        <div>awaiting</div>
        <div>button view</div>
      </GridContainer>
    </Container>
  )
}

export default CreatorDashboard
