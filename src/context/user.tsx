import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { Database } from "@/types/supabase";

type ContextType = any;

const Context = createContext<ContextType>({});

const Provider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const session = useSession();
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log("USER - STATE", user);
  console.log("USER - SESSION", session);

  useEffect(() => {
    console.log("SESSION IN USEEFFECT", session);

    async function getUserProfile() {
      console.log("SESSION IN ASYNC", session);

      if (session) {
        setIsLoading(true);

        const { data: profile } = await supabaseClient
          .from("profile")
          .select("*")
          .eq("id", session?.user?.id)
          .single();

        console.log("user profile", profile);

        setUser({
          ...session?.user,
          ...profile,
        });

        setIsLoading(false);
      }
    }

    supabaseClient.auth.onAuthStateChange((event, session) => {
      if ("SIGNED_IN" === event && session) {
        console.log("SIGNED_IN", session);
        getUserProfile();
      } else if ("SIGNED_OUT" === event) {
        console.log("SIGNED_OUT", session);
        setUser(null);
      }
    });
  }, []);

  const login = async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: "github",
    });
  };

  const logout = async () => {
    await supabaseClient.auth.signOut();
    setUser(null);
    router.push("/");
  };
  const exposed = {
    user,
    login,
    logout,
    isLoading,
  };
  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUserContext = () => useContext(Context);

export default Provider;
