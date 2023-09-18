import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SearchArea(props) {
  const location = useLocation();
  useEffect(() => {
    if (props.keyword) {
      setSearchKeyword(props.keyword);
    }
    //eslint-disable-next-line
  }, [location]);
  let navi = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const searchIt = async () => {
    if (searchKeyword !== "") {
      navi(`/search/${searchKeyword}`);
    } else {
      return alert("검색어를 입력해 주세요");
    }
  };
  return (
    <>
      <div className="hidden xl:grid grid-cols-1 xl:grid-cols-10 xl:gap-3  bg-teal-100 p-2">
        <div className="xl:col-span-8">
          <input
            type="text"
            className="border rounded-lg p-2 w-full"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.currentTarget.value)}
            onBlur={e => setSearchKeyword(e.currentTarget.value)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.keyCode === 13) {
                searchIt();
              }
            }}
            placeholder="검색어를 입력하세요"
          />
        </div>
        <div className="py-2 xl:py-0 xl:col-span-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 p-2 text-white w-full rounded-lg"
            onClick={e => searchIt()}
          >
            검색
          </button>
        </div>
      </div>
    </>
  );
}

export default SearchArea;
