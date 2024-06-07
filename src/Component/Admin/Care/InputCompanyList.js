import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../Api/axiosInstance";

function InputCompanyList(props) {
  const [companyList, setCompanyList] = useState([]);
  const [loadMsg, setLoadMsg] = useState("검색어를 입력해 주세요");
  const inputRef = useRef();

  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (keyword.length > 1) {
        setLoadMsg("검색 중 입니다...");
        getCompanyList(keyword);
      } else {
        setCompanyList([]);
        setLoadMsg("검색하실 지점명/담당자명을 입력해 주세요");
      }
    }, 500);

    return () => clearTimeout(delaySearch); // Cleanup function to clear timeout
    //eslint-disable-next-line
  }, [keyword]);

  useEffect(() => {
    if (props.searchComp) {
      inputRef.current.focus();
    }
  }, [props.searchComp]);

  const getCompanyList = async c => {
    setLoadMsg("검색 중 입니다...");
    const data = {
      page: 1,
      size: 999,
      searchKeyword: c,
    };
    await axiosInstance
      .post("/api/v1/ad/comp/list", data, {
        headers: {
          Authorization: props.user.accessToken,
        },
      })
      .then(async res => {
        console.log(res);
        if (!res.data.adCompList || res.data.adCompList.length === 0) {
          setLoadMsg("검색 실패");
        }
        setCompanyList(res.data.adCompList ?? []);
      })
      .catch(e => {
        console.log(e);
        return false;
      });
  };
  return (
    <div className="relative p-2 py-0 bg-gray-100 min-w-[480px] w-full max-h-[300px] overflow-auto">
      <div className="sticky top-0 border-t-[8px] border-gray-100 min-w-fit flex justify-start gap-x-2 mb-2 bg-white p-2">
        <input
          id="searchKeyword"
          ref={inputRef}
          type="text"
          className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-white bg-white focus:border-gray-600 w-full"
          value={keyword}
          placeholder="고객사를 입력하세요"
          onChange={e => setKeyword(e.currentTarget.value)}
        />
      </div>
      {companyList.length > 0 ? (
        <div className="">
          <table className="w-full bg-white">
            <thead>
              <tr className=" bg-blue-100">
                <td className="p-2 text-center truncate">번호</td>
                <td className="p-2 text-center truncate">고객사</td>
                <td className="p-2 text-center truncate">지점</td>
                <td className="p-2 text-center truncate">담당자 1</td>
                <td className="p-2 text-center truncate">담당자 2</td>
                <td className="p-1 text-center">등록</td>
              </tr>
            </thead>
            <tbody>
              {companyList.map((com, idx) => (
                <tr key={idx}>
                  <td className="p-2 text-center truncate">{com.adNum}</td>
                  <td className="p-2 text-center truncate">{com.compName}</td>
                  <td className="p-2 text-center truncate">{com.compBranch}</td>
                  <td className="p-2 text-center truncate">{com.manager1}</td>
                  <td className="p-2 text-center truncate">{com.manager2}</td>
                  <td className="p-2 text-center">
                    <button
                      className="py-1 px-2 bg-green-500 text-white hover:bg-green-700 truncate"
                      value={com.companyCode}
                      onClick={() => {
                        props.setCompCode(com.compCode);
                        props.setCompName(`${com.compName} ${com.compBranch}`);
                        props.setSearchComp(false);
                      }}
                    >
                      등록
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="m-auto text-center py-5">{loadMsg}</div>
      )}
      <div className="grid grid-cols-2 gap-x-2">
        <button
          className="sticky bottom-0 min-w-fit p-2 w-full bg-blue-500 hover:bg-blue-700 text-white rounded mb-2"
          onClick={() => {
            props.setSearchComp(false);
          }}
        >
          창 닫기(내용유지)
        </button>
        <button
          className="sticky bottom-0 min-w-fit p-2 w-full bg-red-500 hover:bg-red-700 text-white rounded mb-2"
          onClick={() => {
            props.setCompCode("");
            props.setCompName("");
            props.setSearchComp(false);
          }}
        >
          창 닫기(내용삭제)
        </button>
      </div>
    </div>
  );
}

export default InputCompanyList;
