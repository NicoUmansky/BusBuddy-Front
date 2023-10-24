import { Html, Head, Main, NextScript } from 'next/document'
import { config } from 'dotenv'
config()
console.log(process.env.NEXT_PUBLIC_API_KEY)

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <link rel="manifest" href="public\manifest.json"/>
       </Head>
       <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}