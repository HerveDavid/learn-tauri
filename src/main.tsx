import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GlobalProviders } from "./global-providers";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalProviders>
      <App />
    </GlobalProviders>
  </React.StrictMode>
);
