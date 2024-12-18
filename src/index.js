import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import BlogList from "./components/blog/BlogList";
import Login from "./components/authentication/Login";
import BlogDetail from "./components/blog/BlogDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateMember from "./components/account/UpdateMember";
import MyProduct from "./components/account/MyProduct";
import AddProduct from "./components/account/AddProduct";
import WelcomeAccount from "./components/account/WelcomeAccount";
import EditProduct from "./components/account/EditProduct";
import ProductHome from "./components/home/ProductHome";
import ProductDetail from "./components/home/ProductDetail";
import Cart from "./components/home/Cart";
import CartProductContext from "./context/CartContext";
import WishList from "./components/home/WishList";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
     <CartProductContext>
     <App>
        <ToastContainer />
        <Routes>
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/updateMember" element={<UpdateMember />} />
          <Route path="/myProduct" element={<MyProduct />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/myAccount" element={<WelcomeAccount />} />
          <Route path="/editProduct/:id" element={<EditProduct />} />
          <Route path="/productHome" element={<ProductHome />} />
          <Route path="/productDetail/:id" element={<ProductDetail />} />
          <Route path="/carts" element={<Cart />} />
          <Route path="/wishList" element={<WishList />} />
        </Routes>
      </App>
     </CartProductContext>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
