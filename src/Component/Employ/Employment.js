import React from "react";
import { Outlet } from "react-router-dom";

function Employment() {
  return (
    <>
      <div className="container mx-auto">
        <Outlet />
      </div>
    </>
  );
}

export default Employment;
