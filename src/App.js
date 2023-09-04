import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { path } from "./path/path";

import Login from "./Component/User/Login";

import Header from "./Component/Layout/Header";
import Footer from "./Component/Layout/Footer";
import ToTop from "./Component/Layout/ToTop";
import Join from "./Component/User/Join";
import KakaoTest from "./Component/KakaoTest";
import Mypage from "./Component/User/Mypage";
import Admin from "./Component/Admin/Admin";
import AdminMain from "./Component/Admin/Main";
import UserList from "./Component/Admin/UserList";
import List from "./Component/Mall/List";
import Detail from "./Component/Mall/Detail";
import Result from "./Component/Mall/Result";
import Coupon from "./Component/User/Coupon/Coupon";
import SearchResult from "./Component/Mall/SearchResult";
import GiftReset from "./Component/Admin/GiftReset";
import Main from "./Component/Main";
import NewPwd from "./Component/User/Mypage/NewPwd";
import Info from "./Component/Mall/Info";
import BoardWrite from "./Component/Board/Write";
import Board from "./Component/Board/Board";
import BoardDetail from "./Component/Board/Detail";
import BoardList from "./Component/Board/List";
import Promo from "./Component/User/Promo";
import LoginLog from "./Component/Admin/LoginLog";
import Cancel from "./Component/User/Mypage/Cancel";

function App() {
  const [bg, setBg] = useState("bg-transparent");
  const thisLocation = useLocation();
  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
    if (!path.some(chkBg)) {
      setBg("bg-white");
    } else {
      setBg("bg-transparent");
    }
    // eslint-disable-next-line
  }, [thisLocation]);
  const chkBg = (element, index, array) => {
    return thisLocation.pathname.startsWith(element);
  };
  return (
    <>
      <Helmet>
        <title>알바선물 | 면접보고 선물받자! v230726</title>
      </Helmet>
      <Header />
      <div
        id="content"
        className={`${bg} w-full font-pretendard dark:text-white pb-3`}
      >
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/promo" element={<Promo />} />
          <Route path="/giftinfo" element={<Info />} />
          <Route path="/list/:category?/:brand?" element={<List />} />
          <Route path="/detail/:goodscode?" element={<Detail />} />
          <Route path="/result" element={<Result />} />
          <Route path="/search/:keyword?" element={<SearchResult />} />
          <Route path="/coupon" element={<Coupon />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join/:promo?" element={<Join />} />
          <Route path="/mypage/:checked?" element={<Mypage />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/newpwd" element={<NewPwd />} />
          <Route path="/admin" element={<Admin />}>
            <Route path="" element={<AdminMain />} />
            <Route path="user" element={<UserList />} />
            <Route path="reset" element={<GiftReset />} />
            <Route path="loginlog" element={<LoginLog />} />
          </Route>
          <Route path="/test" element={<KakaoTest />} />
          <Route path="/board" element={<Board />}>
            <Route path="list/:id?" element={<BoardList />} />
            <Route path="write/:pid?" element={<BoardWrite />} />
            <Route path="detail/:pid?" element={<BoardDetail />} />
          </Route>
        </Routes>
      </div>
      <Footer />
      <ToTop />
    </>
  );
}

export default App;
