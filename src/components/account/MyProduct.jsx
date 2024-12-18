import { useEffect, useState } from "react";
import MenuLeftAccount from "./MenuLeftAccount";
import { api, headerConfig, urlImage } from "../../api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function MyProduct() {

  const accessToken = localStorage.getItem("token");
  const auth = localStorage.getItem("auth");
  
  const [idUser, setIdUser] = useState(null); // Chứa ID của USER hiện tại
  useEffect( () => {
    if(auth){
      const getID = JSON.parse(auth).id;
      setIdUser(getID)
    };
  },[auth]);

  const [myProduct, setMyProduct] = useState([]); // Chứa all product của USER đó
  useEffect(() => {
    console.log({ myProduct });
  }, [myProduct]);

  // Hàm xử lý gọi API lấy data my-product ra
  const handleFetchMyProduct = () => {
    if (accessToken) {
      // Truyền token vào header
   
      //Gọi API để lấy dữ liệu
      api
        .get("user/my-product", headerConfig(accessToken))
        .then((res) => {
          const getDataProductApi = res.data.data;
          console.log({getDataProductApi});
          if (getDataProductApi) {
            setMyProduct(getDataProductApi);
          }
        })

        .catch((error) => {
          console.log({ error });
          toast.error("Có lỗi khi lấy data từ sever, hãy xem trong console !");
        });
    }
  };

  useEffect(() => {
    if (accessToken) {
      handleFetchMyProduct();
    }
  }, [accessToken]);

  //Hàm xử lý delete product
  const handleDeleteProduct = (idProduct) => {
     api.get("user/product/delete/" + idProduct, headerConfig(accessToken))
        .then( (res) => {
            const responseDataDelete = res.data.data;
            setMyProduct(responseDataDelete);
            toast.success(`Xoá thành công product có ID là ${idProduct}`)
        })

        .catch( error => {
            toast.error(error);
        })
  };

  return (
    <>
      <MenuLeftAccount />

      <div className="col-sm-9">
        <div className="table-responsive cart_info">
          <table className="table table-condensed">
            <thead>
              <tr className="cart_menu">
                <td className="id">ID</td>
                <td className="image">image</td>
                <td className="description">name</td>
                <td className="price">price</td>
                <td className="total">action</td>
              </tr>
            </thead>

            <tbody>
              {Object.keys(myProduct).map((valueIndexProduct) => {
                const product = myProduct[valueIndexProduct]; // các product con sau khi được map ra
                console.log({ product });
                const parseImage = JSON.parse(product.image); // 1 mảng chứa các image sau khi được map ra
                const firstImage = parseImage[0]; // Lấy image đầu tiên trong mảng hiển thị ra
                return (
                  <>
                    <tr>
                      <td className="cart_id">{product.id}</td>
                      <td className="cart_product">
                          <img src={`${urlImage}/product/${idUser}/${firstImage}`} alt="" />         
                      </td>
                      <td className="cart_description">
                        <h4>
                          <a href="#">{product.name}</a>
                        </h4>
                      </td>
                      <td className="cart_price">
                        <p>{product.price}$</p>
                      </td>
                      <td className="cart_total">
                        <i class="fa-solid fa-trash" 
                        onClick={ () => {
                            handleDeleteProduct(product.id)
                        }} 
                        style={{ display: "inline-block", marginRight: 20, cursor: "pointer" }}>
                        </i>

                        <Link to={"/editProduct/" + product.id}>
                            <i style={{color: "black"}} class="fa-solid fa-pencil"></i>
                        </Link>

                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default MyProduct;
