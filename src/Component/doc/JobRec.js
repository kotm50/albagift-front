import React from "react";

function JobRec(props) {
  return (
    <div className="text-sm lg:text-base">
      당사 및 당사 업무 수탁자는 <br className="lg:hidden" />
      「개인정보보호법」에 따라 <br className="hidden lg:block" />
      귀하의 개인정보를 다음과 같이 수집 이용하고자 합니다
      <br />
      <br />
      <strong className="font-neoheavy">수집 및 이용목적</strong>
      <br />
      <span className="underline">
        성향별 맞춤 채용정보를 문자, 알림톡, 전화 등을 통해 제공해 드립니다
      </span>
      <br />
      <br />
      <strong className="font-neoheavy">보유 및 이용기간</strong>
      <br />
      <span className="underline">동의일로부터 1년</span>
      <br />
      <br />
      <strong className="font-neoheavy">수집 및 이용항목</strong>
      <br />
      개인식별정보(성명, 성별, 생년월일), 거주지주소
      <br />
      <br />본 동의를 거부하는 경우 추천 채용안내 서비스 제공이 제한됩니다
    </div>
  );
}

export default JobRec;
