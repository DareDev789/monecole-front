import { createContext, useState } from "react";

export const ShowContext = createContext({
  showMainPage: false,
  showLoginPage: false,
  showLogout: false,
  
  showAdmin: false,
  showInvitationPage: false,
});

export function ShowContextProvider({ children }) {
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showMainPage, setShowMainPage] = useState(false);
  
  const [showLogout, setShowLogout] = useState(false);
  
  const [showInvitationPage, setShowInvitationPage] = useState(false);

  const [showAdmin, setShowAdmin] = useState(false);
  const [showUser, setShowUser] = useState(false);

  return (
    <ShowContext.Provider
      value={{
        showLoginPage,
        showMainPage,
        showLogout,
        showUser,
        showInvitationPage,
        setShowMainPage,
        setShowLoginPage,
        setShowLogout,
        setShowAdmin,
        setShowUser,
        setShowInvitationPage,
      }}
    >
      {children}
    </ShowContext.Provider>
  );
}
