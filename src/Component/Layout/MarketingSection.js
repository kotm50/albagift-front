import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function MarketingSection() {
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
        <div className="w-full lg:container mx-auto lg:rounded-lg bg-teal-500 p-10"></div>
      ) : null}
    </>
  );
}

export default MarketingSection;
