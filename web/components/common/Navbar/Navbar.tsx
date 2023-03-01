import { FC, useState } from "react"
import Link from "next/link"
import styled from "styled-components"
import logo from "/public/ArtFlowz_logo.png"
import { useAuth } from "@components/auth/AuthProvider"
import CreateCreatorModal from "@components/ui/CreateCreatorModal"
import AccountCreatedModal from "@components/ui/AccountCreatedModal"
import { useUser } from "@components/user/UserProvider"

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
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`

const ProfilePicture = styled.img`
  height: 50px;
  border-radius: 50%;
`

const Navbar: FC = () => {
  const { loggedIn, user, logIn, logOut } = useAuth()
  const { allProfiles } = useUser()

  const [showModal, setShowModal] = useState(false)
  const [accountCreatedModal, setAccountCreatedModal] = useState(false)

  const handleButtonClick = () => {
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  const handleAccountCreatedButtonClick = () => {
    setAccountCreatedModal(true)
  }

  const handleAccountCreatedModalClose = () => {
    setAccountCreatedModal(false)
  }

  return (
    <Nav>
      <NavLogo>
        <Link href="/">
          <LogoImage src={logo.src} alt="Logo" />
        </Link>
      </NavLogo>
      <NavLinks>
        <NavLink href="/explore">Explore</NavLink>
        {loggedIn && <NavLink href="/commissions">My Commissions</NavLink>}
        {allProfiles?.some((profile: any) => {
          return profile.address === user?.addr
        }) && <NavLink href="/dashboard">Dashboard</NavLink>}
        {!allProfiles?.some((profile: any) => {
          return profile.address === user?.addr
        }) && (
          <CtaButton onClick={handleButtonClick}>Become a Creator</CtaButton>
        )}
        {loggedIn ? (
          // <ProfilePicture src={profilePicture} alt="Profile Picture" />
          <NavLink onClick={() => logOut()}>Sign Out</NavLink>
        ) : (
          <NavLink onClick={() => logIn()}>Sign In</NavLink>
        )}
      </NavLinks>
      <CreateCreatorModal
        isOpen={showModal}
        onClose={handleModalClose}
        creatorName={""}
        creatorImage={""}
        handleAccountCreatedButtonClick={handleAccountCreatedButtonClick}
      />
      <AccountCreatedModal
        isOpen={accountCreatedModal}
        onClose={handleAccountCreatedModalClose}
        creatorName={""}
        creatorImage={""}
      />
    </Nav>
  )
}

export default Navbar
