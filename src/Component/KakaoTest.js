import { useEffect, useState } from "react";
import axios from "axios";

import { useSelector } from "react-redux";

function KakaoTest() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const user = useSelector(state => state.user);
  useEffect(() => {
    //test2();
    //eslint-disable-next-line
  }, []);
  const test = async () => {
    console.log(start, end);
    const data = {
      startDate: start,
      endDate: end,
    };
    await axios
      .post("/api/v1/user/admin/search/datePnt", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleDateChange = setFunc => event => {
    setFunc(event.target.value);
  };
  /*
  const test2 = async () => {
    await axios
      .post("/api/v1/user/admin/buy/point/lky1004", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  */
  return (
    <>
      <div className="grid grid-cols-2 bg-gray-50 p-2 my-2">
        <div className="grid grid-cols-10 gap-x-2">
          <div className="col-span-2"></div>
          <div className="col-span-3 text-sm text-left">시작일</div>
          <div className="col-span-3 text-sm text-left">종료일</div>
          <div className="col-span-2"></div>
          <div className="py-2 text-center col-span-2">날짜선택</div>
          <div className="col-span-3">
            <input
              id="inputDate"
              type="date"
              value={start}
              className="p-2 border  w-full"
              onChange={handleDateChange(setStart)}
            />
          </div>
          <div className="col-span-3">
            <input
              id="inputDate"
              type="date"
              value={end}
              className="p-2 border w-full"
              onChange={handleDateChange(setEnd)}
            />
          </div>
          <div className="text-center col-span-2">
            <button
              className="w-full bg-green-500 hover:bg-green-700 p-2 text-white"
              onClick={test}
            >
              검색.
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default KakaoTest;
