import React, { useState, useEffect } from "react";

function Marketing(props) {
  const [agree, setAgree] = useState(true);

  useEffect(() => {
    if (props.setMarketingModal === true) {
      setAgree(props.agreeYn);
    }
    //eslint-disable-next-line
  }, [props.setMarketingModal]);

  const agreeConfirm = b => {
    console.log(agree);
    props.setMarketingModal(false);
    if (b === "Y") {
      props.editIt("/api/v1/user/myinfo/editagree", "agree", b);
    }
  };

  return (
    <>
      <div
        id="editArea"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 outline-none focus:outline-none shadow-lg"
      >
        <div className="xl:p-2">
          <div className="my-2 mx-auto p-2 border rounded-lg grid grid-cols-1 gap-3 bg-gray-50 w-full">
            <h2 className="my-3 text-xl font-neoextra text-center">
              광고성 정보수신 동의
            </h2>
            <div className="relative px-2 lg:px-3 flex-auto overflow-y-auto font-neo bg-gray-50">
              알바선물 신규 이벤트, 신규 콘텐츠
              <span className="hidden xl:inline">, 신규 혜택</span> 등 <br />
              다양한 정보를 제공하여 드립니다.
            </div>
            <div className="p-2 flex justify-center gap-x-2">
              <button
                className="bg-teal-500 hover:bg-teal-700 text-white py-2 px-10"
                onClick={e => agreeConfirm("Y")}
              >
                동의
              </button>
              <button
                className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white"
                onClick={e => agreeConfirm("N")}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="opacity-25 fixed inset-0 z-40 bg-black h-screen overflow-hidden"
        onClick={e => agreeConfirm("N")}
      ></div>
    </>
  );
}

export default Marketing;
