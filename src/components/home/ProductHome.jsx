import { useEffect, useState } from "react";
import { api, urlImage } from "../../api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";

function ProductHome() {
  const {totalQty} = useCart(); // dùng useContext
  const [allProduct, setAllProduct] = useState({});
  console.log({ allProduct });

  const [idProductWishList, setIdProductWishList] = useState([]); //Lưu trữ id của những product mà user đã add to wishlist
  console.log({ idProductWishList });

  //Hàm xử lý gọi API lấy tất cả data của product ra
  const handleFetchAllProduct = () => {
    api
      .get("product")
      .then((res) => {
        if (res.data.data) {
          setAllProduct(res.data.data);
        }
      })

      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    handleFetchAllProduct();

    // Lấy wishlist từ localStorage khi component render lần đầu
    const getWishList = localStorage.getItem("WishList");
    const dataWishList = getWishList ? JSON.parse(getWishList) : [];
    setIdProductWishList(dataWishList);
  }, []);

  useEffect(() => {
    if (idProductWishList.length > 0) {
      localStorage.setItem("WishList", JSON.stringify(idProductWishList)); //set id của những product mà user chọn vào local
    }
  }, [idProductWishList]);

  //Hàm xử lý khi click vào add-to-cart
  const handleClickAddToCart = (product) => {
    //Lấy cart product và auth từ local xuống
    const getPurchased = localStorage.getItem("Purchased");
    const cart = getPurchased ? JSON.parse(getPurchased) : {};
    const getAuth = localStorage.getItem("auth");
    const id_account = getAuth ? JSON.parse(getAuth).id : null;

    if (cart[product.id]) {
      // Sản phẩm đã tồn tại thì tăng qty lên 1 và cập nhật id_account theo account hiện tại
      cart[product.id].qty += 1;
      if (cart[product.id].id_account !== id_account) {
        cart[product.id].id_account = id_account;
      }
    } else {
      cart[product.id] = {
        ...product,
        qty: 1,
        id_account: id_account,
      };
    }

    localStorage.setItem("Purchased", JSON.stringify(cart));
  };

  //Hàm xử lý khi user click add to wishlist
  const handleAddToWishList = (idProduct, nameProduct) => {
    setIdProductWishList((prev) => {
      if (!prev.includes(idProduct)) {
        const updateWishList = [...prev, idProduct];
        toast.success(`Thêm ${nameProduct} vào wishlist thành công `);
        return updateWishList;
      } else {
        toast.info(`${nameProduct} đã có trong wishlist`);
        return prev;
      }
    });
  };

  return (
    <div class="col-sm-9 padding-right">
      <div class="features_items">
        <h2 class="title text-center">Features Items</h2>

        {Object.values(allProduct).map((product) => {
          const idUser = product.id_user;
          const getImage = JSON.parse(product.image);
          const firstImage = getImage[0];
          console.log({ product });
          return (
            <div key={product.id} class="col-sm-4">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src={`${urlImage}/product/${idUser}/${firstImage}`} alt="" />
                    <h2>{product.price}$</h2>
                    <p>{product.name}</p>
                    {/* <a href="#" class="btn btn-default add-to-cart">
                          <i class="fa fa-shopping-cart"></i>Add to cart
                        </a> */}
                  </div>
                  <div class="product-overlay">
                    <div class="overlay-content">
                      <h2>{product.price}$</h2>
                      <p>{product.name}</p>
                      <a
                        class="btn btn-default add-to-cart"
                        onClick={() => {
                          toast.success(`${product.name} đã được thêm vào Cart`);
                          handleClickAddToCart(product);
                        }}
                      >
                        <i class="fa fa-shopping-cart"></i>Add to cart
                        <div className="productNumber">{totalQty}</div>
                      </a>
                      <Link to={"/productDetail/" + product.id}>
                        <a class="btn btn-default add-to-cart">Detail</a>
                      </Link>
                    </div>
                  </div>
                </div>
                <div class="choose">
                  <ul class="nav nav-pills nav-justified">
                    <li>
                      <a onClick={() => handleAddToWishList(product.id, product.name)} className="wishlist">
                        <i class="fa fa-plus-square"></i>Add to wishlist
                        {/* <div className="wishNumber">{idProductWishList.length}</div> */}
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i class="fa fa-plus-square"></i>Add to compare
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div class="category-tab">
        <div class="col-sm-12">
          <ul class="nav nav-tabs">
            <li class="active">
              <a href="#tshirt" data-toggle="tab">
                T-Shirt
              </a>
            </li>
            <li>
              <a href="#blazers" data-toggle="tab">
                Blazers
              </a>
            </li>
            <li>
              <a href="#sunglass" data-toggle="tab">
                Sunglass
              </a>
            </li>
            <li>
              <a href="#kids" data-toggle="tab">
                Kids
              </a>
            </li>
            <li>
              <a href="#poloshirt" data-toggle="tab">
                Polo shirt
              </a>
            </li>
          </ul>
        </div>
        <div class="tab-content">
          <div class="tab-pane fade active in" id="tshirt">
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery1.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery2.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery3.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery4.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="blazers">
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery4.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery3.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery2.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery1.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="sunglass">
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery3.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery4.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery1.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery2.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="kids">
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery1.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery2.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery3.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery4.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="poloshirt">
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery2.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery4.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery3.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="product-image-wrapper">
                <div class="single-products">
                  <div class="productinfo text-center">
                    <img src="images/home/gallery1.jpg" alt="" />
                    <h2>$56</h2>
                    <p>Easy Polo Black Edition</p>
                    <a href="#" class="btn btn-default add-to-cart">
                      <i class="fa fa-shopping-cart"></i>Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="recommended_items">
        <h2 class="title text-center">recommended items</h2>

        <div id="recommended-item-carousel" class="carousel slide" data-ride="carousel">
          <div class="carousel-inner">
            <div class="item active">
              <div class="col-sm-4">
                <div class="product-image-wrapper">
                  <div class="single-products">
                    <div class="productinfo text-center">
                      <img src="images/home/recommend1.jpg" alt="" />
                      <h2>$56</h2>
                      <p>Easy Polo Black Edition</p>
                      <a href="#" class="btn btn-default add-to-cart">
                        <i class="fa fa-shopping-cart"></i>Add to cart
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="product-image-wrapper">
                  <div class="single-products">
                    <div class="productinfo text-center">
                      <img src="images/home/recommend2.jpg" alt="" />
                      <h2>$56</h2>
                      <p>Easy Polo Black Edition</p>
                      <a href="#" class="btn btn-default add-to-cart">
                        <i class="fa fa-shopping-cart"></i>Add to cart
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="product-image-wrapper">
                  <div class="single-products">
                    <div class="productinfo text-center">
                      <img src="images/home/recommend3.jpg" alt="" />
                      <h2>$56</h2>
                      <p>Easy Polo Black Edition</p>
                      <a href="#" class="btn btn-default add-to-cart">
                        <i class="fa fa-shopping-cart"></i>Add to cart
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="col-sm-4">
                <div class="product-image-wrapper">
                  <div class="single-products">
                    <div class="productinfo text-center">
                      <img src="images/home/recommend1.jpg" alt="" />
                      <h2>$56</h2>
                      <p>Easy Polo Black Edition</p>
                      <a href="#" class="btn btn-default add-to-cart">
                        <i class="fa fa-shopping-cart"></i>Add to cart
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="product-image-wrapper">
                  <div class="single-products">
                    <div class="productinfo text-center">
                      <img src="images/home/recommend2.jpg" alt="" />
                      <h2>$56</h2>
                      <p>Easy Polo Black Edition</p>
                      <a href="#" class="btn btn-default add-to-cart">
                        <i class="fa fa-shopping-cart"></i>Add to cart
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="product-image-wrapper">
                  <div class="single-products">
                    <div class="productinfo text-center">
                      <img src="images/home/recommend3.jpg" alt="" />
                      <h2>$56</h2>
                      <p>Easy Polo Black Edition</p>
                      <a href="#" class="btn btn-default add-to-cart">
                        <i class="fa fa-shopping-cart"></i>Add to cart
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a class="left recommended-item-control" href="#recommended-item-carousel" data-slide="prev">
            <i class="fa fa-angle-left"></i>
          </a>
          <a class="right recommended-item-control" href="#recommended-item-carousel" data-slide="next">
            <i class="fa fa-angle-right"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
export default ProductHome;
