import { useState /*useEffect*/ } from "react";
import giftbox from "../../Asset/giftbox.png";
//import { useLocation } from "react-router-dom";

function Cert() {
  //const location = useLocation();
  const [certData, setCertData] = useState({});
  //const [socialData, setSocialData] = useState("");
  /*
  useEffect(() => {
    if (location.state) {
      setSocialData({

      })
    }
    //eslint-disable-next-line
  }, []);
  */
  const doCert = () => {
    window.open(
      "/certification",
      "팝업테스트",
      "toolbar=no, width=480, height=900, directories=no, status=no, scrollorbars=no, resizable=no"
    );

    window.parentCallback = d => {
      setCertData(d);
    };
  };
  return (
    <div className="mx-auto bg-white certArea py-5">
      <h1 className="text-xl xl:text-2xl font-neoextra mb-3">
        알바선물에 오신 것을 <br className="xl:hidden" />
        환영합니다!
      </h1>
      <div className="text-sm xl:text-base font-neo mb-3">
        원활한 이용을 위해 본인인증을 진행합니다
      </div>
      <div className="absolute z-10 bottom-20 right-10 w-64 max-w-full">
        <img src={giftbox} alt="선물상자" className="w-full drop-shadow-lg" />
      </div>
      <div className="absolute z-20 w-64 xl:w-96 bottom-20 left-1/2 -translate-x-1/2">
        <button
          className="py-3 bg-black hover:bg-stone-800 text-white w-full rounded-full"
          onClick={doCert}
        >
          본인인증하고 회원가입 하기
        </button>
      </div>
      <div className="hidden">
        {certData.tokenVersionId ? "Get Token" : null}
        {certData.encData ? "Get EncData" : null}
        {certData.integrityValue ? "Get IntegrityValue" : null}
      </div>
    </div>
  );
}

export default Cert;
