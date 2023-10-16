import React from "react";

function Desktop(props) {
  return (
    <>
      <div className="hidden xl:grid grid-cols-7 gap-2 mb-2">
        {props.dates.map((date, idx) => (
          <div
            className={`text-center rounded-lg ${
              idx === 0
                ? "border border-orange-500 bg-orange-500 text-white"
                : idx === 6
                ? "border border-blue-500 bg-blue-500 text-white"
                : "border border-gray-300"
            }`}
            key={idx}
          >
            {date}
          </div>
        ))}
      </div>
      <div className="hidden xl:grid grid-cols-7 gap-2">
        {props.before.length > 0 && (
          <>
            {props.before.map((date, idx) => (
              <div
                className="bg-gray-100 text-gray-100 rounded-lg border border-gray-100"
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
                className={`bg-white-100 rounded-lg p-2 border shadow-sm ${
                  date.date === "일"
                    ? "border-orange-300"
                    : date.date === "토"
                    ? "border-blue-300"
                    : null
                }`}
                key={idx}
              >
                {date.day}/{date.date}요일
              </div>
            ))}
          </>
        )}
        {props.after.length > 0 && (
          <>
            {props.after.map((date, idx) => (
              <div
                className="bg-gray-100 text-gray-100 border-gray-100"
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

export default Desktop;
