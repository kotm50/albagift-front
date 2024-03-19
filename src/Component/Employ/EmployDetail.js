import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import AlertModal from "../Layout/AlertModal";
import { clearUser } from "../../Reducer/userSlice";
import { logoutAlert } from "../LogoutUtil";

import Loading from "../Layout/Loading";
import dompurify from "dompurify";
import ShopRecommend from "./ShopRecommend";
import dayjs from "dayjs";

import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";

import { Helmet } from "react-helmet";
import axiosInstance from "../../Api/axiosInstance";

function EmployDetail() {
  const sanitizer = dompurify.sanitize;
  const navi = useNavigate();
  const { jid } = useParams();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const thisLocation = useLocation();
  const [jobInfo, setJobInfo] = useState(null);
  const [imgList, setImgList] = useState([]);

  const [content, setContent] = useState(null); //업무상세내용
  const [qualification, setQualification] = useState(null); //지원자격
  const [welfare, setWelfare] = useState(null); //복지혜택

  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    getJob(jid);
    //eslint-disable-next-line
  }, [thisLocation]);

  const goLogin = () => {
    navi("/login");
  };

  const applyIt = async () => {
    if (
      user.accessToken === "" ||
      user.accessToken === null ||
      user.accessToken === undefined
    ) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"로그인 필요"} // 제목
              message={"로그인이 필요합니다"} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
              doIt={goLogin}
            />
          );
        },
      });
      return false;
    }
    const data = { jobCode: jid };
    await axiosInstance
      .post("/api/v1/board/add/job/apply", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999") {
          logoutAlert(
            null,
            null,
            dispatch,
            clearUser,
            navi,
            user,
            res.data.message
          );
          return false;
        }
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <AlertModal
                onClose={onClose} // 닫기
                title={"입사지원"} // 제목
                message={res.data.message} // 내용
                type={"alert"} // 타입 confirm, alert
                yes={"확인"} // 확인버튼 제목
              />
            );
          },
        });
      })
      .catch(e => {
        console.log(e);
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <AlertModal
                onClose={onClose} // 닫기
                title={"오류"} // 제목
                message={"오류가 발생했습니다. 관리자에게 문의하세요"} // 내용
                type={"alert"} // 타입 confirm, alert
                yes={"확인"} // 확인버튼 제목
              />
            );
          },
        });
      });
  };

  const getJob = async () => {
    const data = { jobCode: jid };
    await axiosInstance
      .post("/api/v1/board/get/job/detail", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999") {
          logoutAlert(
            null,
            null,
            dispatch,
            clearUser,
            navi,
            user,
            res.data.message
          );
          return false;
        }

        setJobInfo(res.data.job);
        setImgList(res.data.uploadList);
        setContent(
          res.data.job.content ? unescapeHTML(res.data.job.content) : null
        );
        setQualification(
          res.data.job.qualification
            ? unescapeHTML(res.data.job.qualification)
            : null
        );
        setWelfare(
          res.data.job.welfare ? unescapeHTML(res.data.job.welfare) : null
        );
      })
      .catch(e => {
        console.log(e);
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <AlertModal
                onClose={onClose} // 닫기
                title={"오류"} // 제목
                message={"오류가 발생했습니다. 관리자에게 문의하세요"} // 내용
                type={"alert"} // 타입 confirm, alert
                yes={"확인"} // 확인버튼 제목
              />
            );
          },
        });
        setJobInfo(null);
      });
  };
  const unescapeHTML = text => {
    return text
      .replace(/＜/g, "<")
      .replace(/＞/g, ">")
      .replace(/＝/g, "=")
      .replace(/（/g, "(")
      .replace(/）/g, ")")
      .replace(/，/g, ",")
      .replace(/＂/g, '"')
      .replace(/：/g, ":")
      .replace(/；/g, ";")
      .replace(/／/g, "/");
  };

  const getPhone = phoneNumberString => {
    // 입력 문자열의 앞 3자리, 중간 4자리, 마지막 4자리를 추출
    const part1 = phoneNumberString.slice(0, 3);
    const part2 = phoneNumberString.slice(3, 7);
    const part3 = phoneNumberString.slice(7, 11);

    // 추출한 부분들을 '-'로 연결
    return `${part1}-${part2}-${part3}`;
  };

  const deleteIt = async jid => {
    const confirm = window.confirm("게재를 중단합니다 진행할까요?");
    if (!confirm) {
      return false;
    }
    const data = {
      jobCode: jid,
    };
    await axiosInstance
      .patch("/api/v1/board/upt/job/n", data, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(response => {
        // 응답의 data.message를 alert 창으로 띄움
        alert(response.data.message);

        // response의 data.code가 "C000"일 경우
        if (response.data.code === "C000") {
          // alert 창을 닫은 후 "/employ/list" 페이지로 이동
          navi("/employ/list");
        }
        // code가 "C000"이 아닌 경우 다른 처리는 하지 않음
      })
      .catch(error => {
        // 오류 처리
        console.error("There was an error!", error);
      });
  };
  return (
    <>
      <Helmet>
        <title>채용공고 | 알바선물 채용게시판</title>
      </Helmet>
      {jobInfo !== null ? (
        <>
          <Helmet>
            <title>{jobInfo.title} | 알바선물 채용게시판</title>
          </Helmet>
          <div className="mt-3 lg:mt-10 flex justify-between w-full">
            <div className="w-full lg:w-[70%]">
              <div className="border border-gray-300 py-2 px-5">
                <h2 className="lg:p-0 text-lg lg:text-3xl font-neoextra py-2 lg:py-10 border-b border-gray-200">
                  <div className="text-gray-800 hidden lg:block text-base font-neobold mb-2">
                    {jobInfo.compArea || "전국 채용"}
                  </div>
                  {jobInfo.title}
                </h2>
                <div className="py-2 px-0 lg:px-3 grid grid-cols-2 gap-x-2 gap-y-2 lg:hidden">
                  <div className="flex justify-start gap-x-2 text-sm lg:text-lg font-neoextra">
                    <span className="font-neobold">💰</span>
                    <span>
                      <span className="text-orange-600">월</span>{" "}
                      {jobInfo.salary.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-start gap-x-2 text-sm lg:text-xl font-neoextra">
                    <span className="font-neobold">🚩</span>
                    <span>{jobInfo.compArea || "지원 후 안내"}</span>
                  </div>
                  <div className="flex justify-start gap-x-2 text-sm lg:text-xl font-neoextra">
                    <span className="font-neobold">📆</span>
                    <span>{jobInfo.workDay}</span>
                  </div>
                  <div className="flex justify-start gap-x-2 text-sm lg:text-xl font-neoextra">
                    <span className="font-neobold">⏰</span>
                    <span>{jobInfo.workTime}</span>
                  </div>
                </div>
                <div className="px-5 py-5 hidden grid-cols-3 mt-10 lg:grid">
                  <div className="flex justify-start gap-x-3 lg:text-lg font-neoextra">
                    <div className="font-neobold flex flex-col justify-center text-5xl">
                      💰
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-orange-600 text-sm">월급</span>
                      <span className="text-xl">
                        {jobInfo.salary.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                  <div className="hidden justify-start gap-x-3 lg:text-lg font-neoextra">
                    <div className="font-neobold flex flex-col justify-center text-5xl">
                      🚩
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-orange-600 text-sm">지역</span>
                      <span className="text-xl">
                        {jobInfo.compArea || "지원 후 안내"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-start gap-x-3 lg:text-lg font-neoextra">
                    <div className="font-neobold flex flex-col justify-center text-5xl">
                      📆
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-orange-600 text-sm">근무요일</span>
                      <span className="text-xl">
                        {jobInfo.workDay
                          ? `${jobInfo.workDay} ${
                              jobInfo.workDay.length < 4 ? "근무" : ""
                            }`
                          : "지원 후 안내"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-start gap-x-3 lg:text-lg font-neoextra">
                    <div className="font-neobold flex flex-col justify-center text-5xl">
                      ⏰
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-orange-600 text-sm">근무시간</span>
                      <span className="text-xl">{jobInfo.workTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-5 w-full grid grid-cols-2 relative overflow-hidden h-[72px] lg:h-[144px] ">
                <img
                  src="https://source.unsplash.com/random/1920x1080/?building"
                  alt=""
                  className="w-full h-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  onLoad={() => setImgLoaded(true)}
                />
              </div>
              <div className="my-5 w-full grid grid-cols-1 lg:grid-cols-2 p-4 bg-gray-100 rounded-lg">
                <div className="text-stone-800 mb-4">
                  <strong className="font-neoextra">면접비</strong> :{" "}
                  <strong className="font-neoextra text-rose-500">
                    {jobInfo.intvPoint.toLocaleString()}P
                  </strong>{" "}
                  지급
                </div>
                <div className="text-stone-800 mb-4 hidden">
                  <strong className="font-neoextra">문의</strong> :{" "}
                  {!user.accessToken ? (
                    <>
                      <Link to="/login" className="hover:text-blue-500">
                        로그인 후 확인
                      </Link>
                    </>
                  ) : (
                    <>
                      <a
                        href={`tel:${Number(jobInfo.phone)}`}
                        className="hover:text-blue-500"
                      >
                        {getPhone(jobInfo.phone)}
                      </a>
                    </>
                  )}
                </div>
                <div className="text-stone-800 mb-4">
                  <strong className="font-neoextra">마감일</strong> :{" "}
                  {jobInfo.openRecruit === "Y"
                    ? "상시채용"
                    : `${dayjs(jobInfo.postingEndDate).format(
                        "YYYY-MM-DD"
                      )} 까지`}
                </div>
                <div className="text-stone-800 lg:col-span-2">
                  <strong className="font-neoextra">근무지</strong> :{" "}
                  {jobInfo.mainAddr} <br className="lg:hidden" />
                  <a
                    href={`//map.kakao.com/?q=${jobInfo.mainAddr}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-blue-700 items-center text-blue-500 hidden lg:inline"
                  >
                    <FaMapMarkerAlt className="inline" size={15} />
                    지도보기
                  </a>
                </div>
                <a
                  href={`//map.kakao.com/?q=${jobInfo.mainAddr}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-blue-700 items-center text-blue-500 lg:hidden"
                >
                  <FaMapMarkerAlt className="inline" size={15} />
                  지도보기
                </a>
              </div>
              {imgLoaded ? (
                <div className="mt-10">
                  {imgList && imgList.length > 0 ? (
                    <div className="mb-20 grid grid-cols-1 gap-y-2">
                      <h3 className="font-neoextra text-xl p-2 bg-gradient-to-r from-blue-100 to-white">
                        채용요강
                      </h3>
                      <img
                        src={imgList[0].fileUrl}
                        alt=""
                        className="h-auto w-fit max-w-full"
                      />
                    </div>
                  ) : null}
                  {content ? (
                    <div className="mb-20 grid grid-cols-1 gap-y-2">
                      <h3 className="font-neoextra text-xl p-2 bg-gradient-to-r from-blue-100 to-white">
                        업무내용
                      </h3>
                      <div
                        className="employQuill text-left lg:text-lg px-2"
                        dangerouslySetInnerHTML={{
                          __html: sanitizer(content),
                        }}
                      />
                    </div>
                  ) : null}
                  {qualification ? (
                    <div className="my-20 grid grid-cols-1 gap-y-2">
                      <h3 className="font-neoextra text-xl p-2 bg-gradient-to-r from-blue-100 to-white">
                        지원자격
                      </h3>
                      <div
                        className="employQuill text-left lg:text-lg px-2"
                        dangerouslySetInnerHTML={{
                          __html: sanitizer(qualification),
                        }}
                      />
                    </div>
                  ) : null}
                  {welfare ? (
                    <div className="my-20 grid grid-cols-1 gap-y-2">
                      <h3 className="font-neoextra text-xl p-2 bg-gradient-to-r from-blue-100 to-white">
                        복지혜택
                      </h3>
                      <div
                        className="employQuill text-left lg:text-lg px-2"
                        dangerouslySetInnerHTML={{
                          __html: sanitizer(welfare),
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              ) : (
                <Loading />
              )}
            </div>
            <div className="hidden lg:block w-[29%] min-h-screen">
              <div className="sticky top-10 right-0 w-full h-fit border border-gray-300 p-4">
                <div className="text-center mb-2 text-xl font-neoextra truncate">
                  {jobInfo.title}
                </div>
                <div className="text-sm text-gray-600 text-center font-neo mb-4">
                  {jobInfo.openRecruit === "Y"
                    ? "상시채용"
                    : `${dayjs(jobInfo.postingEndDate).format(
                        "YYYY-MM-DD"
                      )} 까지`}
                </div>
                <div className="flex flex-col justify-center gap-y-2 mb-4 text-center py-4 border-y">
                  <div className="hidden">
                    <span className="font-neoextra">😊</span> :{" "}
                    {jobInfo.manager || "지원 후 안내"}
                  </div>
                  <div className="hidden">
                    <span className="font-neoextra">📞</span> :{" "}
                    {!user.accessToken ? (
                      <>
                        <Link to="/login" className="hover:text-blue-500">
                          로그인 후 확인
                        </Link>
                      </>
                    ) : (
                      <>
                        <a
                          href={`tel:${Number(jobInfo.phone)}`}
                          className="hover:text-blue-500"
                        >
                          {getPhone(jobInfo.phone)}
                        </a>
                      </>
                    )}
                  </div>

                  <div>
                    <span className="font-neoextra">🚌</span> :{" "}
                    {jobInfo.detailAddr || "지원 후 안내"}
                  </div>
                </div>
                <div className="text-center mb-4">
                  💎 면접포인트{" "}
                  <span className="font-neoheavy text-rose-500">
                    {jobInfo.intvPoint.toLocaleString()}P
                  </span>{" "}
                  지급 💎
                </div>
                <button
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white text-lg p-2 rounded-lg"
                  onClick={() => applyIt()}
                >
                  지원하기
                </button>
                <div className="text-center text-sm mt-4">
                  총{" "}
                  <span className="font-neoextra text-base">
                    {jobInfo.viewCnt}
                  </span>
                  명이 이 공고를 확인했습니다
                </div>

                {user.admin ? (
                  <div className="text-center my-4 text-xs">
                    <Link
                      to={`/admin/addemploy/${jid}`}
                      className="hover:underline text-gray-500 inline"
                    >
                      수정하기
                    </Link>{" "}
                    |{" "}
                    <button
                      className="hover:underline text-gray-500 inline"
                      onClick={() => deleteIt(jid)}
                    >
                      미사용
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-5 border-t">
            <ShopRecommend />
          </div>
          <div className="lg:hidden fixed top-0 left-0 right-0 w-full h-[50px] bg-white drop-shadow flex justify-start gap-x-3">
            <button className="h-full w-[50px]" onClick={() => navi(-1)}>
              <AiOutlineArrowLeft size={24} className="mx-auto my-auto" />
            </button>
            <div className="flex flex-col justify-center text-lg">채용정보</div>
          </div>
          <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full p-2 bg-white border-t border-gray-400 grid grid-cols-1 gap-y-2">
            <div className="text-center">
              면접 보시면{" "}
              <span className="font-neoheavy text-rose-500">
                {jobInfo.intvPoint.toLocaleString()}P
              </span>{" "}
              드려요
            </div>
            <button
              className="w-full py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => applyIt()}
            >
              지원하기
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}

export default EmployDetail;
