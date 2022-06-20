import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";

import rootReducer from "./reducers";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
let persistor = persistStore(store);
export { store, persistor };
