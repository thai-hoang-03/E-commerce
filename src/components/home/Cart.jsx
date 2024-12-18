import { useEffect, useState } from "react";
import { api, urlImage } from "../../api";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";

function Cart() {
  const { setCart, filterProductFollowAccount, getCartFromLocal, handlePostCartFromLocal } = useCart(); // dùng useContext

  // const getCartFromLocal = JSON.parse(localStorage.getItem("Purchased")); //Lấy data cart từ local xuống
  // console.log({ getCartFromLocal });

  // const [idAuth, setIdAuth] = useState(""); //Lưu trữ id của account hiện tại
  // console.log({idAuth});

  // const [cart, setCart] = useState({}); //Lưu trữ thông tin của tất cả product cart của tất cả account chứ không chỉ mỗi một account nhất định
  // console.log({cart});

  // useEffect( () => {
  //     const getAuth =  localStorage.getItem("auth");
  //     if(getAuth){
  //         setIdAuth(JSON.parse(getAuth).id);
  //     };
  // },[]);

  // //Hàm gọi API để post data Purchased lấy từ local xuống
  // const handlePostCartFromLocal = () => {
  //   if (getCartFromLocal) {
  //     api
  //       .post("product/cart", getCartFromLocal)
  //       .then((res) => {
  //         const cartAPI = res.data.data;
  //         setCart(cartAPI);
  //       })
  //       .catch((err) => {
  //         toast.error(err);
  //       });
  //   } else {
  //     toast.error("không có data của cart từ local nên không product không được render!");
  //   }
  // };

  // useEffect(() => {
  //   handlePostCartFromLocal();
  // }, []);

  //Hàm tính giá tổng trong cart
  const handlePriceTotal = () => {
    let total = 0;

   filterProductFollowAccount.forEach((pro) => (total += pro.price * pro.qty.qty));

    return total;
  };

  //Hàm xử lý khi tăng số lượng qty
  const handleIncreaseQty = (idProductChild) => {
    if (getCartFromLocal[idProductChild]) {
      getCartFromLocal[idProductChild].qty = getCartFromLocal[idProductChild].qty + 1;
    }

    localStorage.setItem("Purchased", JSON.stringify(getCartFromLocal)); //Đưa lên local lại
    handlePostCartFromLocal(); //Gọi lại hàm xử lý để thực hiện post lại
  };

  //Hàm xử lý khi giảm số lượng qty
  const handleReduceQty = (idProductChild) => {
    if (getCartFromLocal[idProductChild]) {
      getCartFromLocal[idProductChild].qty = getCartFromLocal[idProductChild].qty - 1;
    }
    localStorage.setItem("Purchased", JSON.stringify(getCartFromLocal)); //Đưa lên local lại

    if (getCartFromLocal[idProductChild].qty < 1) {
      delete getCartFromLocal[idProductChild];
    }
    localStorage.setItem("Purchased", JSON.stringify(getCartFromLocal)); //Đưa lên local lại
    handlePostCartFromLocal(); //Gọi lại hàm xử lý để thực hiện post lại
  };

  // *********
  //Hàm xử lý khi xoá product trong cart
  const handleDeleteProduct = (id, name) => {
    if (getCartFromLocal[id]) {
      delete getCartFromLocal[id];
    }
    localStorage.setItem("Purchased", JSON.stringify(getCartFromLocal)); //Đưa lên local lại
    toast.success(`${name} đã được xoá khỏi Cart`);
    handlePostCartFromLocal(); //Gọi lại hàm xử lý để thực hiện post lại
  };

  // // Lọc product theo id_Auth
  // const filterProductFollowAccount = Object.values(cart).filter((productFollow) => productFollow.qty.id_account === idAuth);
  // console.log({filterProductFollowAccount});

  return (
    <>
      <section id="cart_items">
        <div className="container">
          <div className="breadcrumbs">
            <ol className="breadcrumb">
              <li>
                <a href="#">Home</a>
              </li>
              <li className="active">Shopping Cart</li>
            </ol>
          </div>

          <div className="table-responsive cart_info">
            <table className="table table-condensed">
              <thead>
                <tr className="cart_menu">
                  <td className="image">Item</td>
                  <td className="description"></td>
                  <td className="price">Price</td>
                  <td className="quantity">Quantity</td>
                  <td className="total">Total</td>
                  <td></td>
                </tr>
              </thead>

              <tbody>
                {filterProductFollowAccount.length &&
                  filterProductFollowAccount.map((productChild) => {
                    console.log({ productChild });
                    const idUser = productChild.id_user;
                    const getImage = JSON.parse(productChild.image);
                    const firstImage = getImage[0];
                    return (
                      <>
                        <tr>
                          <td className="cart_product">
                            <a href="">
                              <img src={`${urlImage}/product/${idUser}/${firstImage}`} />
                            </a>
                          </td>
                          <td className="cart_description">
                            <h4>
                              <a href="">{productChild.name}</a>
                            </h4>
                            {/* <p>Web ID: 1089772</p> */}
                          </td>
                          <td className="cart_price">
                            <p>{productChild.price}$</p>
                          </td>
                          <td className="cart_quantity">
                            <div className="cart_quantity_button">
                              <a className="cart_quantity_up" onClick={() => handleIncreaseQty(productChild.id)}>
                               
                                +{" "}
                              </a>
                              <input
                                className="cart_quantity_input"
                                type="text"
                                name="quantity"
                                value={productChild.qty.qty}
                                autocomplete="off"
                                size="2"
                              />
                              <a className="cart_quantity_down" onClick={() => handleReduceQty(productChild.id)}>
                                {" "}
                                -{" "}
                              </a>
                            </div>
                          </td>
                          <td className="cart_total">
                            <p className="cart_total_price">{productChild.price * productChild.qty.qty}$</p>
                          </td>
                          <td className="cart_delete" onClick={() => handleDeleteProduct(productChild.id, productChild.name)}>
                            <a className="cart_quantity_delete" href="#">
                              <i className="fa fa-times"></i>
                            </a>
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>

            <div class="oke">
              <div class="totall">Total</div>
              <h3>{handlePriceTotal()}$</h3>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Cart;
