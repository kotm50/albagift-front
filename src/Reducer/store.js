import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import storage from "redux-persist/lib/storage"; // 로컬 스토리지용
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import userSlice from "./userSlice";
import modalSlice from "./modalSlice";

// 세션 스토리지를 위한 커스텀 storage 정의
const sessionStorage = {
  getItem: key => Promise.resolve(window.sessionStorage.getItem(key)),
  setItem: (key, item) =>
    Promise.resolve(window.sessionStorage.setItem(key, item)),
  removeItem: key => Promise.resolve(window.sessionStorage.removeItem(key)),
};

// 각 슬라이스에 대한 별도의 persistConfig 설정
const userPersistConfig = {
  key: "user",
  storage: sessionStorage, // 세션 스토리지 사용
};

const modalPersistConfig = {
  key: "modal",
  storage, // 로컬 스토리지 사용
};

// 각 슬라이스에 persistReducer 적용
const persistedUserReducer = persistReducer(userPersistConfig, userSlice);
const persistedModalReducer = persistReducer(modalPersistConfig, modalSlice);

const reducers = combineReducers({
  user: persistedUserReducer,
  modal: persistedModalReducer,
});

export const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
