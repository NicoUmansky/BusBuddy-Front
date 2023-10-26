import { Html, Head, Main, NextScript } from 'next/document'
import { config } from 'dotenv'
config()
console.log(process.env.NEXT_PUBLIC_API_KEY)

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      {/* <link rel="manifest" href="/manifest.json"/>
      <link rel="apple-touch-icon" href="/icon-192x192.png"></link>
      <meta name="theme-color" content="#58B05B"/>  */}
       </Head>
       <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}