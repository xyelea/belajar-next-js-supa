import { supabase } from "@/utils/supabase";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const LogOut = () => {
  const router = useRouter();
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      router.push("/");
    };
    logout();
  }, [router]);
  return <div>LogOut</div>;
};

export default LogOut;
