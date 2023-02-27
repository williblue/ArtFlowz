import { FC } from "react"
import Link from "next/link"
import styled from "styled-components"
import logo from "/public/ArtFlowz_logo.png"
import { useAuth } from "@components/auth/AuthProvider"

interface Props {
  profilePicture?: string
}

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-bottom: solid 1px grey;
`

const NavLogo = styled.div`
  cursor: pointer;
`

const LogoImage = styled.img`
  height: 50px;
`

const NavLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const NavLink = styled.a`
  margin: 0 1rem;
  color: #444;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #222;
  }
`

const CtaButton = styled.a`
  padding: 0.5rem 1rem;
  border-radius: 5px;
  background-color: #222;
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`

const ProfilePicture = styled.img`
  height: 50px;
  border-radius: 50%;
`

const Navbar: FC<Props> = ({ profilePicture }) => {
  const { loggedIn, user, logIn, logOut } = useAuth()
  return (
    <Nav>
      <NavLogo>
        <Link href="/">
          <LogoImage src={logo.src} alt="Logo" />
        </Link>
      </NavLogo>
      <NavLinks>
        <NavLink href="/explore">Explore</NavLink>
        <NavLink href="/categories">Categories</NavLink>
        <Link href="/become-a-creator">
          <CtaButton>Become a Creator</CtaButton>
        </Link>
        {loggedIn ? (
          <ProfilePicture src={profilePicture} alt="Profile Picture" />
        ) : (
          <NavLink onClick={() => logIn()}>Sign In</NavLink>
        )}
      </NavLinks>
    </Nav>
  )
}

export default Navbar
