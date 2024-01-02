import React from "react";
import { Link } from "react-router-dom";

//import coffee from "../../Asset/subContent/starbucks.png"; //여름
import coffee from "../../Asset/subContent/coffee2.png"; //겨울
import chicol from "../../Asset/subContent/chicol.png";
import ticket from "../../Asset/subContent/ticket.png";

function SubContent() {
  return (
    <div className="lg:container mx-auto px-2 lg:px-0 py-2 grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 pt-4 rounded-lg flex flex-col justify-center overflow-hidden relative group">
        <Link to="/list/1" className="z-40">
          <div className="text-center lg:text-left lg:text-xl mb-1">
            추운 겨울 따뜻하게 보내세요
          </div>
          <div className="text-center lg:text-left text-3xl lg:text-4xl mb-5 text-yellow-300 font-neoextra">
            커피 한 잔 어떠세요?
          </div>
          <div className="text-center lg:text-right relative pb-2">
            <img
              src={coffee}
              alt="커피"
              className="transition duration-500 inline-block group-hover:animate-bounce"
            />
          </div>
        </Link>
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 lg:left-full lg:-translate-x-64 w-72 h-72 lg:h-80 lg:w-80 bg-blue-50 rounded-full z-10"></div>
        <div className="absolute hidden lg:block w-28 h-28 rounded-full bg-green-100 z-0 left-12 bottom-5"></div>
        <div className="absolute w-24 h-24 rounded-full bg-rose-200 z-0 -right-10 top-36 lg:right-2 lg:top-12"></div>
        <div className="absolute hidden lg:block w-20 h-20 rounded-0 rotate-12 bg-sky-200 z-0 left-56 bottom-20"></div>
        <div className="absolute hidden lg:block w-10 h-10 rounded-0 rotate-45 bg-orange-200 z-0 left-36 bottom-30"></div>
        <div className="absolute w-12 h-12 rounded-lg rotate-12 bg-teal-200 lg:bg-pink-200 z-0 right-5 lg:left-1/2 top-28"></div>
        <div className="absolute w-24 h-12 rounded-full rotate-45 lg:-rotate-45 bg-violet-200 z-0 lg:left-5 -left-5 bottom-48 lg:bottom-44"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-gradient-to-bl from-green-500 to-green-700 text-white px-2 pt-4  rounded-lg relative  flex-col justify-center  overflow-hidden hidden lg:flex group">
          <Link to="/list/5" className="z-40">
            <div className="text-center lg:text-left lg:text-xl mb-1">
              오늘 저녁엔 맛있는
            </div>
            <div className="text-center lg:text-left text-3xl lg:text-4xl mb-5 text-yellow-300 font-neoextra">
              치킨에 콜라!
            </div>
            <div className="text-center lg:text-right relative z-40 pb-2">
              <img
                src={chicol}
                alt="치킨콜라"
                className="transition duration-500 inline-block group-hover:animate-bounce"
              />
            </div>
          </Link>
          <div className="absolute hidden lg:block -bottom-24 left-1/2 -translate-x-1/2 lg:left-full lg:-translate-x-64 w-72 h-72 lg:h-80 lg:w-80 bg-blue-50 rounded-full z-0"></div>
        </div>
        <div className="bg-gradient-to-t from-violet-400 to-violet-500 text-white px-2 pt-4  rounded-lg relative  flex-col justify-center overflow-hidden hidden lg:flex group">
          <Link to="/list/7" className="z-40">
            <div className="text-center lg:text-left lg:text-xl mb-1">
              마음에 여유를 드려요
            </div>
            <div className="text-center lg:text-left text-3xl lg:text-4xl mb-5 text-yellow-300 font-neoextra">
              문화생활코너
            </div>
            <div className="text-center lg:text-right relative z-40 pb-2">
              <img
                src={ticket}
                alt="영화/음악/도서티켓"
                className="transition duration-500 inline-block group-hover:animate-bounce"
              />
            </div>
          </Link>
          <div className="absolute hidden lg:block -bottom-24 left-1/2 -translate-x-1/2 lg:left-full lg:-translate-x-64 w-72 h-72 lg:h-80 lg:w-80 bg-blue-50 rounded-full z-0"></div>
        </div>

        <div className="bg-gradient-to-bl from-green-500 to-green-700 text-white px-2 py-2  rounded-lg relative h-20 overflow-hidden lg:hidden group flex flex-col justify-center">
          <Link to="/list/5" className="z-40  grid grid-cols-2">
            <div className="flex flex-col justify-center gap-0">
              <div className="text-left text-sm font-neo">
                오늘 저녁엔 맛있는
              </div>
              <div className="text-left text-xl font-neoextra">
                치킨에 콜라!
              </div>
            </div>
            <div className="text-center lg:text-right relative z-40 pb-2 h-full">
              <img
                src={chicol}
                alt="치콜은 치킨콜라의 약자"
                className="transition duration-500 inline-block h-16 w-16 absolute right-2 top-1/2 -translate-y-1/2"
              />
            </div>
          </Link>
          <div className="absolute hidden lg:block -bottom-24 left-1/2 -translate-x-1/2 lg:left-full lg:-translate-x-64 w-72 h-72 lg:h-80 lg:w-80 bg-blue-50 rounded-full z-0"></div>
        </div>

        <div className="bg-gradient-to-l from-violet-400 to-violet-500 text-white px-2 py-2  rounded-lg relative h-20 overflow-hidden lg:hidden group flex flex-col justify-center">
          <Link to="/list/7" className="z-40  grid grid-cols-2">
            <div className="flex flex-col justify-center gap-0">
              <div className="text-left text-sm font-neo">
                마음에 여유를 드려요
              </div>
              <div className="text-left text-xl font-neoextra">
                문화생활코너
              </div>
            </div>
            <div className="text-center lg:text-right relative z-40 pb-2 h-full">
              <img
                src={ticket}
                alt="영화/음악/도서티켓"
                className="transition duration-500 inline-block h-16 w-16 absolute right-2 top-1/2 -translate-y-1/2"
              />
            </div>
          </Link>
          <div className="absolute hidden lg:block -bottom-24 left-1/2 -translate-x-1/2 lg:left-full lg:-translate-x-64 w-72 h-72 lg:h-80 lg:w-80 bg-blue-50 rounded-full z-0"></div>
        </div>
      </div>
    </div>
  );
}

export default SubContent;
