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
  .put("accessNode.api", "https://access-testnet.onflow.org")
  // .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://flow-wallet-testnet.blocto.app/authn")
  .put("discovery.wallet.method", "HTTP/POST")
  .put("0xFungibleToken", "0x9a0766d93b6608b7")
  .put("0xNonFungibleToken", "0x631e88ae7f1d7c20")
  .put("0xMetadataViews", "0x631e88ae7f1d7c20")
  .put("0xProfile", "0x35717efbbce11c74")
  .put("0xFiatToken", "0xa983fecbed621163")
  .put("0xFlowToken", "0x7e60df042a9c0868")
  .put("0xFIND", "0x35717efbbce11c74")

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
