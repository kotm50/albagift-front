import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import searchBanner from "../../Asset/searchBanner.png";
import searchBannerMobile from "../../Asset/searchBannerMobile.png";

function Search(props) {
  const location = useLocation();
  useEffect(() => {
    if (props.keyword) {
      setSearchKeyword(props.keyword);
      setSearchOpen(true);
    }
    //eslint-disable-next-line
  }, [location]);
  let navi = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchIt = async () => {
    if (searchKeyword !== "") {
      navi(`/search/${searchKeyword}`);
    } else {
      return alert("검색어를 입력해 주세요");
    }
  };
  return (
    <>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="hidden xl:flex flex-row justify-between bg-gray-700 text-left text-white text-xl font-neobold">
            <span className="p-4">찾으시는 상품이 있으시다면?</span>
            <span className="max-h-full overflow-y-hidden h-14">
              <img src={searchBanner} alt="상품이미지" className="h-full" />
            </span>
            <span className="p-4">지금 바로 찾아보세요 &gt;&gt;</span>
          </div>
          <div className="p-2 xl:hidden flex flex-row justify-between bg-gray-700">
            <h2 className="pb-1 pt-2 text-lg font-neobold text-white">
              상품찾기
            </h2>
            <span className="max-h-full overflow-y-hidden h-10">
              <img
                src={searchBannerMobile}
                alt="상품이미지"
                className="h-full"
              />
            </span>
            <button
              className="py-1 px-4 text-sm bg-blue-500 text-white rounded-lg"
              onClick={e => {
                e.preventDefault();
                setSearchOpen(!searchOpen);
              }}
            >
              {searchOpen ? "　닫기　" : "검색하기"}
            </button>
          </div>
          <div className="hidden xl:grid grid-cols-1 xl:grid-cols-10 xl:gap-3  bg-teal-100 p-2">
            <div className="xl:col-span-8">
              <input
                type="text"
                className="border rounded-lg p-2 w-full"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.currentTarget.value)}
                onBlur={e => setSearchKeyword(e.currentTarget.value)}
                placeholder="검색어를 입력하세요"
              />
            </div>
            <div className="py-2 xl:py-0 xl:col-span-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 p-2 text-white w-full rounded-lg"
                type="submit"
              >
                검색
              </button>
            </div>
          </div>
          {searchOpen && (
            <div className="transition-all duration-300 ease-in-out xl:hidden grid grid-cols-1 xl:grid-cols-10 xl:gap-3 bg-teal-100 p-2">
              <div className="xl:col-span-8">
                <input
                  type="text"
                  className="border rounded-lg p-2 w-full"
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.currentTarget.value)}
                  onBlur={e => setSearchKeyword(e.currentTarget.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      searchIt();
                    }
                  }}
                  placeholder="검색어를 입력하세요"
                />
              </div>
              <div className="py-2 xl:py-0 xl:col-span-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 p-2 text-white w-full rounded-lg"
                  type="submit"
                >
                  검색
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Search;
