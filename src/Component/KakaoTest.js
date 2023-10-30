import React, { useState } from "react";

function KakaoTest() {
  const [page, setPage] = useState("");
  const [size, setSize] = useState("");

  return (
    <div className="container mx-auto">
      <form action="/api/v1/shop/goods/list" method="post">
        <input
          type="text"
          className="m-2 p-2 border"
          id="page"
          name="page"
          value={page}
          onChange={e => setPage(Number(e.currentTarget.value))}
        />
        <input
          type="text"
          className="m-2 p-2 border"
          id="size"
          name="size"
          value={size}
          onChange={e => setSize(Number(e.currentTarget.value))}
        />
        <button type="submit" className="bg-green-500 p-2 text-white">
          후아
        </button>
      </form>
    </div>
  );
}

export default KakaoTest;
