import { useUser } from "@dashboard/auth/useUser";
import { getUserName } from "@dashboard/misc";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

export const WelcomePageTitle = () => {
  const { user } = useUser();
  const userName = getUserName(user, true);

  return (
    <Text as="h1" size={9} data-test-id="home-header">
      <FormattedMessage
        defaultMessage="Hello Sen {userName}, welcome to your Store Dashboard"
        id="YqeEFT"
        values={{
          userName,
        }}
      />
    </Text>
  );
};
