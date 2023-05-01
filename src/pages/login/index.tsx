import { useEffect } from "react";
import { useUser } from "@/context/user";

const Login = () => {
  const { login } = useUser();

  useEffect(() => {
    login();
  }, []);
  return (
    <div>
      <p>sedang memuat masbro!</p>
    </div>
  );
};

export default Login;
