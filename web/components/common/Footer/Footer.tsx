import { FC } from "react"
import styled from "styled-components"
import Image from "next/image"
import Link from "next/link"

const Container = styled.footer`
  box-sizing: border-box;
  text-align: center;
  color: #f9f9f9;
  font-size: 26px;
`

const Wrapper = styled.div`
  position: relative;
  display: flex;
  background-color: #111;
  flex-flow: column nowrap;
  -webkit-box-align: center;
  align-items: center;
  padding: 3em 0px 4em;
`

const Footer: FC = () => {
  return (
    <Container>
      <Wrapper>
        <a href="https://www.onflow.org/" target="_blank" rel="noreferrer">
          Flow blockchain
        </a>
      </Wrapper>
    </Container>
  )
}

export default Footer
