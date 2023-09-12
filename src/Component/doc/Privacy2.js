import React from "react";

function Privacy2(props) {
  return (
    <>
      <div>
        <p>
          &lt;{props.domainName === "xn--352blzj6r" ? "알바몰" : "알바선물"}
          &gt;('
          {props.domainName === "xn--352blzj6r"
            ? "알바몰"
            : props.domainName === "xn--392blpe5j93e"
            ? "알바선물"
            : props.domainName}
          .{props.domainExtension}'이하 '
          {props.domainName === "xn--352blzj6r" ? "알바몰" : "알바선물"}')&nbsp;
          은(는) 아래의 목적으로 개인정보를 수집 및 이용하며, 회원의 개인정보를
          안전하게 처리하는데 최선을 다하고 있습니다. 아래의 내용을 확인 후
          동의하여 주시기 바랍니다.
        </p>
        <p className="pt-2">
          <strong>1.수집 및 이용 목적</strong>
        </p>
        <p>
          <ul className="pl-2 font-neo">
            <li>회원 가입 의사 확인, 회원제 서비스 제공</li>
            <li>이용자 식별, 본인 인증</li>
            <li>고객 상담, 불만, 민원 사무 처리</li>
            <li>서비스 및 약관 변경 고지, 안내사항 전달</li>
            <li>상품∙서비스 이용 실적 정보 통계∙분석</li>
            <li>상품∙서비스 개선 및 추천, 불법∙부정 이용 방지</li>
          </ul>
        </p>
        <p className="pt-2">
          <strong>2. 수집 항목</strong>
        </p>
        <p className="pt-2">
          <strong>회원가입 시</strong>
        </p>
        <p className="font-neo">아이디, 비밀번호, 이메일</p>
        <p className="pt-2">
          <strong>(소셜 계정) 회원가입 시</strong>
        </p>
        <p className="font-neo">카카오 : 카카오계정(이메일)</p>
        <p className="pt-2">
          <strong>회원 공통</strong>
        </p>
        <p className="font-neo">프로필 사진, 닉네임</p>
        <p className="pt-2">
          <strong>본인인증</strong>
        </p>
        <p className="font-neo">
          이름, 성별, 생년월일, 휴대폰번호, CI, DI, 내/외국인 정보
        </p>
        <p className="pt-2">
          <strong>간편 로그인 시(소셜 계정 연동)</strong>
        </p>
        <p className="font-neo">카카오 : 로그인 정보 식별값</p>
        <p className="pt-2">
          <strong>서비스 이용 시</strong>
        </p>
        <p className="font-neo">
          서비스 이용 내역, 서비스 내 구매 및 결제 내역
        </p>
        <p className="pt-2">
          <strong>고객 상담 시</strong>
        </p>
        <p className="font-neo">
          이름, 휴대폰번호, 이메일, 내/외국인정보, 주문번호, 상담내용
        </p>
        <p className="pt-2">
          <strong>3. 보유 및 이용 기간</strong>
        </p>
        <p className="font-neo">
          탈퇴 요청 30일 후 지체 없이 파기합니다. <br />
          내부 방침에 의해 서비스 부정 이용 기록은 부정 가입 및 이용 방지를
          위하여 회원 탈퇴 시점으로부터 1년간 보관 후 파기합니다. <br />
          단, 관계 법령에 따라 일정 기간 보존해야 하는 경우 해당 기간 보관 후
          파기합니다. <br />
          필수적인 개인정보 수집 및 이용에 동의하지 않을 권리가 있습니다. 다만,
          동의하지 않을 경우 서비스 이용이 제한됩니다. <br />더 자세한 내용에
          대해서는 개인정보처리방침을 참고하시기 바랍니다.
        </p>
      </div>
    </>
  );
}

export default Privacy2;
