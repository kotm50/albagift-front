import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { dayModal } from "../../Reducer/modalSlice";
//import renewal from "../../Asset/renew/renewal_new.png";
//import couponerr from "../../Asset/renew/couponerr.png";
import boardBanner from "../../Asset/renew/board.gif";

function RenewalModal() {
  const navi = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const modalState = useSelector(state => state.modal);
  const user = useSelector(state => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isOneDay, setIsOneDay] = useState(false);

  useEffect(() => {
    console.log(modalState);
    if (user.admin) {
      setIsOpen(false);
    } else {
      if (modalState.lastOpen === "") {
        setIsOpen(true);
        dispatch(
          dayModal({
            oneDay: "N",
            //lastOpen: new Date(),
            lastOpen: "",
          })
        );
      } else {
        isAfterDay(modalState.lastOpen, modalState.oneDay);
      }
    }
    //eslint-disable-next-line
  }, [location]);

  const isAfterDay = (lastOpen, oneDay) => {
    const lastOpenDate = new Date(lastOpen);
    const currentDate = new Date();

    //하루, 5분설정
    const oneDayDifference = currentDate - lastOpenDate > 24 * 60 * 60 * 1000;
    const fiveMinutesDifference = currentDate - lastOpenDate > 5 * 60 * 1000;

    //1분, 1분설정
    //const oneDayDifference = currentDate - lastOpenDate > 60 * 1000;
    //const fiveMinutesDifference = currentDate - lastOpenDate > 60 * 1000;

    if (oneDay === "Y") {
      if (oneDayDifference) {
        setIsOpen(true);
        dispatch(
          dayModal({
            oneDay: "N",
            //lastOpen: new Date(),
            lastOpen: "",
          })
        );
      } else {
        return false;
      }
    } else {
      if (fiveMinutesDifference) {
        setIsOpen(true);
        dispatch(
          dayModal({
            oneDay: "N",
            //lastOpen: new Date(),
            lastOpen: "",
          })
        );
      } else {
        return false;
      }
    }
  };

  const moveDetail = () => {
    setIsOpen(false);
    dispatch(
      dayModal({
        oneDay: modalState.oneDay,
        lastOpen: new Date(),
        //lastOpen: "",
      })
    );
    navi("/employ/list");
  };

  const closeIt = () => {
    setIsOpen(false);
    dispatch(
      dayModal({
        oneDay: isOneDay ? "Y" : "N",
        lastOpen: new Date(),
        //lastOpen: "",
      })
    );
  };
  return (
    <>
      {isOpen ? (
        <div id="renewalmodal" className="drop-shadow-lg rounded-lg">
          <div className="flex justify-between">
            <div className="flex items-center mb-2">
              <input
                id="oneDayClose"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={isOneDay}
                onChange={e => setIsOneDay(!isOneDay)}
              />
              <label
                htmlFor="oneDayClose"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                24시간 동안 보지 않기
              </label>
            </div>
          </div>
          <img
            src={boardBanner}
            alt="리뉴얼 안내"
            className="max-w-full h-auto hover:cursor-pointer"
            onClick={moveDetail}
          />
          <div className="grid grid-cols-3 gap-x-2 mt-2">
            <button
              className="p-2 bg-green-500 hover:bg-green-700 text-white col-span-2"
              onClick={moveDetail}
            >
              면접비 받으러 가기
            </button>
            <button
              className="p-2 bg-gray-100 hover:bg-gray-200 text-black"
              onClick={closeIt}
            >
              창 닫기
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default RenewalModal;
