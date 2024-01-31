import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function MarketingSection() {
  const navi = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const user = useSelector(state => state.user);
  useEffect(() => {
    if (user.accessToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [user]);
  return (
    <>
      {isLogin ? (
        <div
          className="w-full lg:container mx-auto lg:rounded-lg bg-teal-500 p-10 hover:cursor-pointer mt-3"
          onClick={() => navi("/marketing")}
        ></div>
      ) : null}
    </>
  );
}

export default MarketingSection;
