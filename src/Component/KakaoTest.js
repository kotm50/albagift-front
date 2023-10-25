import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dayModal } from "../Reducer/modalSlice";

function KakaoTest() {
  const dispatch = useDispatch();
  const modalState = useSelector(state => state.modal);
  useEffect(() => {
    console.log(modalState);
  }, [modalState]);
  const day = () => {
    dispatch(
      dayModal({
        oneDay: "Y",
        lastOpen: new Date(),
      })
    );
  };
  const hour = () => {
    dispatch(
      dayModal({
        oneDay: "N",
        lastOpen: new Date(),
      })
    );
  };
  return (
    <div className="container mx-auto flex justify-start gap-x-3">
      <button className="p-2 bg-green-500 text-white" onClick={day}>
        하루닫기
      </button>
      <button className="p-2 bg-gray-500 text-white" onClick={hour}>
        하루안닫기
      </button>
    </div>
  );
}

export default KakaoTest;
