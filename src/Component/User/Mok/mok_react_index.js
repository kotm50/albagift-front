import React, { Component } from "react";

/* index.html에 설정을 안 할 시 react-helmet 다운 및 주석해제 */
import { Helmet } from "react-helmet";
class moK_react_index extends Component {
  componentDidMount() {
    // 인증결과 콜백함수 정의
    const script = document.createElement("script");
    const callBackFunc = document.createTextNode(
      "function result(result) {" +
        "try {" +
        "result = JSON.parse(result);" +
        "document.querySelector('#result').value = JSON.stringify(result, null, 4);" +
        "} catch (error) {" +
        "document.querySelector('#result').value = result;" +
        "}" +
        "}"
    );

    script.appendChild(callBackFunc);
    document.body.appendChild(script);
  }

  /* PC | 모바일 스크립트 인식 구분 */
  /* PC 스크립트 사용시 mok_react_server(5.1 주석해제) */
  mok_popup() {
    let domain = window.location.hostname;
    let parts = domain.split(".");
    let domainName = parts[parts.length - 2]; // 'albagift'
    let domainExtension = parts[parts.length - 1]; // 'com'

    console.log(domain);
    console.log(domainName);
    console.log(domainExtension);

    window.MOBILEOK.process(
      `https://${domainName}.${domainExtension}/mok/mok_std_request`,
      "WB",
      "result"
    );
  }
  /* 모바일 스크립트 사용시 mok_react_server(5.2 주석해제) */
  // mok_move 사용시 mok_react_server(5.2-1 pathname 수정 후 사용)
  // mok_move() {
  // 모바일 전용서비스로 페이지 이동처리 또는 카카오 브라우져 등 새창으로 처리가 어려운 환경 또는 브라우져에서 처리
  // window.MOBILEOK.process("https://이용기관 본인인증-표준창 요청 (서버 (Node.js))URL/mok/mok_std_request", "WB", "");
  // }

  render() {
    return (
      <main>
        {/* index.html에 설정을 안 할 시 주석해제 */}
        <Helmet>
          {/* 운영 */}
          {/* <script src="https://cert.mobile-ok.com/resources/js/index.js"></script> */}
          {/* 개발 */}
          <script src="https://scert.mobile-ok.com/resources/js/index.js"></script>
        </Helmet>
        <div>
          <div>
            <div>
              <textarea id="result" rows="20"></textarea>
            </div>
          </div>
          <div>
            <button onClick={this.mok_popup}>본인확인 시작(팝업)</button>
          </div>
          {/* <div> */}
          {/* <button onClick={this.mok_move}>본인확인 시작(이동)</button> */}
          {/* </div> */}
        </div>
      </main>
    );
  }
}

export default moK_react_index;
