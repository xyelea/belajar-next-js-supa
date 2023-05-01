import "@/styles/globals.css";
import type { AppProps } from "next/app";
import UserProvider from "@/context/user";
import Nav from "@/components/nav";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Nav />
      <Component {...pageProps} />
    </UserProvider>
  );
}
