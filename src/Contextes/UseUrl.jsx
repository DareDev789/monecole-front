import { createContext, useState } from "react";

export const UrlContext = createContext({
  url: "",
});
export function UrlContextProvider({ children }) {
  const [url, setUrl] = useState("https://backecole.societe-manage.com/bg/public/api/");

  return (
    <UrlContext.Provider
      value={{
        url,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
}
