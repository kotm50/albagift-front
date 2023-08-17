import React from "react";
import { Link } from "react-router-dom";

function First() {
  return (
    <div className="bg-gradient-to-tl from-gray-900 to-gray-600 w-full py-4 px-2 text-white font-neo text-lg xl:text-3xl">
      <Link to="/giftinfo">
        <div className="xl:w-5/6 mx-auto flex flex-row justify-between">
          <div className="flex flex-col justify-center">
            <div>
              처음오셨나요? <br className="xl:hidden" />
              <span className="text-yellow-300 text-2xl xl:text-3xl font-neoextra">
                이용방법안내
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center text-4xl p-2 bg-gradient-to-bl from-rose-100 to-teal-100 rounded-full">
            🔍
          </div>
        </div>
      </Link>
    </div>
  );
}

export default First;
