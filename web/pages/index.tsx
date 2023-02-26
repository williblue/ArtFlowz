import Hero from '@components/ui/Hero'
import Head from 'next/head'


export default function Home() {
  return (
    <>
      <Head>
        <title>ArtFlowz</title>
        <meta name="description" content="ArtFlowz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Hero/>
      </main>
    </>
  )
}
