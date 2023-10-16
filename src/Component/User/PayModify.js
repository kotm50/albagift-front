import React, { useState } from "react";
import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

import axios from "axios";
import AlertModal from "../Layout/AlertModal";

function PayModify(props) {
  const [date, setDate] = useState(props.doc.intvDate);
  const [hour, setHour] = useState(props.doc.intvTime);
  const [minute, setMinute] = useState(props.doc.intvMin);

  const handleDateChange = event => {
    setDate(event.target.value);
  };

  const confirm = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"면접일시 수정"} // 제목
            message={"수정하시겠습니까?"} // 내용
            type={"confirm"} // 타입 confirm, alert
            yes={"확인"} // 확인버튼 제목
            no={"취소"} // 취소버튼 제목
            doIt={submit} // 확인시 실행할 함수
            doNot={cancelSubmit} // 취소시 실행할 함수
          />
        );
      },
    });
  };

  const cancelSubmit = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"수정취소"} // 제목
            message={"날짜와 시간을 확인해 주세요"} // 내용
            type={"alert"} // 타입 confirm, alert
            yes={"확인"} // 확인버튼 제목
          />
        );
      },
    });
    return false;
  };
  const submit = async () => {
    let data = {
      boardId: "B02",
      postId: props.doc.postId,
      intvDate: date,
      intvTime: hour,
      intvMin: minute,
    };
    await axios
      .patch("/api/v1/board/upt/pnt/posts", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        if (res.data.code === "C000") {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"수정 완료"} // 제목
                  message={"수정했습니다"} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                />
              );
            },
          });
          props.loadList(props.page);
        } else {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"오류!!"} // 제목
                  message={"오류가 발생했습니다."} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                />
              );
            },
          });
          return false;
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <div className="col-span-7 grid grid-cols-7 p-2 bg-gray-300">
      <div className="py-4 font-neoextra text-center bg-blue-50 hover:bg-gray-50">
        면접날짜 수정
      </div>
      <div className="py-2 text-center bg-white hover:bg-gray-50">
        <input
          id="inputDate"
          type="date"
          value={date}
          onChange={handleDateChange}
          className="border rounded border-gray-500 py-1 px-2"
        />
      </div>
      <div className="py-4 font-neoextra text-center bg-blue-50 hover:bg-gray-50">
        면접시간 수정
      </div>
      <div className="p-2 text-center bg-white hover:bg-gray-50 grid grid-cols-2">
        <div className="grid grid-cols-4 py-1">
          {/* 시간 선택 */}
          <select
            className="col-span-3 p-1 border border-gray-500 rounded"
            value={hour}
            onChange={e => setHour(e.target.value)}
          >
            {Array.from({ length: 24 }).map((_, idx) => (
              <option key={idx} value={String(idx)}>
                {String(idx)}
              </option>
            ))}
          </select>
          <div className="p-1">시</div>
        </div>
        <div className="grid grid-cols-4 py-1">
          {/* 분 선택 */}
          <select
            className="col-span-3 p-1 border border-gray-500 rounded"
            value={minute}
            onChange={e => setMinute(e.target.value)}
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <option key={idx} value={String(idx * 10).padStart(2, "0")}>
                {String(idx * 10).padStart(2, "0")}
              </option>
            ))}
          </select>
          <div className="p-1">분</div>
        </div>
      </div>

      <div className="py-4 font-neoextra text-center bg-blue-50 hover:bg-gray-50">
        수정하기
      </div>
      <div className="p-3 text-center bg-white hover:bg-gray-50 col-span-2">
        <button
          className="bg-green-500 py-1 px-4 hover:bg-green-700 text-center text-white w-full"
          onClick={e => confirm()}
        >
          버튼을 눌러 수정하기
        </button>
      </div>
    </div>
  );
}

export default PayModify;
