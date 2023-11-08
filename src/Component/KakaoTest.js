import React from "react";

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LineShareButton,
  LineIcon,
} from "react-share";

export default function KakaoTest() {
  const currentUrl = "https://albagift.com/detail/G00001331259";
  console.log(currentUrl);
  return (
    <>
      <div className="container mx-auto">
        <FacebookShareButton style={{ marginRight: "20px" }} url={currentUrl}>
          <FacebookIcon size={48} round={true} borderRadius={24}></FacebookIcon>
        </FacebookShareButton>
        <TwitterShareButton style={{ marginRight: "20px" }} url={currentUrl}>
          <TwitterIcon size={48} round={true} borderRadius={24}></TwitterIcon>
        </TwitterShareButton>
        <LineShareButton url={currentUrl}>
          <LineIcon size={48} round={true} borderRadius={24}></LineIcon>
        </LineShareButton>
      </div>
    </>
  );
}
