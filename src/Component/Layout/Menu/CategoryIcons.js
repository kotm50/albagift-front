import React from "react";
import {
  FaCoffee,
  FaBreadSlice,
  FaBabyCarriage,
  FaIceCream,
  FaPizzaSlice,
  FaCut,
} from "react-icons/fa";
import { MdLocalConvenienceStore, MdRestaurant, MdMovie } from "react-icons/md";
import { LuShoppingBag } from "react-icons/lu";
function CategoryIcons(props) {
  return (
    <span className="categoryIcons">
      {props.num === 1 ? (
        <FaCoffee size={24} />
      ) : props.num === 2 ? (
        <FaBreadSlice size={24} />
      ) : props.num === 3 ? (
        <FaIceCream size={24} />
      ) : props.num === 4 ? (
        <MdLocalConvenienceStore size={24} />
      ) : props.num === 5 ? (
        <FaPizzaSlice size={24} />
      ) : props.num === 6 ? (
        <MdRestaurant size={24} />
      ) : props.num === 7 ? (
        <MdMovie size={24} />
      ) : props.num === 9 ? (
        <FaCut size={24} />
      ) : props.num === 10 ? (
        <FaBabyCarriage size={24} />
      ) : (
        <LuShoppingBag size={24} />
      )}
    </span>
  );
}

export default CategoryIcons;
