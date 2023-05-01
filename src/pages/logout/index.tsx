import React, { useEffect } from "react";
import { useUser } from "@/context/user";

const LogOut = () => {
  const { logout } = useUser();

  useEffect(() => {
    logout();
  }, []);
  return (
    <div>
      <p>Sampai Jumpa Lagi Masbro!</p>
    </div>
  );
};

export default LogOut;
