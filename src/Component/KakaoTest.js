import React, { useState, useEffect } from "react";

function KakaoTest() {
  const [agent, setAgent] = useState("");

  useEffect(() => {
    console.log(window.navigator.userAgent);
    setAgent(window.navigator.userAgent);
  }, []);
  return <div className="container mx-auto">{agent}</div>;
}

export default KakaoTest;
