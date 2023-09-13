import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../Reducer/userSlice";
import { category } from "../Data/Category";

function Recommend(props) {
  let navi = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(state => state.user);
  const [goods, setGoods] = useState([]);
  const [loadMsg, setLoadMsg] = useState("상품을 불러오고 있습니다");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    getCategory(props.category);
    getGoods(props.category);
    //eslint-disable-next-line
  }, [location]);

  const getCategory = c => {
    const categoryItem = category.find(cat => cat.category1Seq === parseInt(c));
    setCategoryName(categoryItem.category1Name);
  };
  const getGoods = async c => {
    let listUrl = `/api/v1/shop/goods/list/${c}`;
    const data = {
      page: 1,
      size: 4,
    };
    setGoods([]);
    await axios
      .get(listUrl, {
        params: data,
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999") {
          logout();
          return false;
        }
        setLoadMsg(res.data.message);
        setGoods(res.data.goodsList);
        if (res.data.goodsList.length > 0) {
          setLoaded(true);
        }
      })
      .catch(e => {
        console.log(e, "에러");
      });
  };
  const logout = async () => {
    await axios
      .post("/api/v1/user/logout", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        alert("세션이 만료되었습니다. 다시 로그인 해주세요");
      })
      .catch(e => {
        console.log(e);
      });
    dispatch(clearUser());
    navi("/login");
  };

  return (
    <div className="p-2 bg-gray-100">
      <div className="xl:container mx-auto">
        <div className="overflow-x-auto w-full mx-auto my-2">
          <h3 className="xl:text-3xl font-lineseed py-2 border-b">
            {categoryName}의 추천상품
          </h3>
          {loaded ? (
            <div
              id="recommendList"
              className="mx-auto my-2 flex flex-row flex-nowrap overflow-x-auto xl:grid xl:grid-cols-4 w-full"
            >
              {goods.map((good, idx) => (
                <Link
                  key={idx}
                  to={`/detail/${good.goodsCode}`}
                  className="giftcategory flex-shrink-0 xl:w-auto p-1"
                >
                  <div className="group p-2 hover:border-2 bg-white hover:border-indigo-500 hover:bg-indigo-50 rounded recommendListItem drop-shadow hover:drop-shadow-lg border border-gray-100">
                    <div className="w-32 h-32 xl:w-64 xl:h-64 mx-auto rounded overflow-hidden max-w-full">
                      <img
                        src={good.goodsImgS}
                        alt={good.goodsName}
                        className="fixed top-0 left-0 w-0 h-0 opacity-0"
                        onLoad={e => setImgLoaded(true)}
                      />
                      {imgLoaded ? (
                        <img
                          src={good.goodsImgS}
                          alt={good.goodsName}
                          className="w-full mx-auto my-auto duration-100 transition-all group-hover:scale-110"
                        />
                      ) : (
                        <div className="bg-slate-200 animate-pulse w-30 h-30 xl:w-60 xl:h-60"></div>
                      )}
                    </div>
                    <div className="w-30 xl:w-60 mx-auto grid grid-cols-1 mt-2 max-w-full">
                      <p className="text-sm group-hover:font-lineseed keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left font-lineseed text-blue-500">
                        {good.brandName}
                      </p>
                      <p
                        className="text-sm group-hover:font-lineseed keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left"
                        title={good.goodsName}
                      >
                        {good.goodsName}
                      </p>
                      <p className="text-sm text-left">
                        <span className="text-base text-rose-500">
                          {Number(good.realPrice).toLocaleString()}
                        </span>{" "}
                        P
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div>{loadMsg}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recommend;
