import { FC, useState } from "react"
import Footer from "@components/common/Footer"
import * as fcl from "@onflow/fcl"
import Head from "next/head"
import { useRouter } from "next/dist/client/router"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "../Navbar"

//Configure FCL
fcl
  .config()
  // .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://flow-wallet-testnet.blocto.app/authn")
  // .put("discovery.wallet.method", "HTTP/POST")
  .put("discovery.wallet.method", "IFRAME/RPC")
  .put("0xFungibleToken", "0x9a0766d93b6608b7")
  .put("0xNonFungibleToken", "0x631e88ae7f1d7c20")
  .put("0xMetadataViews", "0x631e88ae7f1d7c20")
  .put("0xFUSD", "0xe223d8a629e49c68")
  .put("0xProfile", "0x35717efbbce11c74")
  .put("0xFiatToken", "0xa983fecbed621163")
  .put("0xFlowToken", "0x7e60df042a9c0868")
  .put("0xFIND", "0x35717efbbce11c74")
  .put("0xArtFlowz", "0x69bafd732df01119")
  .put("0xArtPiece", "0x69bafd732df01119")
  .put("0xCreatorProfile", "0x69bafd732df01119")

interface Props {
  children: any
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <ToastContainer position="bottom-right" pauseOnFocusLoss={false} />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default Layout
