import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

function PopupTest() {
  let navi = useNavigate();
  const location = useLocation();

  const parsed = queryString.parse(location.search);
  const value = parsed.value || 1;
  useEffect(() => {
    if (value === 1) {
      navi(`/popup?value=831278934`);
    } else {
      window.opener.parentCallback(value);
    }
    //eslint-disable-next-line
  }, [location]);

  return (
    <>
      <div className="grid grid-cols-2 bg-gray-50 p-2 my-2">{value}</div>
    </>
  );
}

export default PopupTest;
