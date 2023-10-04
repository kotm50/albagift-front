import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import dayjs from "dayjs";

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
import PointList from "./Component/Admin/PointList";
import Certification from "./Component/User/Certification";
import PopupTest from "./Component/PopupTest";
import Cert from "./Component/User/Cert";
import FindPwd from "./Component/User/FindPwd";
import Transfer from "./Component/Admin/Transfer";

function App() {
  const thisLocation = useLocation();
  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
    // eslint-disable-next-line
  }, [thisLocation]);
  const now = dayjs().format("YYYY년MM월DD일");
  return (
    <>
      <Helmet>
        <title>알바선물 | 면접보고 선물받자! {now}</title>
      </Helmet>
      <Header />
      <div
        id="content"
        className={`w-full font-pretendard dark:text-white pb-3`}
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
          <Route path="/findpwd" element={<FindPwd />} />
          <Route path="/join/:promo?" element={<Join />} />
          <Route path="/mypage/:checked?" element={<Mypage />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/newpwd" element={<NewPwd />} />
          <Route path="/admin" element={<Admin />}>
            <Route path="" element={<AdminMain />} />
            <Route path="user" element={<UserList />} />
            <Route path="reset" element={<GiftReset />} />
            <Route path="loginlog" element={<LoginLog />} />
            <Route path="pointlist" element={<PointList />} />
            <Route path="transfer" element={<Transfer />} />
          </Route>
          <Route path="/test" element={<KakaoTest />} />
          <Route path="/popup" element={<PopupTest />} />
          <Route path="/board" element={<Board />}>
            <Route path="list/:id?" element={<BoardList />} />
            <Route path="write/:pid?" element={<BoardWrite />} />
            <Route path="detail/:pid?" element={<BoardDetail />} />
          </Route>
          <Route path="/certification" element={<Certification />} />
          <Route path="/cert" element={<Cert />} />
        </Routes>
      </div>
      <Footer />
      <ToTop />
    </>
  );
}

export default App;
