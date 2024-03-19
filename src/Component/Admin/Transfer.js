import React, { useState, useEffect } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 초기화 후에 db 객체 가져오기

import { useSelector } from "react-redux";

import Apply from "./Apply";
import axiosInstance from "../../Api/axiosInstance";

function Transfer() {
  const user = useSelector(state => state.user);
  const [applies, setApplies] = useState([]);
  const [applies2, setApplies2] = useState([]);
  const [applies3, setApplies3] = useState([]);

  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    getApply();
    getCoupon();
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
      const total = [];

      snapshot.forEach(doc => {
        if (doc.data().orderN) doc.data().docId = doc.id;
        if (
          doc.data().uid !== null &&
          doc.data().uid !== undefined &&
          doc.data().uid !== ""
        ) {
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
              if (Number(doc.data().point) > 0) {
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
                  total.push(docData);
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
          }
        }
      });
      setApplies(documents);
      setApplies2(documents2);
      setApplies3(documents3);
    } catch (error) {
      console.error("문서 수를 가져오는 동안 오류 발생:", error);
    }
  };

  const getCoupon = async () => {
    setCoupons([]);
    const couponCollectionRef = collection(db, "gifttrade"); // 'coupon' 컬렉션의 참조 가져오기
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const q = query(couponCollectionRef, where("limitDate", ">", startOfToday));

    try {
      const querySnapshot = await getDocs(q); // 컬렉션의 모든 문서 스냅샷 가져오기
      const documents = []; // 문서를 저장할 배열

      for (const doc of querySnapshot.docs) {
        const docData = doc.data();
        const inputDoc = {};
        const isUsable = await chkCoupon(docData.trId);
        if (isUsable) {
          inputDoc.trId = docData.trId;
          inputDoc.phone = docData.phone;
          inputDoc.orderNo = docData.orderNo;
          inputDoc.pinNo = docData.pinNo;
          inputDoc.goodsCode = docData.goodsCode;
          inputDoc.goodsName = docData.goodsName;
          inputDoc.couponImgUrl = docData.couponImgUrl;
          inputDoc.goodsImgB = docData.goodsImgB;
          inputDoc.limitDate = await timestampToDate(docData.limitDate);
          documents.push(inputDoc);
        }
      }

      setCoupons(documents);
    } catch (error) {
      console.error("문서 수를 가져오는 동안 오류 발생:", error);
    }
  };

  const timestampToDate = timestamp => {
    const date = timestamp.toDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.00`;
  };
  const chkCoupon = async c => {
    const data = {
      trId: c,
    };
    try {
      const response = await axiosInstance.post(
        "/api/v1/shop/goods/coupons",
        data,
        {
          headers: { Authorization: user.accessToken },
        }
      );
      if (response.data.couponDetail.pinStatusCd === "01") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const updateCoupon = async () => {
    let data = {
      couponList: coupons,
    };
    await axiosInstance
      .post("/api/v1/shop/proto/coupon", data, {
        headers: { Authorization: user.accessToken },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      })
      .then(res => {
        return true;
      })
      .catch(e => {
        console.log(e);
      });
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
      {coupons.length > 0 && (
        <>
          <div className="p-2 text-center mb-2">
            사용가능 쿠폰 총 {coupons.length}개<br />
            <br />
            <button
              className="bg-green-500 hover:bg-green-700 p-2"
              onClick={updateCoupon}
            >
              입력하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Transfer;
