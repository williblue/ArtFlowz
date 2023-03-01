import { FC, useEffect, useState } from "react"
import styled from "styled-components"
import BannerImg from "/public/dashboardbanner.png"
import DalleImg from "/public/dalle.jpg"
import CreatorsTable from "../CreatorsTable"
import { useUser } from "@components/user/UserProvider"
import CommissionViewModal from "../CommissionViewModal"
import { useAuth } from "@components/auth/AuthProvider"

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
  background: linear-gradient(
    to bottom,
    #ffffff,
    #d8cbed
  ); /* Sets the linear gradient background color */
  height: 100vh;
`

const ProfileCardContainer = styled.div`
  background: #fff;
  color: #00000;
  border-radius: 15px;
  overflow: visible;
  width: 480px;
  height: 650px;
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
  width: 100%;
  padding: 40px 100px;
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
  display: flex;
  width: 100%;
`
const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
`

const Subtitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  color: #9c9c9c;
`

const Total = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-top: 40px;
`

const TotalSales = styled(Subtitle)``

const DashboardText = styled(Subtitle)`
  margin-top: 40px;
`

const Requests = styled(Subtitle)`
  margin-top: 20px;
`

const H2 = styled.h2`
  font-size: 1.7rem;
  font-weight: normal;
  margin-bottom: 40px;
  margin-top: 60px;
`

const CreatorDashboard: FC = () => {
  const { allCommissions, allProfiles } = useUser()
  const [showModal, setShowModal] = useState(false)
  const [selected, select] = useState()
  const { user } = useAuth()
  const [creator, setCreator] = useState<any>()

  const handleModalClose = () => {
    setShowModal(false)
  }

  const handleButtonClick = () => {
    setShowModal(true)
  }

  useEffect(() => {
    setCreator(
      allProfiles?.find((profile: any) => profile.address === user?.addr),
    )
  }, [, user])

  return (
    <Container>
      <BannerImage />
      <Wrapper>
        <ProfileCardContainer>
          <CreatorImage src={creator?.avatar} />

          <Title>{creator?.name}</Title>
          {creator?.findName && <Subtitle>@{creator?.findName}</Subtitle>}
          <Total>32,212 USDC</Total>
          <TotalSales>Total Sales</TotalSales>
          <DashboardText>Dashboard</DashboardText>
          <Requests>Requests</Requests>
        </ProfileCardContainer>

        <DashboardHeaderContainer>
          <DashboardHeader>Dashboard</DashboardHeader>
          <H2>New Requests</H2>
          <CreatorsTable
            data={allCommissions?.filter((item: any) => {
              return (
                item.status === "pending" && item.creatorAddress === user?.addr
              )
            })}
            select={select}
            handleButtonClick={handleButtonClick}
          />
          {/* todo: if I have enough time I should add artwork design instead of the table */}
          {allCommissions?.filter((item: any) => {
            return (
              item.status === "accepted" && item.creatorAddress === user?.addr
            )
          }).length > 0 ? (
            <>
              <H2>Ongoing Commissions</H2>
              <CreatorsTable
                data={allCommissions?.filter((item: any) => {
                  return (
                    item.status === "accepted" &&
                    item.creatorAddress === user?.addr
                  )
                })}
                select={select}
                handleButtonClick={handleButtonClick}
              />
            </>
          ) : (
            <></>
          )}
        </DashboardHeaderContainer>
      </Wrapper>
      <CommissionViewModal
        isOpen={showModal}
        onClose={handleModalClose}
        selected={selected}
        asCreator={true}
      />
    </Container>
  )
}

export default CreatorDashboard
