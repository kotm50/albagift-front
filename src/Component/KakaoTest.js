import { useEffect } from "react";
import axios from "axios";

import { useSelector } from "react-redux";

function KakaoTest() {
  const user = useSelector(state => state.user);
  useEffect(() => {
    test();
    test2();
    //eslint-disable-next-line
  }, []);
  const test = async () => {
    await axios
      .post("/api/v1/user/admin/add/point/lky1004", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

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
  return <div>KakaoTest</div>;
}

export default KakaoTest;
