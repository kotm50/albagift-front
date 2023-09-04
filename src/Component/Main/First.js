import React from "react";
import { Link } from "react-router-dom";

function First() {
  return (
    <div className="bg-gray-100 w-full py-4 px-2 font-neo text-lg xl:text-2xl">
      <Link to="/giftinfo">
        <div className="xl:container mx-auto flex flex-row justify-around">
          <div className="flex flex-col justify-center">
            <div>
              처음오셨나요? <br className="xl:hidden" />
              <span className="text-green-500 text-2xl font-neoextra">
                이용방법안내
              </span>
            </div>
          </div>
          <div></div>
          <div className="flex flex-col justify-center text-4xl p-2 bg-gradient-to-bl  rounded-full">
            🔍
          </div>
        </div>
      </Link>
    </div>
  );
}

export default First;
