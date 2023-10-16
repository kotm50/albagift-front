import React from "react";

import sorry from "../../Asset/sorry.png";

function Sorry() {
  return (
    <div className="container mx-auto flex flex-col justify-center p-4 gap-y-3">
      <img src={sorry} alt="죄송합니다" className="w-40 max-w-full mx-auto" />
      <div className="text-center">오류가 발생했습니다. 죄송합니다</div>
    </div>
  );
}

export default Sorry;
