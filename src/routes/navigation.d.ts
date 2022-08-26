import { gofinanceRoutesList } from "./routes";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends gofinanceRoutesList {}
  }
}