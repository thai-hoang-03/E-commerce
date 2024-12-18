import MenuLeftAccount from "./MenuLeftAccount";
import Errors from "../authentication/Errors";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api, headerConfig, urlImage } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const auth = localStorage.getItem("auth");
  const accessToken = localStorage.getItem("token");
  const params = useParams();
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [error, setError] = useState({});
  const [category, setCategory] = useState([]);
  const [image, setImage] = useState([]); // Lưu file ảnh của product đã được đăng trước đó '
  console.log({ image });
  const [checkBoxImage, setCheckBoxImage] = useState([]); //Lưu tên các image checked
  console.log({ checkBoxImage });

  const [avatar, setAvatar] = useState([]); // lưu các file ảnh được add vào product
  console.log({ avatar });

  const [idUser, setIdUser] = useState(null); // Chứa ID của USER hiện tại
  useEffect(() => {
    if (auth) {
      const getID = JSON.parse(auth).id;
      setIdUser(getID);
    }
  }, [auth]);

  const [productEdit, setProductEdit] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    status: "",
    sale: "",
    company: "",
    detail: "",
  });
  console.log({ productEdit });

  //Hàm gọi API lấy dữ liệu Category và Brand
  const handleFetchCategoryBrand = () => {
    api.get("category-brand").then((res) => {
      if (res.data.category && res.data.brand) {
        setCategory(res.data.category);
        setBrands(res.data.brand);
      }
    });
  };

  useEffect(() => {
    handleFetchCategoryBrand();
  }, []);

  //Hàm xử lý lấy dữ liệu product từ API về
  const handleFetchDataProductLocal = () => {
    console.log(params.id);
    if (params.id) {
        api.get("product/detail/" + params.id)
           .then( res => {
               const getDataApi = res.data.data;
               console.log({getDataApi});
            //   set dữ liệu cũ từ local vào sate để render ra các ô input
              if(getDataApi){
                setProductEdit({
                    name: getDataApi.name,
                    price: getDataApi.price,
                    category: getDataApi.id_category,
                    brand: getDataApi.id_brand,
                    status: getDataApi.status,
                    sale: getDataApi.sale || 0,
                    company: getDataApi.company_profile,
                    detail: getDataApi.detail,
                  });
                if(getDataApi.image){
                    setImage(JSON.parse(getDataApi.image));  //set all image product của user đó
                };
              };
           })
           
           .catch( err => {
            toast.error(err);
           })
    };
  };

  useEffect(() => {
    handleFetchDataProductLocal();
  }, []);

  // Hàm xử lý khi các trường input và select thay đổi
  const handleEditProductChange = (e) => {
    const { name, value } = e.target;

    setProductEdit((prev) => {
      const updateProduct = {
        ...prev,
        [name]: value,
      };

      //Kiểm tra nếu status = 1 thì sẽ đưa sale về ""
      if (name === "status" && value === "1") {
        updateProduct.sale = "";
      }

      return updateProduct;
    });
  };

  //Hàm xử lý khi trường nhập ảnh thay đổi
  const handleFileAvatar = (e) => {
    const files = Array.from(e.target.files); // Hàm Array.from() được sử dụng để tạo một mảng từ một đối tượng giống mảng
    if (files.length > 0) {
      setAvatar((prev) => [...prev, ...files]);
    }
  };

  //Hàm xử lý khi user click vào các ô checkbox
  const handleCheckBox = (e) => {
    const { value, checked } = e.target;
    setCheckBoxImage((prev) => {
      if (checked) {
        const updateCheckBox = [...prev, value];
        return updateCheckBox;
      } else {
        return prev.filter((image) => image !== value);
      }
    });
  };

  //Hàm xử lý khi user submit form edit
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    let dataError = {};
    let flag = true;

    // Kiểm tra số lượng file
    if (avatar.length > 3) {
      dataError.lengthFile = "Chỉ được upload tối đa 3 file!";
      flag = false;
    }

    avatar.map((avatarChildren) => {
      if (avatarChildren) {
        const { type, size } = avatarChildren;
        if (!type.includes("image")) {
          dataError.avatarType = "Vui lòng chọn đúng định dạng hình ảnh!";
          flag = false;
        } else if (size > 1024 * 1024) {
          dataError.avatarSize = "Vui lòng chọn hình ảnh nhỏ hơn 1MB!";
          flag = false;
        }
      }
    });

    if (!flag) {
      setError(dataError);
      return;
    } else {
      dataError = null;
      setError({});

      if (!accessToken) {
        toast.error("Token không tồn tại !");
        return;
      }

      const formData = new FormData();
      formData.append("name", productEdit.name);
      formData.append("price", productEdit.price);
      formData.append("category", productEdit.category);
      formData.append("brand", productEdit.brand);
      formData.append("company", productEdit.company);
      formData.append("detail", productEdit.detail);
      formData.append("status", productEdit.status);
      formData.append("sale", productEdit.sale);

      checkBoxImage.forEach(item => {
        formData.append("avatarCheckBox[]", item)
      })

      avatar.map((valueFile) => {
        formData.append("file[]", valueFile);
      });

      //Gọi api để post product vừa edit
      if (params.id) {
        api
          .post("user/product/update/" + params.id, formData, headerConfig(accessToken))
          .then((res) => {
            if (res.data.errors) {
              setError(res.data.errors.name);
            } else {
              toast.success("Edit product thành công ");
              setAvatar([]);
              setTimeout( () => {
                navigate("/myProduct"); // Chuyển hướng qua my product ngay sau khi edit thành công 
              },1000);
            };
          })

          .catch((err) => {
            toast.error(err);
          });
      }
    }
  };

  return (
    <>
      <MenuLeftAccount />
      <div className="col-sm-9">
        <div className="blog-post-area">
          <h2 className="title text-center">Edit product</h2>
          <div className="signup-form">
            <h2>Recreate the product</h2>
            <form onSubmit={handleSubmitEdit} enctype="multipart/form-data">
              {/* Name */}
              <div className="input">
                <label>Name</label>
                <input type="text" name="name" value={productEdit.name} onChange={handleEditProductChange} placeholder="Name" />
              </div>

              {/*Price */}
              <div className="input">
                <label htmlFor="oke">Price</label>
                <input type="text" name="price" value={productEdit.price} onChange={handleEditProductChange} placeholder="Price" />
              </div>

              {/* Category */}
              <div className="input">
                <label>Category</label>
                <select name="category" onChange={handleEditProductChange} value={productEdit.category}>
                  <option value="" disabled>
                    Please choose category
                  </option>
                  {category.map((objectCategory) => (
                    <option value={objectCategory.id}>{objectCategory.category}</option>
                  ))}
                </select>
              </div>

              {/*Brands */}
              <div className="input">
                <label>Brand</label>
                <select name="brand" onChange={handleEditProductChange} value={productEdit.brand}>
                  <option value="" disabled>
                    Please choose brand
                  </option>
                  {brands.map((objectBrands) => (
                    <option value={objectBrands.id}>{objectBrands.brand}</option>
                  ))}
                </select>
              </div>

              {/* Status là sale hay new */}
              <div className="input">
                <label>Status</label>
                <select name="status" onChange={handleEditProductChange} value={productEdit.status}>
                  <option value="" disabled>
                    Please choose status
                  </option>
                  <option value={0}>sale</option>
                  <option value={1}>new</option>
                </select>
              </div>

              {/* Khi chọn status là sale thì hiển thị input nhập giá sale */}
              {(productEdit.status === "0" || productEdit.status === 0) && (
                <div className="input">
                  <label>Price sale</label>
                  <div className="priceSale">
                    <input className="oke" type="text" placeholder="0" name="sale" value={productEdit.sale} onChange={handleEditProductChange} />
                    <p>%</p>
                  </div>
                </div>
              )}

              {/* Company profile */}
              <div className="input">
                <label>Company</label>
                <input type="text" value={productEdit.company} name="company" onChange={handleEditProductChange} placeholder="Company profile" />
              </div>

              {/* Chọn avatar */}
              <input type="file" onChange={handleFileAvatar} name="avatar" multiple />

              {/* Những file avatar đã được upload từ trước */}
              <div className="div-uploaded">
                <h5>Files Uploaded:</h5>
                {image.map((childrenImage) => {
                  return (
                    <>
                      <ul>
                        <li className="li-image">
                          <label htmlFor="check"><img src={`${urlImage}/product/${idUser}/${childrenImage}`} /></label>  
                          <input type="checkbox" id="check" className="check-box-update" value={childrenImage} onChange={handleCheckBox} />
                        </li>
                      </ul>
                    </>
                  );
                })}
              </div>

              {/* Detail */}
              <div className="input">
                <label>Detail</label>
                <textarea
                  id="comment-detail"
                  name="detail"
                  value={productEdit.detail}
                  onChange={handleEditProductChange}
                  placeholder="Nhập nội dung detai ..."
                ></textarea>
              </div>

              <Errors errors={error} />

              <button type="submit" class="btn btn-default">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default EditProduct;
