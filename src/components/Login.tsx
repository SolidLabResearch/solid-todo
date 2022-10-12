import { useEffect, useState } from "react";
import {
  LoginButton,
  LogoutButton,
  Text,
  useSession,
  CombinedDataProvider,
} from "@inrupt/solid-ui-react";
import { QueryEngine } from "@comunica/query-sparql";
import WebIdLogin from "./WebIdLogin";
import IdentityProviderLogin from "./IdentityProviderLogin";

const authOptions = {
  clientName: "Solid Todo App",
};

const Login = (props) => {
  const [oidcIssuer, setOidcIssuer] = useState("https://solidcommunity.net"); // TODO: change for release again
  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        <p className="col-span-3">You are not logged in.</p>
        <WebIdLogin oidcIssuer={oidcIssuer} setOidcIssuer={setOidcIssuer} />
        <IdentityProviderLogin
          oidcIssuer={oidcIssuer}
          setOidcIssuer={setOidcIssuer}
        />
        <LoginButton
          oidcIssuer={oidcIssuer}
          redirectUrl={window.location.href}
          authOptions={authOptions}
        />
      </div>
    </div>
  );
};

export default Login;
