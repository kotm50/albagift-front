import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="grid grid-cols-10 gap-3">
          <div className="p-2 text-center text-lg">검색</div>
          <div className="col-span-8">
            <input
              type="text"
              className="border rounded-lg p-2 w-full"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.currentTarget.value)}
              onBlur={e => setSearchKeyword(e.currentTarget.value)}
            />
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 p-2 text-white"
            type="submit"
          >
            검색
          </button>
        </div>
      </div>
    </form>
  );
}

export default Search;
