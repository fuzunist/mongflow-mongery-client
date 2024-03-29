import Loader from "@/components/Loader";
import { setLogOut } from "@/store/actions/user";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
  const navigate = useNavigate();
  const [cookies, __, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);

  useEffect(() => {
    const performLogout = async () => {
      try {
        if(cookies?.access_token===undefined){
           console.log("1st lo if")
        setLogOut();
         console.log(import.meta.env.VITE_CENTRAL_URL)
        return (window.location.href = import.meta.env.VITE_CENTRAL_URL);
        }
         console.log("later lo if")
        sessionStorage.removeItem("beforePathname");
        removeCookie("access_token");
        removeCookie("refresh_token");
        setLogOut();
        return (window.location.href = import.meta.env.VITE_CENTRAL_URL);
      } catch (error) {
        console.error("Logout failed:", error);
        setLogOut();

        return (window.location.href = import.meta.env.VITE_CENTRAL_URL);

      }
    };
    performLogout();
  }, [navigate, removeCookie]);

  return <Loader className="fixed top-0 left-0 z-[9999]" />;
};

export default LogOut;
