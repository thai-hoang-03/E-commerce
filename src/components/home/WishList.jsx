import { useEffect, useState } from "react";
import { api, urlImage } from "../../api";
import { toast } from "react-toastify";

function WishList() {
  const [productWishList, setProductWishList] = useState([]); // Lưu trữ các sản phẩm wishlist
  const [isLoading, setIsLoading] = useState(false); 
  const [idWishList, setIdWishList] = useState([]); // Lưu trữ các id của sản phẩm trong wishlist

  // Lấy id wishlist từ localStorage
  useEffect(() => {
    const getWishList = localStorage.getItem("WishList");
    const dataWishList = getWishList ? JSON.parse(getWishList) : [];

    setIdWishList(dataWishList); // Cập nhật danh sách id sản phẩm wishlist
  }, []);

  // Hàm xử lý lấy product từ API wishlist về
  const handleGetProductWishList = () => {
    // setIsLoading(true)
    api
      .get("product/wishlist")
      .then((res) => {
        const getProduct = res.data.data;
        if (getProduct) {
          const product = getProduct.filter((productChild) => idWishList.includes(productChild.id));
          setProductWishList(product);
        }
      })
      .catch((err) => {
        toast.error(err);
      })
      .finally(() => {
        // setIsLoading(false)
      });
  };

  // Lấy danh sách sản phẩm mỗi khi idWishList thay đổi
  useEffect(() => {
    if (!idWishList.length) {
      return;
    }
    handleGetProductWishList();
  }, [idWishList]);

  // Hàm xử lý khi user click delete sản phẩm khỏi wishlist
  const handleDeleteWishList = (idProduct) => {
    const remainingProductId = idWishList.filter((id) => id !== idProduct);
    setIdWishList(remainingProductId);

    // Set lại localStorage với danh sách id sản phẩm còn lại
    localStorage.setItem("WishList", JSON.stringify(remainingProductId));

    // Cập nhật lại productWishList để xóa sản phẩm khỏi giao diện
    const remainingProduct = productWishList.filter((product) => product.id !== idProduct);
    setProductWishList(remainingProduct);

    toast.success("Sản phẩm đã được xóa khỏi wishlist");
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="features_items">
          <h2 className="title text-center">Product wishlist</h2>
          {productWishList.length > 0 ? (
            productWishList.map((product) => {
              const getImage = JSON.parse(product.image);
              const firstImage = getImage[0];
              return (
                <div className="col-sm-4" key={product.id}>
                  <div className="product-image-wrapper">
                    <div className="single-products">
                      <div className="productinfo text-center">
                        <img src={`${urlImage}/product/${product.id_user}/${firstImage}`} alt="" />
                        <h2>{product.price}$</h2>
                        <p>{product.name}</p>
                        <a href="#" className="btn btn-default add-to-cart">
                          <i className="fa fa-shopping-cart"></i>Add to cart
                        </a>
                        <a onClick={() => handleDeleteWishList(product.id)} style={{ marginLeft: 7 }} className="btn btn-default add-to-cart">
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Không có sản phẩm trong wishlist </p>
          )}
        </div>
      )}
    </>
  );
}

export default WishList;
