import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

function EmployDetail() {
  const { jid } = useParams();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const thisLocation = useLocation();

  useEffect(() => {
    console.log(jid);
    //eslint-disable-next-line
  }, [thisLocation]);

  return <div>{jid}</div>;
}

export default EmployDetail;
