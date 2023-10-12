import dompurify from "dompurify";

function AlertModal(props) {
  const sanitizer = dompurify.sanitize;
  return (
    <div id="alertmodal" className="max-w-screen p-4 bg-white border">
      <div
        className={`px-4 py-10 bg-white border grid grid-cols-1 gap-y-3 ${
          props.type === "alert" ? "border-gray-200" : "border-sky-200"
        }`}
      >
        <h1
          className={`font-neoextra text-lg ${
            props.type === "alert" ? "text-rose-500" : "text-sky-500"
          }`}
        >
          {props.title}
        </h1>
        <p
          dangerouslySetInnerHTML={{
            __html: sanitizer(props.message).replace(/\n/g, "<br>"),
          }}
        />
        {props.type === "confirm" ? (
          <div className="grid grid-cols-2 gap-x-2">
            <button
              onClick={() => {
                if (props.doIt) props.doIt();
                props.onClose();
              }}
              className="border border-sky-500 bg-sky-500 text-white p-2"
            >
              {props.yes}
            </button>
            <button
              onClick={() => {
                if (props.doNot) props.doNot();
                props.onClose();
              }}
              className="border border-gray-500 text-gray-500 p-2"
            >
              {props.no}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1">
            <button
              onClick={() => {
                if (props.doIt) props.doIt();
                props.onClose();
              }}
              className="border border-sky-500 bg-sky-500 text-white p-2"
            >
              {props.yes}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertModal;
