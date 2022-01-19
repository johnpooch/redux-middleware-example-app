import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import middleware from "./middleware";
import reducer, { routerMiddleware, createReduxHistory } from "./reducer";
import { authService } from "./service";

export const store = configureStore({
  reducer,
  middleware: (gdm) => [
    ...gdm()
      .concat(routerMiddleware)
      .concat(authService.middleware)
      .concat(middleware),
  ],
});

export const history = createReduxHistory(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
