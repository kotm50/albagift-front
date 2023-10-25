function KakaoTest() {
  return (
    <div>
      <h1 className="text-center text-xl xl:text-4xl font-medium mt-4">
        구매가 완료되었습니다.
        <br className="block xl:hidden" /> 이용해주셔서 감사합니다.
      </h1>
      <div className="countainer mx-auto bg-indigo-50 p-4 mt-5 rounded-lg">
        <div className="xl:text-lg text-center">
          <strong className="text-rose-500 text-xl xl:text-2xl">3</strong> 초 후
          쿠폰리스트로 이동합니다
        </div>
      </div>
    </div>
  );
}

export default KakaoTest;
