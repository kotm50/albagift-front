import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";

export const logoutAlert = (
  onClose,
  logout,
  dispatch,
  clearUser,
  navi,
  user,
  message
) => {
  return confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div id="alertmodal" className="max-w-screen p-4 bg-white border">
          <div className="px-4 py-10 bg-white border grid grid-cols-1 gap-y-3 border-rose-500">
            <h1 className="font-neoextra text-lg text-rose-500">로그아웃</h1>
            <p>{message || "로그아웃 되었습니다"}</p>
            <div className="grid grid-cols-1">
              <button
                onClick={() => {
                  forceLogout(dispatch, clearUser, navi, user);
                  onClose();
                }}
                className="border border-sky-500 bg-sky-500 text-white p-2"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      );
    },
  });
};

export const forceLogout = async (dispatch, clearUser, navi, user) => {
  await axios
    .post("/api/v1/user/logout", null, {
      headers: { Authorization: user.accessToken },
    })
    .then(res => {
      dispatch(clearUser());
      navi("/login");
    })
    .catch(e => {
      console.log(e);
    });
};

export const logout = async (dispatch, clearUser, navi, user) => {
  await axios
    .post("/api/v1/user/logout", null, {
      headers: { Authorization: user.accessToken },
    })
    .then(res => {
      dispatch(clearUser());
      navi("/");
    })
    .catch(e => {
      console.log(e);
    });
};
