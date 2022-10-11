import App from "./components/App";
import "./index.css";
import { SessionProvider } from "@inrupt/solid-ui-react";
import { createRoot } from "react-dom/client";

const rootMountPoint: HTMLElement = document.getElementById(
  "root"
) as HTMLElement;

createRoot(rootMountPoint).render(
  <SessionProvider>
    {" "}
    <App />{" "}
  </SessionProvider>
);
