import React, { useState } from "react";

function ImgLoad(props) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div>
      {imgLoaded ? (
        <img
          src={props.good.goodsImgS}
          alt={props.good.goodsName}
          className="w-full mx-auto my-auto duration-300 transition-all ease-in-out group-hover:scale-125"
        />
      ) : (
        <>
          <img
            src={props.good.goodsImgS}
            alt={props.good.goodsName}
            className="fixed top-0 left-0 opacity-0"
            onLoad={e => setImgLoaded(true)}
          />
          <div className="bg-slate-200 animate-pulse w-32 h-32 xl:w-60 xl:h-60"></div>
        </>
      )}
    </div>
  );
}

export default ImgLoad;
