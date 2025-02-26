const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");
const axios = require("axios");

// 사이트 기본 URL
const BASE_URL = "https://albagift.com";

// 사이트맵에 추가할 페이지 목록
const staticPages = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/login", changefreq: "monthly", priority: 0.8 },
  { url: "/naver-login", changefreq: "monthly", priority: 0.8 },
  { url: "/signup", changefreq: "monthly", priority: 0.8 },
  { url: "/list", changefreq: "daily", priority: 1.0 },
  { url: "/detail", changefreq: "daily", priority: 1.0 },
];

// ✅ API에서 동적 라우트의 ID 목록 가져오기
async function fetchJobIds() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/shop/goods/list`, {
      params: {
        page: 1,
        size: 9999,
      },
    }); // 실제 API 엔드포인트 사용
    return response.data.goodsList.map(goods => ({
      url: `/detail/${goods.goodsCode}`,
      changefreq: "daily",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("❌ API 요청 실패:", error);
    return [];
  }
}

// ✅ 사이트맵 생성 함수
async function generateSitemap() {
  const stream = new SitemapStream({ hostname: BASE_URL });

  // 정적 페이지 추가
  staticPages.forEach(page => {
    stream.write(page);
  });

  // 동적 페이지 추가 (API 데이터)
  const jobPages = await fetchJobIds();
  jobPages.forEach(page => {
    stream.write(page);
  });

  stream.end();

  const sitemap = await streamToPromise(stream).then(data => data.toString());

  // public 폴더에 sitemap.xml 저장
  fs.writeFileSync("./public/sitemap.xml", sitemap, "utf8");

  console.log("✅ 사이트맵 생성 완료: public/sitemap.xml");
}
generateSitemap();
