import "../styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import favicon from "public/favicon.ico"
import Layout from "@components/common/Layout"
import AuthProvider from "@components/auth/AuthProvider"

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <AuthProvider>
        <Layout>
          <Head>
            <title>ArtFlowz</title>
            <meta name="description" content="ArtFlowz" />
            <link rel="icon" href={favicon.src} />
          </Head>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
  )
}
export default MyApp