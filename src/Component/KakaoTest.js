import { useState } from "react";

function KakaoTest() {
  const [isAgree, setIsAgree] = useState(false);
  const formatPhoneNumber = phoneNumber => {
    return phoneNumber.slice(-4);
  };
  return (
    <div className="container mx-auto">
      <div className="flex justify-end gap-2 text-lg font-neoextra">
        <div className="flex items-center">
          <input
            id="agreeUser"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={isAgree}
            onChange={e => setIsAgree(!isAgree)}
          />
          <label
            htmlFor="agreeUser"
            className="ml-2 text-gray-900 dark:text-gray-300"
          >
            동의회원만 보기
          </label>
        </div>
      </div>
      <div className="text-center text-3xl font-neo">
        {isAgree ? "동의회원만 봅니다" : "전체회원을 봅니다"}
        <br />
        {formatPhoneNumber("010-2578-5450")} <br />
        {formatPhoneNumber("01012345678")} <br />
      </div>
    </div>
  );
}

export default KakaoTest;
