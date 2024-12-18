import React, { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { api } from "../api";
import { toast } from "react-toastify";

export const CartContext = createContext();

function CartProductContext(props) {
  const [cart, setCart] = useState({}); //Lưu trữ thông tin của tất cả product cart của tất cả account chứ không chỉ mỗi một account nhất định
  const [idAuth, setIdAuth] = useState(""); //Lưu trữ id của account hiện tại
  const [totalQty, setTotalQty] = useState(0); // Lưu trữ tổng số lượng sản phẩm trong giỏ hàng



  useEffect(() => {
    const getAuth = localStorage.getItem("auth");
    handlePostCartFromLocal();

    if (getAuth) {
      setIdAuth(JSON.parse(getAuth).id);
    }
  }, []); // Lấy idAuth khi component lần đầu render

  // Lọc product theo id_Auth
  const filterProductFollowAccount = Object.values(cart).filter((productFollow) => productFollow.qty.id_account === idAuth);

  const getCartFromLocal = JSON.parse(localStorage.getItem("Purchased")); //Lấy data cart từ local xuống

  //Hàm gọi API để post data Purchased lấy từ local xuống
  const handlePostCartFromLocal = () => {
    if (!getCartFromLocal) {
      toast.error("không có data của cart từ local nên không product không được render!");
      return; // Return early
    }else{
    api
      .post("product/cart", getCartFromLocal)
      .then((res) => {
        const cartAPI = res.data.data;
        setCart(cartAPI);
      })
      .catch((err) => {
        toast.error(err);
      });
  };
};

    //Hàm tính tổng qty trong cart
    useEffect( () => {
      let total = 0;
      filterProductFollowAccount.forEach((pro) => (total += pro.qty.qty ));
      setTotalQty(total);
    },[cart,filterProductFollowAccount]);

  return (
    <CartContext.Provider value={{ cart, setCart, filterProductFollowAccount, getCartFromLocal, handlePostCartFromLocal,totalQty}}>
      {props.children}
    </CartContext.Provider>
  );
}
export default CartProductContext;

export const useCart = () => {
  return useContext(CartContext);
};
