import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../components/UserContext";
// import type { Metadata } from "next";

// const APP_NAME = "BusBuddy";
// const APP_DEFAULT_TITLE = "BusBuddy: Viajar sin limites";
// const APP_TITLE_TEMPLATE = "%s - PWA App";
// const APP_DESCRIPTION = "BusBuddy: Viajar sin limites";

// export const metadata: Metadata = {
//   applicationName: APP_NAME,
//   title: {
//     default: APP_DEFAULT_TITLE,
//     template: APP_TITLE_TEMPLATE,
//   },
//   description: APP_DESCRIPTION,
//   manifest: "/manifest.json",
//   themeColor: "#FFFFFF",
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: "default",
//     title: APP_DEFAULT_TITLE,
//     // startUpImage: [],
//   },
//   formatDetection: {
//     telephone: false,
//   },
//   openGraph: {
//     type: "website",
//     siteName: APP_NAME,
//     title: {
//       default: APP_DEFAULT_TITLE,
//       template: APP_TITLE_TEMPLATE,
//     },
//     description: APP_DESCRIPTION,
//   },
//   twitter: {
//     card: "summary",
//     title: {
//       default: APP_DEFAULT_TITLE,
//       template: APP_TITLE_TEMPLATE,
//     },
//     description: APP_DESCRIPTION,
//   },
// };
export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />;
    </UserProvider>
  );
}
