import { findOidcIssuer } from "../logic/query";

const WebIdLogin = (props) => {

const keywordToProviderMap: Map<string, string> = new Map<string, string>([
  ["solidcommunity", "https://solidcommunity.net/"],
  ["inrupt", "https://inrupt.net/"],
]);



  function validate(event: React.ChangeEvent<HTMLInputElement>): void {
    const webIdInputValue: string = event.target.value;

    console.log(webIdInputValue);

    for (const [keyword, provider] of keywordToProviderMap) {
      if (webIdInputValue.includes(keyword)) {
        props.setOidcIssuer(provider);
        break;
      }
    }

    try {
      // fetching the OIDC issuer using a SPARQL query
      const webIdURL: URL = new URL(webIdInputValue);
      findOidcIssuer(webIdURL)
        .then((issuer: URL) => props.setOidcIssuer(issuer.href))
        .catch((reason: any) => console.log(reason));
    } catch (error: any) {
      console.log(error);
    }
  }


  return (
    <>
      <p className="col-span-3">Login with webID:</p>
          <input
            className="oidc-issuer-input col-span-2"
            type="text"
            name="oidcIssuer"
            placeholder="webID"
            defaultValue={props.oidcIssuer}
            onChange={validate}
          />
    </>
  );
};

export default WebIdLogin;
