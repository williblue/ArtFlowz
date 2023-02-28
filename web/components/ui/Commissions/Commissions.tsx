import { useAuth } from "@components/auth/AuthProvider"
import React, { FC } from "react"
import styled from "styled-components"

const Container = styled.div`
  margin: 0 auto;
  padding: 100px 0;
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
  width: 80%;
`

const TitleWrapper = styled.div`
  width: 100%;
`

const Title = styled.h2`
  font-size: 3rem;
  font-weight: normal;
  margin-bottom: 20px;
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

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  max-width: 1000px;
`

const TableHead = styled.thead`
  background-color: #7539d4;
  color: white;
`

const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;
`

const TableCell = styled.td`
  padding: 10px;
  text-align: center;
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

  const data = [
    {
      requestId: "12345",
      offerAmount: "1000",
      creator: "John Doe",
      genre: "Artwork",
      status: "Accepted",
    },
    {
      requestId: "67890",
      offerAmount: "500",
      creator: "Jane Doe",
      genre: "Artwork",
      status: "Pending",
    },
  ]
  return (
    <Container>
      {loggedIn ? (
        <Wrapper>
          <TitleWrapper>
            <Title>Commissions</Title>
          </TitleWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request ID</TableCell>
                <TableCell>Offer Amount (USDC)</TableCell>
                <TableCell>Creator</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {data.map((item) => (
                <TableRow key={item.requestId}>
                  <TableCell>{item.requestId}</TableCell>
                  <TableCell>{item.offerAmount}</TableCell>
                  <TableCell>{item.creator}</TableCell>
                  <TableCell>{item.genre}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <Button>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Wrapper>
      ) : (
        <Button onClick={() => logIn()}>Connect Wallet</Button>
      )}

      <HeroText>Art made personal.</HeroText>
    </Container>
  )
}

export default Hero
