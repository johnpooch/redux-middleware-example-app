import { createBrowserHistory } from "history";
import { combineReducers } from "redux";

import auth from "./auth";
import feedback from "./feedback";
import { authService } from "./service";
import { createReduxHistoryContext } from "redux-first-history";

export const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory(),
  });

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default combineReducers({
  router: routerReducer,
  [authService.reducerPath]: authService.reducer,
  auth,
  feedback,
});
