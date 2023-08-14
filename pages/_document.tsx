import { Html, Head, Main, NextScript } from 'next/document'
import { config } from 'dotenv'
config()
console.log(process.env.NEXT_PUBLIC_API_KEY)

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      {/* <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_API_KEY}&libraries=places`}
            async
            defer
         />     */}
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
