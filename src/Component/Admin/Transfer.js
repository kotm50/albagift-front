import React, { useState, useEffect } from "react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 초기화 후에 db 객체 가져오기

import { useSelector } from "react-redux";

import Apply from "./Apply";

function Transfer() {
  const user = useSelector(state => state.user);
  const [applies, setApplies] = useState([]);
  const [applies2, setApplies2] = useState([]);
  const [applies3, setApplies3] = useState([]);

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
      const documents2 = []; // 문서를 저장할 배열
      const documents3 = []; // 문서를 저장할 배열

      snapshot.forEach(doc => {
        doc.data().docId = doc.id;
        if (
          doc.data().name !== null &&
          doc.data().name !== undefined &&
          doc.data().name !== ""
        ) {
          if (
            doc.data().phone !== null &&
            doc.data().phone !== undefined &&
            doc.data().phone !== ""
          ) {
            let docData = {};
            docData.protoName = doc.data().name;
            docData.protoPhone = doc.data().phone;
            docData.protoPoint = doc.data().point;
            docData.uid = doc.data().uid;
            // 중복 체크를 위한 플래그
            let isDuplicate = false;

            // 배열에서 중복 체크
            documents.forEach(existingDoc => {
              if (
                existingDoc.protoName === docData.protoName &&
                existingDoc.protoPhone === docData.protoPhone
              ) {
                isDuplicate = true;
                return; // 중복된 경우 추가하지 않고 반복문을 빠져나갑니다.
              }
            });

            // 중복되지 않았을 때만 배열에 추가
            if (!isDuplicate) {
              if (documents.length < 50) {
                documents.push(docData);
              } else if (documents2.length < 50) {
                documents2.push(docData);
              } else {
                documents3.push(docData); // 문서 데이터를 배열에 추가
              }
            }
          }
        }
      });
      console.log(documents.length);
      console.log(documents2.length);
      console.log(documents3.length);
      console.log(documents);
      setApplies(documents);
      setApplies2(documents2);
      setApplies3(documents3);
    } catch (error) {
      console.error("문서 수를 가져오는 동안 오류 발생:", error);
    }
  };

  return (
    <div className="container mx-auto text-center mt-2">
      {applies.length > 0 && (
        <Apply
          applies={applies}
          applies2={applies2}
          applies3={applies3}
          user={user}
        />
      )}
    </div>
  );
}

export default Transfer;
