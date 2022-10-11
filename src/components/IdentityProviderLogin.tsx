const IdentityProviderLogin  = (props) => {
  function handleProviderChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    props.setOidcIssuer(event.target.value);
  }

  return (
    <>
      <datalist id="providers">
        <option value="https://solidcommunity.net/" />
        <option value="https://inrupt.net/" />
      </datalist>

      <p className="col-span-3">Log in with identity provider:</p>
      <input
        className="oidc-issuer-input col-span-2"
        type="text"
        name="oidcIssuer"
        list="providers"
        value={props.oidcIssuer}
        onChange={handleProviderChange}
      />
    </>
  );
};

export default IdentityProviderLogin;
