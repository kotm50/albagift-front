import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import axiosInstance from "../../../Api/axiosInstance";
import Pagenate from "../../Layout/Pagenate";

import { FaSearch } from "react-icons/fa";
import InputCare from "./InputCare";

import dayjs from "dayjs";

function CareList() {
  const navi = useNavigate();
  const thisLocation = useLocation();
  const pathName = thisLocation.pathname;
  const parsed = queryString.parse(thisLocation.search);
  const page = parsed.page || 1;
  const keyword = parsed.keyword || null;
  const type = parsed.type;
  const [list, setList] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("");

  const [modalOn, setModalOn] = useState(false);
  const [adInfo, setCareInfo] = useState(null);
  const user = useSelector(state => state.user);

  useEffect(() => {
    getList(page, keyword, type);
    //eslint-disable-next-line
  }, [thisLocation]);

  const getList = async (page, keyword, type) => {
    setList([]);
    let pageNum = 1;
    if (page) {
      pageNum = Number(page);
    }
    let data = {
      page: pageNum,
      size: 20,
    };
    if (keyword) {
      data.searchKeyword = keyword;
      data.searchType = type;
      setSearchKeyword(keyword);
      setSearchType(type);
    }
    await axiosInstance
      .post("/api/v1/ad/prog/list", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        setList(res.data.progressList);
        const totalP = res.data.totalPages;
        setTotalPage(res.data.totalPages);
        const pagenate = generatePaginationArray(page, totalP);
        setPagenate(pagenate);
      })
      .catch(e => {
        console.log(e);
      });
    function generatePaginationArray(currentPage, totalPage) {
      let paginationArray = [];

      // 최대 페이지가 4 이하인 경우
      if (Number(totalPage) <= 4) {
        for (let i = 1; i <= totalPage; i++) {
          paginationArray.push(i);
        }
        return paginationArray;
      }

      // 현재 페이지가 1 ~ 3인 경우
      if (Number(currentPage) <= 3) {
        return [1, 2, 3, 4, 5];
      }

      // 현재 페이지가 totalPage ~ totalPage - 2인 경우
      if (Number(currentPage) >= Number(totalPage) - 2) {
        return [
          Number(totalPage) - 4,
          Number(totalPage) - 3,
          Number(totalPage) - 2,
          Number(totalPage) - 1,
          Number(totalPage),
        ];
      }

      // 그 외의 경우
      return [
        Number(currentPage) - 2,
        Number(currentPage) - 1,
        Number(currentPage),
        Number(currentPage) + 1,
        Number(currentPage) + 2,
      ];
    }
  };

  const searchIt = () => {
    if (searchKeyword === "") {
      return alert("검색어를 입력하세요");
    }
    const keyword = searchKeyword.trim();
    let domain = `${pathName}?page=1&type=${searchType}${
      keyword !== "" ? `&keyword=${keyword}` : ""
    }`;
    navi(domain);
  };

  const getDate = d => {
    const date = new Date(d);
    const formatted = dayjs(date).format("YY/MM/DD");
    return formatted;
  };

  return (
    <div className="px-4 relative z-0">
      <div className="container mx-auto">
        <div className="flex justify-between mb-4 w-full bg-gray-100 p-2 sticky top-0 min-w-fit">
          <div className="flex justify-start gap-x-2 w-full">
            <select
              id=""
              className="p-1 border bg-white focus:border-gray-500 uppercase w-[120px]"
              onChange={e => setSearchType(e.currentTarget.value)}
              value={searchType}
            >
              <option value="">검색분류</option>
              <option value="1">파트너</option>
              <option value="2">고객사번호</option>
              <option value="3">고객사 또는 지점명</option>
            </select>
            <input
              value={searchKeyword}
              className="border border-gray-300 p-2 w-80 block rounded font-neo"
              placeholder={
                searchType === "1"
                  ? "파트너명 입력"
                  : searchType === "2"
                  ? "고객사 번호 입력"
                  : searchType === "3"
                  ? "고객사명 또는 지점명 입력"
                  : "검색할 분류를 먼저 선택하세요"
              }
              onChange={e => setSearchKeyword(e.currentTarget.value)}
              onKeyDown={e => e.key === "Enter" && searchIt()}
              disabled={searchType === ""}
            />
            <button
              className="py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded transition-all duration-300"
              onClick={() => searchIt()}
            >
              <FaSearch />
            </button>
            {keyword && (
              <div className="py-2">
                {type === "1"
                  ? "파트너명 "
                  : type === "2"
                  ? "고객사 번호 "
                  : type === "3"
                  ? "고객사명/지점명 "
                  : null}
                <span className="text-red-600 font-neoextra">{keyword}</span> 로
                검색한 결과입니다.
              </div>
            )}
          </div>
          <button
            className="py-2 px-5 bg-blue-600 text-white rounded-lg min-w-[120px]"
            onClick={() => {
              setModalOn(true);
            }}
          >
            케어 등록
          </button>
        </div>
      </div>
      <div className="container mx-auto">
        {list && list.length > 0 ? (
          <table className="border-collapse text-sm min-w-full">
            <thead>
              <tr className="text-white">
                <th
                  className="bg-blue-600 break-keep py-[2px] px-[6px] align-middle border text-center"
                  rowSpan={2}
                >
                  보험사
                </th>
                <th
                  className="bg-blue-600 break-keep py-[2px] px-[6px] align-middle border text-center"
                  rowSpan={2}
                >
                  지점
                </th>
                <th
                  className="bg-blue-600 break-keep py-[2px] px-[6px] align-middle border text-center"
                  rowSpan={2}
                >
                  담당자
                </th>
                <th
                  className="bg-blue-600 break-keep py-[2px] px-[6px] align-middle border text-center"
                  rowSpan={2}
                >
                  시작
                </th>
                <th
                  className="bg-blue-600 break-keep py-[2px] px-[6px] align-middle border text-center"
                  rowSpan={2}
                >
                  종료
                </th>
                <th
                  className="bg-blue-600 break-keep py-[2px] px-[6px] align-middle border text-center"
                  rowSpan={2}
                >
                  케어서비스
                </th>
                <th
                  className="bg-blue-600 break-keep py-[2px] px-[6px] align-middle border text-center"
                  rowSpan={2}
                >
                  오늘
                </th>
                <th
                  className="bg-blue-600 break-keep py-[2px] px-[6px] align-middle border text-center"
                  rowSpan={2}
                >
                  보험사
                </th>
                <th className="bg-orange-600 break-keep py-[2px] px-[6px] align-middle border text-center">
                  케어대상
                </th>
                <th className="bg-orange-600 break-keep py-[2px] px-[6px] align-middle border text-center">
                  합격
                </th>
                <th className="bg-orange-600 break-keep py-[2px] px-[6px] align-middle border text-center">
                  불합격
                </th>
                <th className="bg-orange-600 break-keep py-[2px] px-[6px] align-middle border text-center">
                  발송완료
                </th>
                <th className="bg-orange-600 break-keep py-[2px] px-[6px] align-middle border text-center">
                  발송률
                </th>
              </tr>
              <tr className="text-black">
                <th className="bg-yellow-300 break-keep py-[2px] px-[6px] align-middle border text-center">
                  0
                </th>
                <th className="bg-yellow-300 break-keep py-[2px] px-[6px] align-middle border text-center">
                  0
                </th>
                <th className="bg-yellow-300 break-keep py-[2px] px-[6px] align-middle border text-center">
                  0
                </th>
                <th className="bg-yellow-300 break-keep py-[2px] px-[6px] align-middle border text-center">
                  0
                </th>
                <th className="bg-yellow-300 break-keep py-[2px] px-[6px] align-middle border text-center">
                  0%
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((doc, idx) => (
                <tr
                  key={idx}
                  className="bg-white hover:cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setCareInfo(doc);
                    setModalOn(true);
                  }}
                >
                  <td className="break-keep py-[2px] px-[6px] border text-center">
                    {doc.compName}
                  </td>
                  <td className="break-keep py-[2px] px-[6px] border text-center">
                    {doc.compBranch}
                  </td>
                  <td className="break-keep py-[2px] px-[6px] border text-center">
                    {doc.manager1}
                  </td>
                  <td className="break-keep py-[2px] px-[6px] border text-center">
                    {getDate(doc.adStartDate)}
                  </td>
                  <td className="break-keep py-[2px] px-[6px] border text-center">
                    {getDate(doc.adEndDate)}
                  </td>
                  <td className="break-keep py-[2px] px-[6px] border text-center">
                    {doc.careService}
                  </td>
                  <td className="break-keep py-[2px] px-[6px] border text-center truncate">
                    {doc.bigo}
                  </td>
                  <td className="break-keep py-[2px] px-[6px] border text-center truncate">
                    {doc.bigo}
                  </td>
                  <td className="break-keep py-[2px] px-[6px] border text-center truncate"></td>
                  <td className="break-keep py-[2px] px-[6px] border text-center truncate"></td>
                  <td className="break-keep py-[2px] px-[6px] border text-center truncate"></td>
                  <td className="break-keep py-[2px] px-[6px] border text-center truncate"></td>
                  <td className="break-keep py-[2px] px-[6px] border text-center truncate">
                    <button
                      className="py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded transition-all duration-300 w-full h-full"
                      onClick={e => {
                        e.stopPropagation();
                        alert("ㅇㅇ");
                      }}
                    >
                      발송입력
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {modalOn && (
          <InputCare
            adInfo={adInfo}
            setCareInfo={setCareInfo}
            setModalOn={setModalOn}
            user={user}
            getList={getList}
            page={page}
            keyword={keyword}
          />
        )}
        <Pagenate
          page={Number(page)}
          keyword={keyword}
          type={String(type)}
          totalPage={Number(totalPage)}
          pagenate={pagenate}
          pathName={pathName}
        />
      </div>
    </div>
  );
}

export default CareList;
