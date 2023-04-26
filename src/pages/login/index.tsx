import { useEffect } from "react";
import { supabase } from "@/utils/supabase";

const Login = () => {
  useEffect(() => {
    async function signInWithGithub() {
      await supabase.auth.signInWithOAuth({
        provider: "github",
      });
    }
    signInWithGithub();
  }, []);

  return <p>Loggin in</p>;
};

export default Login;
