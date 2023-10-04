import React, { useState, useEffect } from "react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 초기화 후에 db 객체 가져오기

function Transfer() {
  const [applies, setApplies] = useState([]);

  useEffect(() => {
    getApply();
    //eslint-disable-next-line
  }, []);

  const getApply = async () => {
    setApplies([]);
    const applyCollectionRef = collection(db, "apply"); // 'apply' 컬렉션의 참조 가져오기

    try {
      const snapshot = await getDocs(applyCollectionRef); // 컬렉션의 모든 문서 스냅샷 가져오기
      const documents = []; // 문서를 저장할 배열

      snapshot.forEach(doc => {
        doc.data().docId = doc.id;
        let docData = doc.data();
        docData.docId = doc.id;
        documents.push(docData); // 문서 데이터를 배열에 추가
      });

      setApplies(documents);
    } catch (error) {
      console.error("문서 수를 가져오는 동안 오류 발생:", error);
    }
  };

  const formatPhoneNumber = phoneNumber => {
    if (phoneNumber && phoneNumber.length === 11) {
      const formattedNumber = phoneNumber.replace(
        /(\d{3})(\d{4})(\d{4})/,
        "$1-$2-$3"
      );
      return formattedNumber;
    }
    return phoneNumber;
  };
  return (
    <div>
      {applies.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-2 mt-2 bg-white p-2">
          {applies.map((apply, idx) => (
            <div key={idx}>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="font-medium flex flex-col justify-center text-right">
                  이름
                </div>
                <div className="font-normal col-span-2 flex flex-col justify-center">
                  {apply.name}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="font-medium flex flex-col justify-center text-right">
                  연락처
                </div>
                <div className="font-normal col-span-2 flex flex-col justify-center">
                  {formatPhoneNumber(apply.phone)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="font-medium flex flex-col justify-center text-right">
                  포인트
                </div>
                <div
                  className="font-normal col-span-2 flex flex-col justify-center"
                  title={apply.point}
                >
                  {apply.point} point
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Transfer;
