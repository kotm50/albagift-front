import React from "react";

function Mobile(props) {
  return (
    <>
      <div className="xl:hidden grid grid-cols-7 border-y gap-y-2 gap-x-0 text-sm">
        {props.dates.map((date, idx) => (
          <div
            className={`text-center py-2 ${
              idx === 0
                ? "text-orange-500"
                : idx === 6
                ? "text-blue-500"
                : "border-gray-300"
            }`}
            key={idx}
          >
            {date}
          </div>
        ))}
      </div>
      <div className="xl:hidden grid grid-cols-7 gap-y-2 gap-x-0 pt-1 text-sm">
        {props.before.length > 0 && (
          <>
            {props.before.map((date, idx) => (
              <div
                className="bg-gray-100 text-gray-100  border-gray-100 h-16 p-1"
                key={idx}
              >
                {date}
              </div>
            ))}
          </>
        )}
        {props.fullDate.length > 0 && (
          <>
            {props.fullDate.map((date, idx) => (
              <div
                className={`bg-white-100 h-16 p-1 ${
                  date.date === "일"
                    ? "text-orange-500"
                    : date.date === "토"
                    ? "text-blue-500"
                    : null
                }`}
                key={idx}
              >
                {date.day}
              </div>
            ))}
          </>
        )}
        {props.after.length > 0 && (
          <>
            {props.after.map((date, idx) => (
              <div
                className="bg-gray-100 text-gray-100 border-gray-100 h-16 p-1"
                key={idx}
              >
                {date}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default Mobile;
