import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import UserProvider from "@/context/user";
import Nav from "@/components/nav";
import { Database } from "@/types/supabase";

export default function App({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) {
  const [supabase] = useState(() => createBrowserSupabaseClient<Database>());

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}>
      <UserProvider>
        <main>
          <Nav />
          <Component {...pageProps} />
        </main>
      </UserProvider>
    </SessionContextProvider>
  );
}
