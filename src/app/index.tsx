import { GlobalProviders } from "./provider";
import { AppRouter } from "./router";

export const App = () => {
  return (
    <GlobalProviders>
      <AppRouter />
    </GlobalProviders>
  );
};
