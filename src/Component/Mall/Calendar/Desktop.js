import React from "react";

function Desktop(props) {
  return (
    <div className="w-5/6 mx-auto">
      <div className="hidden lg:grid grid-cols-7 border-t gap-y-1 gap-x-0 bg-white">
        {props.dates.map((date, idx) => (
          <div
            className={`text-center py-2 border-b  ${
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
      <div className="hidden lg:grid grid-cols-7 gap-y-1 gap-x-0 pt-1 border-b">
        {props.before.length > 0 && (
          <>
            {props.before.map((date, idx) => (
              <div
                className="bg-gray-100 text-gray-100 border-b  border-gray-100 h-24 p-1"
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
                className={`bg-white h-24 p-1 ${
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
              <div className="bg-white h-24 p-1" key={idx} data={date}></div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Desktop;
