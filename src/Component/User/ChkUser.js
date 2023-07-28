import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ChkUser() {
  const location = useLocation();
  useEffect(() => {}, [location]);
  console.log("체크");
  return null;
}

export default ChkUser;
