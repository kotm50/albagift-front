import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";

function Search(props) {
  let navi = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const searchIt = async e => {
    e.preventDefault();
    if (searchKeyword !== "") {
      navi(`/search/${searchKeyword}`);
    } else {
      return alert("검색어를 입력해 주세요");
    }
  };
  return (
    <form onSubmit={e => searchIt(e)}>
      <div className="container mx-auto p-2 bg-rose-50">
        <div className="grid grid-cols-1 xl:grid-cols-10 xl:gap-3">
          <div className="flex flex-row justify-between py-2 xl:py-0">
            <span className="py-2 text-lg">검색하기</span>
            <button className="p-2 bg-white text-lg xl:hidden rounded-lg">
              <BiSearchAlt size={24} />
            </button>
          </div>
          <div className="xl:col-span-8">
            <input
              type="text"
              className="border rounded-lg p-2 w-full"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.currentTarget.value)}
              onBlur={e => setSearchKeyword(e.currentTarget.value)}
            />
          </div>
          <div className="py-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 p-2 text-white w-full"
              type="submit"
            >
              검색
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Search;
