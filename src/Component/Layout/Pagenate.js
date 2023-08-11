import React from "react";
import { Link } from "react-router-dom";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

function Pagenate(props) {
  return (
    <>
      {props.pagenate.length > 0 && (
        <div className="flex flex-row justify-center gap-3 my-5">
          {props.page > 1 && (
            <Link
              to={`${props.pathName}?page=1`}
              className="transition duration-300 ease-in-out pageButton hover:scale-110 hidden xl:block"
            >
              <FaAngleDoubleLeft size={20} />
            </Link>
          )}

          {props.page > 1 && (
            <Link
              to={`${props.pathName}?page=${props.page - 1}`}
              className="transition duration-300 ease-in-out pageButton hover:scale-110"
            >
              <FaAngleLeft size={20} />
            </Link>
          )}
          <div className="grid grid-cols-5 gap-3">
            {props.pagenate.map((pageNum, idx) => (
              <Link
                to={`${props.pathName}?page=${pageNum}`}
                key={idx}
                className={`transition duration-300 ease-in-out pageButton hover:scale-110 ${
                  props.page === pageNum ? "selectedPage" : null
                }`}
              >
                <span>{pageNum}</span>
              </Link>
            ))}
          </div>
          {props.page < props.totalPage && (
            <Link
              to={`${props.pathName}?page=${props.page + 1}`}
              className="transition duration-300 ease-in-out pageButton hover:scale-110"
            >
              <FaAngleRight size={20} />
            </Link>
          )}
          {props.page < props.totalPage && (
            <Link
              to={`${props.pathName}?page=${props.totalPage}`}
              className="transition duration-300 ease-in-out pageButton hover:scale-110 hidden xl:block"
            >
              <FaAngleDoubleRight size={20} />
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default Pagenate;
