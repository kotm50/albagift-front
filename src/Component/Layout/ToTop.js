import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { AiOutlineArrowUp } from "react-icons/ai";

function ToTop() {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const thisLocation = useLocation();

  useEffect(() => {
    setIsOpen(true);

    const handleShowButton = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleShowButton);
    return () => {
      window.removeEventListener("scroll", handleShowButton);
    };

    // eslint-disable-next-line
  }, [thisLocation]);

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isOpen ? (
        <>
          {showButton && (
            <button
              className="animate-bounce fixed p-2 drop-shadow-lg bottom-5 right-5 bg-white hover:bg-indigo-500 hover:text-white border border-gray-200 hover:border-0 rounded-full"
              onClick={scrollToTop}
            >
              <AiOutlineArrowUp />
            </button>
          )}
        </>
      ) : null}
    </>
  );
}

export default ToTop;
