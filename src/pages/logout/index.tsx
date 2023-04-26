import { supabase } from "@/utils/supabase";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const LogOut = () => {
  const router = useRouter();

  useEffect(() => {
    async function signOut() {
      await supabase.auth.signOut();
      router.push("/");
    }
    signOut();
  }, []);
  return <div>Logging Out</div>;
};

export default LogOut;
