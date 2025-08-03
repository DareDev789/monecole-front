import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "tippy.js/dist/tippy.css";
import App from './App.jsx'
import { ShowContextProvider } from "./Contextes/UseShow.jsx";
import { UrlContextProvider } from "./Contextes/UseUrl.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UrlContextProvider>
        <ShowContextProvider>
          <App />
        </ShowContextProvider>
      </UrlContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
