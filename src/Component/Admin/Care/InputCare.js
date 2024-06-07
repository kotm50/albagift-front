import React, { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";

import InputCompanyList from "./InputCompanyList";
import axiosInstance from "../../../Api/axiosInstance";

function InputCare(props) {
  const [progCode, setProgCode] = useState("");
  const [compCode, setCompCode] = useState("");
  const [compName, setCompName] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [heavenLogo, setHeavenLogo] = useState("");
  const [monLogo, setMonLogo] = useState("");
  const [adStartDate, setCareStartDate] = useState("");
  const [adEndDate, setCareEndDate] = useState("");
  const [heavenLocalDay, setHeavenLocalDay] = useState("");
  const [heavenJumpDay, setHeavenJumpDay] = useState("");
  const [monLocalDay, setMonLocalDay] = useState("");
  const [monJumpDay, setMonJumpDay] = useState("");
  const [heavenLocalAccCount, setHeavenLocalAccCount] = useState("");
  const [heavenJumpAccCount, setHeavenJumpAccCount] = useState("");
  const [monLocalAccCount, setMonLocalAccCount] = useState("");
  const [monJumpAccCount, setMonJumpAccCount] = useState("");
  const [registeredStatus, setRegisteredStatus] = useState("N");
  const [careService, setCareService] = useState("N");
  const [dualType, setDualType] = useState("");
  const [intvPay, setIntvPay] = useState("");
  const [bigo, setBigo] = useState("");

  const [searchComp, setSearchComp] = useState(false);

  const [commList, setCommList] = useState([]);

  const [partnerId, setPartnerId] = useState("");

  useEffect(() => {
    resetIt();
    getInfo(props.adInfo);
    //eslint-disable-next-line
  }, [props.adInfo]);

  const resetIt = () => {
    setProgCode("");
    setPartnerId("");
    setCompCode("");
    setCompName("");
    setPaymentOption("");
    setHeavenLogo("");
    setMonLogo("");
    setCareStartDate("");
    setCareEndDate("");
    setHeavenLocalDay("");
    setHeavenJumpDay("");
    setMonLocalDay("");
    setMonJumpDay("");
    setHeavenLocalAccCount("");
    setHeavenJumpAccCount("");
    setMonLocalAccCount("");
    setMonJumpAccCount("");
    setRegisteredStatus("");
    setCareService("");
    setDualType("");
    setIntvPay("");
    setBigo("");
  };

  const getInfo = async info => {
    const doc = info;
    await getCommList("DU", "Y");
    if (doc) {
      setProgCode(doc.progCode || "");
      setPartnerId(doc.userId || "");
      setCompCode(doc.compCode || "");
      setCompName(doc.compName ? `${doc.compName} ${doc.compBranch}` : "");
      setPaymentOption(doc.paymentOption || "");
      setHeavenLogo(doc.heavenLogo || "");
      setMonLogo(doc.monLogo || "");
      setCareStartDate(doc.adStartDate || "");
      setCareEndDate(doc.adEndDate || "");
      setHeavenLocalDay(doc.heavenLocalDay || "");
      setHeavenJumpDay(doc.heavenJumpDay || "");
      setMonLocalDay(doc.monLocalDay || "");
      setMonJumpDay(doc.monJumpDay || "");
      setHeavenLocalAccCount(doc.heavenLocalAccCount || "");
      setHeavenJumpAccCount(doc.heavenJumpAccCount || "");
      setMonLocalAccCount(doc.monLocalAccCount || "");
      setMonJumpAccCount(doc.monJumpAccCount || "");
      setRegisteredStatus(doc.registeredStatus || "N");
      setCareService(doc.careService || "미이용");
      setDualType(doc.dualType || "기본");
      setIntvPay(doc.intvPay || "");
      setBigo(doc.bigo || "");
    }
  };

  const submit = async () => {
    const data = {
      compCode: compCode,
      paymentOption: paymentOption,
      heavenLogo: heavenLogo,
      monLogo: monLogo,
      adStartDate: adStartDate,
      adEndDate: adEndDate,
      heavenLocalDay: heavenLocalDay,
      heavenJumpDay: heavenJumpDay,
      monLocalDay: monLocalDay,
      monJumpDay: monJumpDay,
      heavenLocalAccCount: heavenLocalAccCount,
      heavenJumpAccCount: heavenJumpAccCount,
      monLocalAccCount: monLocalAccCount,
      monJumpAccCount: monJumpAccCount,
      registeredStatus: registeredStatus || "N",
      careService: careService || "미이용",
      dualType: dualType || "기본",
      intvPay: intvPay,
      bigo: bigo,
      userId: partnerId,
    };

    await axiosInstance
      .post("/api/v1/ad/add/prog", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        console.log(res);
        if (res.data.code === "C000") {
          props.setModalOn(false);
          props.setCareInfo(null);
          props.getList(props.page, props.keyword);
        } else {
          return alert(res.data.massege);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const modify = async () => {
    const data = {
      progCode: progCode,
      compCode: compCode,
      paymentOption: paymentOption,
      heavenLogo: heavenLogo,
      monLogo: monLogo,
      adStartDate: adStartDate,
      adEndDate: adEndDate,
      heavenLocalDay: heavenLocalDay,
      heavenJumpDay: heavenJumpDay,
      monLocalDay: monLocalDay,
      monJumpDay: monJumpDay,
      heavenLocalAccCount: heavenLocalAccCount,
      heavenJumpAccCount: heavenJumpAccCount,
      monLocalAccCount: monLocalAccCount,
      monJumpAccCount: monJumpAccCount,
      registeredStatus: registeredStatus || "N",
      careService: careService || "미이용",
      dualType: dualType || "기본",
      intvPay: intvPay,
      bigo: bigo,
      userId: partnerId,
    };
    await axiosInstance
      .patch("/api/v1/ad/upt/prog", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        if (res.data.code === "C000") {
          props.setModalOn(false);
          props.setCareInfo(null);
          props.getList(props.page, props.keyword);
        } else {
          return alert(res.data.massege);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getCommList = async (c, u) => {
    let data = {
      useYn: u,
    };
    if (c !== "") {
      data.category = c;
    }
    await axiosInstance
      .post("/api/v1/comp/get/comlist", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        setCommList(res.data.commList || []);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteProg = async code => {
    const really = window.confirm("삭제하면 복구할 수 없습니다\n진행할까요?");
    if (!really) {
      return false;
    }
    const data = {
      progCode: code,
    };
    await axiosInstance
      .delete("/api/v1/ad/del/prog", {
        data: data,
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        if (res.data.code === "C000") {
          alert(res.data.message);
          props.setModalOn(false);
          props.setCareInfo(null);
          props.getList(props.page, props.keyword);
        } else {
          return alert(res.data.massege);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit min-w-[480px] h-auto p-4 bg-white rounded-lg z-10 ">
        <div className="flex justify-between mb-3">
          <h4 className="text-xl font-neoextra">
            {props.adInfo ? "광고 수정" : "광고 등록"}
          </h4>
          <button
            className="w-fit h-fit text-xl"
            onClick={() => {
              props.setModalOn(false);
              props.setCareInfo(null);
            }}
          >
            <MdOutlineClose />
          </button>
        </div>
        <div className="flex flex-row justify-start gap-x-2">
          <div className="flex flex-col justify-start gap-y-2">
            <div className="flex justify-start gap-x-2">
              <label
                htmlFor="compCode"
                className="p-2 text-nowrap text-right w-[10%] min-w-[100px]"
              >
                고객사
              </label>
              {compName === "" ? (
                <button
                  className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                  onClick={() => setSearchComp(!searchComp)}
                >
                  고객사 찾기
                </button>
              ) : (
                <input
                  id="compCode"
                  type="text"
                  className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                  value={compName}
                  placeholder="클릭하여 고객사를 검색하세요"
                  onFocus={() => setSearchComp(true)}
                  readOnly
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="adStartDate"
                  className="p-2 text-nowrap text-right w-[10%] min-w-[100px]"
                >
                  시작일
                </label>
                <input
                  id="adStartDate"
                  type="date"
                  className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                  value={adStartDate}
                  placeholder="광고 시작일을 입력하세요"
                  onChange={e => setCareStartDate(e.currentTarget.value)}
                />
              </div>
              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="adEndDate"
                  className="p-2 text-nowrap text-right w-[10%] min-w-[100px]"
                >
                  종료일
                </label>
                <input
                  id="adEndDate"
                  type="date"
                  className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                  value={adEndDate}
                  placeholder="광고 종료일을 입력하세요"
                  onChange={e => setCareEndDate(e.currentTarget.value)}
                />
              </div>
              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="registeredStatus"
                  className="p-2 text-nowrap text-right w-[10%] min-w-[100px]"
                >
                  등록여부
                </label>
                <select
                  id="registeredStatus"
                  className="p-1 border bg-white focus:border-gray-500 uppercase w-full"
                  onChange={e => setRegisteredStatus(e.currentTarget.value)}
                  value={registeredStatus}
                >
                  <option value="N">등록전</option>
                  <option value="S">등록중</option>
                  <option value="Y">등록완료</option>
                </select>
              </div>
              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="careService"
                  className="p-2 text-nowrap text-right w-[10%] min-w-[100px]"
                >
                  케어서비스
                </label>
                <select
                  id="careService"
                  className="p-1 border bg-white focus:border-gray-500 uppercase w-full"
                  onChange={e => setCareService(e.currentTarget.value)}
                  value={careService}
                >
                  <option value="">이용안함</option>
                  <option value="위촉케어">위촉케어</option>
                  <option value="면접케어">면접케어</option>
                  <option value="면접+위촉">면접+위촉</option>
                </select>
              </div>
              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="dualType"
                  className="p-2 text-nowrap text-right w-[10%] min-w-[100px]"
                >
                  광고수
                </label>
                <select
                  id="dualType"
                  className="p-1 border bg-white focus:border-gray-500 uppercase w-full"
                  onChange={e => setDualType(e.currentTarget.value)}
                  value={dualType}
                >
                  <option value="">광고갯수</option>
                  {commList && commList.length > 0 && (
                    <>
                      {commList.map((comm, idx) => (
                        <option key={idx} value={comm.useValue}>
                          {comm.useValue}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="intvPay"
                  className="p-2 text-nowrap text-right w-[10%] min-w-[100px]"
                >
                  면접비
                </label>
                <input
                  id="intvPay"
                  type="number"
                  className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                  value={intvPay}
                  placeholder="면접비"
                  onChange={e => setIntvPay(e.currentTarget.value)}
                />
              </div>
            </div>
            <div className="flex justify-start gap-x-2">
              <label
                htmlFor="bigo"
                className="p-2 text-nowrap text-right w-[10%] min-w-[100px]"
              >
                비고
              </label>
              <textarea
                id="bigo"
                className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                value={bigo}
                placeholder="비고"
                onChange={e => setBigo(e.currentTarget.value)}
              />
            </div>
            <div className="grid grid-cols-4 gap-x-2">
              <button
                className="p-2 w-full bg-green-500 hover:bg-green-700 border border-green-500 hover:border-green-700 text-white rounded my-2 col-span-3"
                onClick={() => {
                  if (props.adInfo) {
                    modify();
                  } else {
                    submit();
                  }
                }}
              >
                광고 {props.adInfo ? "수정" : "등록"}
              </button>

              <button
                className="p-2 w-full bg-white hover:bg-gray-50 text-red-500 hover:text-red-700 border border-red-500 hover:border-red-700 rounded my-2"
                onClick={() => {
                  deleteProg(progCode);
                }}
              >
                광고 삭제
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-start gap-y-2">
            {searchComp && (
              <InputCompanyList
                compCode={compCode}
                setCompCode={setCompCode}
                compName={compName}
                setCompName={setCompName}
                setSearchComp={setSearchComp}
                searchComp={searchComp}
                user={props.user}
              />
            )}
          </div>
        </div>
      </div>

      <div
        className="w-screen h-screen bg-black bg-opacity-60 fixed inset-0 z-0 overflow-hidden"
        onClick={() => {
          props.setModalOn(false);
          props.setCareInfo(null);
        }}
      />
    </>
  );
}

export default InputCare;
