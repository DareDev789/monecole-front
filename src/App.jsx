import { LoginPage } from "./pages/LoginPage";
import { useContext, useEffect, useState } from "react";
import MainPage from "./pages/MainPage";
import LogoutComponent from "./Components/LogoutComponent";
import { useNavigate } from "react-router-dom";
import AcceptInvitation from "./Components/AcceptInvitation";
import { ShowContext } from "./Contextes/UseShow";


function App() {
  const {
    showLoginPage,
    setShowMainPage,
    showMainPage,
    setShowLoginPage,
    showLogout,
    setShowAdmin,
    setShowInvitationPage,
    setShowUser,
    showInvitationPage,
  } = useContext(ShowContext);

  // const navigate = useNavigate();
  // const [isOnline, setIsOnline] = useState(navigator.onLine);

  const tokenString = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  let token = JSON.parse(tokenString);
  let user = JSON.parse(userString);

  useEffect(() => {
    if (token) {
      setShowMainPage(true);
      setShowLoginPage(false);

      if (user?.grade !== "admin") {
        setShowAdmin(false);
        setShowUser(true);
      }else{
        setShowAdmin(true);
        setShowUser(false);
      }
    } else {
      setShowMainPage(false);
      setShowLoginPage(true);

      const queryParams = new URLSearchParams(location.search);
      const invitationToken = queryParams.get("token");

      if (invitationToken) {
        setShowInvitationPage(true);
        setShowLoginPage(false);
      } else {
        setShowInvitationPage(false);
        setShowLoginPage(true);
      }
    }
  }, []);

  return (
    <div>
      {showInvitationPage && <AcceptInvitation />}
      {showLoginPage && <LoginPage />}
      {showMainPage && <MainPage />}
      {showLogout && <LogoutComponent />}
    </div>
  );
}

export default App;
