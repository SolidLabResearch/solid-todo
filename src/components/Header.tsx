import {
  LogoutButton,
  Text,
} from "@inrupt/solid-ui-react";

const Header = () => {
  return (
    <div>
      <div className="flex flex-row">
        <p className="mr-4">You are logged in as:</p>
        <Text
          properties={[
            "http://www.w3.org/2006/vcard/ns#fn",
            "http://xmlns.com/foaf/0.1/name",
          ]}
        />
      </div>

      <LogoutButton
        onError={function noRefCheck() {}}
        onLogout={function noRefCheck() {}}
      />
    </div>
  );
};

export default Header
