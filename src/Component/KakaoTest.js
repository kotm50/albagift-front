function KakaoTest() {
  return (
    <div>
      <h1 className="text-center text-xl xl:text-4xl font-medium mt-4">
        구매가 완료되었습니다.
        <br className="block xl:hidden" /> 이용해주셔서 감사합니다.
      </h1>
      <div className="countainer mx-auto bg-indigo-50 p-4 mt-5 rounded-lg mb-96">
        <div className="xl:text-lg text-center">
          <strong className="text-rose-500 text-xl xl:text-2xl">3</strong> 초 후
          쿠폰리스트로 이동합니다
        </div>
      </div>
      <button
        className="p-2 bg-green-500 text-white"
        onClick={e => {
          // location이 바뀔 때마다 스크롤을 맨 위로 이동
          window.scrollTo(0, 0);
        }}
      >
        위로
      </button>
    </div>
  );
}

export default KakaoTest;
