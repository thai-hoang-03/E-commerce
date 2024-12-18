import { useEffect, useState } from "react";
import MenuLeftAccount from "./MenuLeftAccount";
import { api } from "../../api";
import Errors from "../authentication/Errors";
import { toast } from "react-toastify";
function AddProduct() {

    const [ addProduct, setAddProduct ] = useState({
        name: "",
        price: "",
        category: "",
        brand: "",
        status: "",
        sale: "",
        company: "",
        detail: ""
    });
    console.log({addProduct});

    const [brands, setBrands] = useState([]);
    const [category, setCategory] = useState([]); 
    const [error, setError] = useState({});
    const [avatar, setAvatar] = useState([]); // lưu các file ảnh được add vào product
    console.log({avatar});

    const accessToken = localStorage.getItem("token"); // Lấy token
    
    //Hàm gọi API lấy dữ liệu Category và Brand
    const handleFetchCategoryBrand = () => {
        api.get('category-brand').then( res => {
            if(res.data.category && res.data.brand){
                setCategory(res.data.category);
                setBrands(res.data.brand);
            };
        })
    };

    useEffect( () => {
        handleFetchCategoryBrand()
    },[]);

    //Hàm xử lý file avatar
    const handleFileAvatar = (e) => {
        const files = Array.from(e.target.files); // Hàm Array.from() được sử dụng để tạo một mảng từ một đối tượng giống mảng
        if (files.length > 0 ) {
            setAvatar( prev => [
                ...prev,
                ...files
            ]);
        };      
    };

    //Hàm xử lý khi các trường trong form input có sự thay đổi
    const handleAddProductChange = (e) => {
        const{name, value} = e.target;
        setAddProduct( (prev) => ({
            ...prev,
            [name] : value
        }))
    };

    // Hàm xử lý khi người dùng bấm submit form
    const handleSubmitForm = (e) => {
        e.preventDefault();
        let dataError = {};
        let flag = true;

        // Chỉ được up lên 3 file
        if(avatar.length > 3){
            dataError.lengthFile = "Chỉ được up tối đa 3 file!";
            flag = false;
        };
        
        //Check định dạng hình ảnh
        avatar.map( (avatarChildren) => {
            if(avatarChildren){
                const {type, size} = avatarChildren;

                if (!type.includes("image")) {
                    dataError.avatarType = "Vui lòng chọn đúng định dạng hình ảnh!";
                    flag = false;
                  } else if (size > 1024 * 1024) {
                    dataError.avatarSize = "Vui lòng chọn hình ảnh nhỏ hơn 1MB!";
                    flag = false;
                  };
                
            };
        });

        if(!flag){
            setError(dataError);
            return;
        }else{
            dataError = null;
            setError({});

            if(!accessToken){
                toast.error("Token không tồn tại !");
                return;
            };

            // Truyền token vào header
            let config = {
                     headers: {
                        Authorization: "Bearer " + accessToken,
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                     },
                    }; 
                                        
                    const formData = new FormData();
                    formData.append("name", addProduct.name);
                    formData.append("price", addProduct.price);
                    formData.append("category", addProduct.category);
                    formData.append("brand", addProduct.brand);
                    formData.append("company", addProduct.company);
                    formData.append("detail", addProduct.detail);
                    formData.append("status", addProduct.status); 
                    formData.append("sale", addProduct.sale);

                    avatar.map( valueFile => {
                        formData.append("file[]", valueFile);
                    });

                    console.log({avatar});
                   
                    // Log formData ra để kiểm tra coi đã nhận được dữ liệu hay chưa
                    for (let pair of formData.entries()) { 
                        console.log(pair[0], pair[1]);
                    };
                    
            //Gọi API để POST
            api
              .post("user/product/add", formData, config)
              .then( res => {
                if (res.data.errors) {
                    setError(res.data.errors);
                }else{
                    const checkOke = res.data.data;
                    console.log({checkOke});
                    toast.success('Tạo product thành công !');
                    setAvatar([]);
                };
              })

              .catch(error => { 
                toast.error(error.response.data.message);
            });

        };

    };

    return(
        <>
        <MenuLeftAccount/>
        		<div className="col-sm-9">
					<div className="blog-post-area">
						<h2 className="title text-center">Add product</h2>
						<div className="signup-form">
						  <h2>Create new product</h2>
						  <form onSubmit={handleSubmitForm} enctype="multipart/form-data">
                            {/* Name */}
							 <input type="text" name="name" value={addProduct.name} onChange={handleAddProductChange} placeholder="Name" />

                            {/*Price */}
                             <input type="text" name="price" value={addProduct.price} onChange={handleAddProductChange} placeholder="Price"/>

                            {/* Category */}
                             <select name="category" onChange={handleAddProductChange}>
                                <option value="" disabled selected>Please choose category </option>
                                {category.map( ( objectCategory ) => (
                                        <option value={objectCategory.id}>{objectCategory.category}</option>
                                    ))}
                             </select>

                            {/*Brands */}
                             <select name="brand" onChange={handleAddProductChange}>
                                <option value="" disabled selected>Please choose brand </option>
                                {brands.map( (objectBrands) => (
                                    <option value={objectBrands.id}>{objectBrands.brand}</option>
                                ))}
                             </select>
                   
                            {/* Status là sale hay new */}                          
                             <select name="status" onChange={handleAddProductChange} >
                                <option value="" disabled selected>Please choose status </option>
                                <option value={0}>sale</option>
                                <option value={1}>new</option>
                             </select>

                            {/* Khi chọn status là sale thì hiển thị input nhập giá sale */}
                            {addProduct.status === '0' && (
                                <div className="priceSale">
                                    <input className="oke" type="text" placeholder="0" name="sale" value={addProduct.sale} onChange={handleAddProductChange} /> 
                                    <p>%</p>
                                </div>            
                            )}

                            {/* Company profile */}
                             <input type="text" value={addProduct.company} name="company" onChange={handleAddProductChange} placeholder="Company profile"/>

                            {/* Chọn avatar */}
                             <input type="file" onChange={handleFileAvatar} name="avatar" multiple/>
 
                            {/* Detail */}
                             <textarea id="comment-detail" name="detail" value={addProduct.detail} onChange={handleAddProductChange} placeholder="Nhập nội dung detai ..."></textarea>

                            <Errors errors={error}/>

							 <button type="submit" class="btn btn-default">Submit</button>

						  </form>
					    </div>
					</div>
				</div>


        </>
    );
};
export default AddProduct;






// import { useEffect, useState } from "react";
// import MenuLeftAccount from "./MenuLeftAccount";
// import { api } from "../../api";
// import Errors from "../authentication/Errors";
// import { toast } from "react-toastify";

// function AddProduct() {
//     const [addProduct, setAddProduct] = useState({
//         name: "",
//         price: "",
//         category: "",
//         brand: "",
//         status: "",
//         sale: "",
//         company: "",
//         detail: "",
//     });
//     const [brands, setBrands] = useState([]);
//     const [category, setCategory] = useState([]); 
//     const [error, setError] = useState({});
//     const [avatar, setAvatar] = useState([]); // lưu các file ảnh được add vào product

//     const accessToken = localStorage.getItem("token"); // Lấy token
    
//     // Hàm gọi API lấy dữ liệu Category và Brand
//     const handleFetchCategoryBrand = () => {
//         api.get('category-brand').then(res => {
//             if (res.data.category && res.data.brand) {
//                 setCategory(res.data.category);
//                 setBrands(res.data.brand);
//             }
//         });
//     };

//     useEffect(() => {
//         handleFetchCategoryBrand();
//     },[]);

//     // Hàm xử lý file avatar
//     const handleFileAvatar = (e) => {
//         const files = Array.from(e.target.files); // Chuyển đổi các file thành mảng
//         if (avatar.length + files.length > 3) {
//             toast.error("Chỉ được upload tối đa 3 file!");
//         } else {
//             setAvatar(prev => [...prev, ...files]);
//         }
//     };

//     // Hàm xử lý khi các trường trong form input có sự thay đổi
//     const handleAddProductChange = (e) => {
//         const { name, value } = e.target;
//         setAddProduct((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // Hàm xóa file
//     const handleRemoveFile = (index) => {
//         setAvatar((prev) => prev.filter((_, i) => i !== index));
//     };

//     // Hàm xử lý khi người dùng bấm submit form
//     const handleSubmitForm = (e) => {
//         e.preventDefault();
//         let dataError = {};
//         let flag = true;

//         // Kiểm tra số lượng file
//         if (avatar.length > 3) {
//             dataError.lengthFile = "Chỉ được upload tối đa 3 file!";
//             flag = false;
//         }

//         avatar.map((avatarChildren) => {
//             if (avatarChildren) {
//                 const { type, size } = avatarChildren;
//                 if (!type.includes("image")) {
//                     dataError.avatarType = "Vui lòng chọn đúng định dạng hình ảnh!";
//                     flag = false;
//                 } else if (size > 1024 * 1024) {
//                     dataError.avatarSize = "Vui lòng chọn hình ảnh nhỏ hơn 1MB!";
//                     flag = false;
//                 }
//             }
//         });

//         if (!flag) {
//             setError(dataError);
//             return;
//         } else {
//             dataError = null;
//             setError({});

//             if (!accessToken) {
//                 toast.error("Token không tồn tại !");
//                 return;
//             }

//             let config = {
//                 headers: {
//                     Authorization: "Bearer " + accessToken,
//                     "Content-Type": "multipart/form-data",
//                     Accept: "application/json",
//                 },
//             };

//             const formData = new FormData();
//             formData.append("name", addProduct.name);
//             formData.append("price", addProduct.price);
//             formData.append("category", addProduct.category);
//             formData.append("brand", addProduct.brand);
//             formData.append("company", addProduct.company);
//             formData.append("detail", addProduct.detail);
//             formData.append("status", addProduct.status); 
//             formData.append("sale", addProduct.sale);

//             avatar.map((valueFile) => {
//                 formData.append("file[]", valueFile);
//             });

//             api
//                 .post("user/product/add", formData, config)
//                 .then((res) => {
//                     if (res.data.errors) {
//                         setError(res.data.errors);
//                     } else {
//                         toast.success("Tạo product thành công !");
//                         setAvatar([]);
//                     }
//                 })
//                 .catch((error) => {
//                     toast.error(error.response.data.message);
//                 });
//         };
//     };

//     return (
//         <>
//             <MenuLeftAccount />
//             <div className="col-sm-9">
//                 <div className="blog-post-area">
//                     <h2 className="title text-center">Add product</h2>
//                     <div className="signup-form">
//                         <h2>Create new product</h2>
//                         <form onSubmit={handleSubmitForm} encType="multipart/form-data">
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={addProduct.name}
//                                 onChange={handleAddProductChange}
//                                 placeholder="Name"
//                             />
//                             <input
//                                 type="text"
//                                 name="price"
//                                 value={addProduct.price}
//                                 onChange={handleAddProductChange}
//                                 placeholder="Price"
//                             />
//                             <select name="category" onChange={handleAddProductChange}>
//                                 <option value="" disabled selected>
//                                     Please choose category
//                                 </option>
//                                 {category.map((objectCategory) => (
//                                     <option value={objectCategory.id}>{objectCategory.category}</option>
//                                 ))}
//                             </select>
//                             <select name="brand" onChange={handleAddProductChange}>
//                                 <option value="" disabled selected>
//                                     Please choose brand
//                                 </option>
//                                 {brands.map((objectBrands) => (
//                                     <option value={objectBrands.id}>{objectBrands.brand}</option>
//                                 ))}
//                             </select>
//                             <select name="status" onChange={handleAddProductChange}>
//                                 <option value="" disabled selected>
//                                     Please choose status
//                                 </option>
//                                 <option value={0}>sale</option>
//                                 <option value={1}>new</option>
//                             </select>

//                             {addProduct.status === '0' && (
//                                 <div className="priceSale">
//                                     <input
//                                         className="oke"
//                                         type="text"
//                                         placeholder="0"
//                                         name="sale"
//                                         value={addProduct.sale}
//                                         onChange={handleAddProductChange}
//                                     />
//                                     <p>%</p>
//                                 </div>
//                             )}

//                             <input
//                                 type="text"
//                                 value={addProduct.company}
//                                 name="company"
//                                 onChange={handleAddProductChange}
//                                 placeholder="Company profile"
//                             />

//                             {/* Chọn avatar */}
//                             <input
//                                 type="file"
//                                 onChange={handleFileAvatar}
//                                 name="avatar"
//                                 multiple
//                             />
//                             <div>
//                                 {avatar.length > 0 && (
//                                     <div>
//                                         <h4>Files Uploaded:</h4>
//                                         <ul>
//                                             {avatar.map((file, index) => (
//                                                 <li key={index}>
//                                                     {file.name}
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => handleRemoveFile(index)}
//                                                     >
//                                                         Remove
//                                                     </button>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 )}
//                             </div>

//                             <textarea
//                                 id="comment-detail"
//                                 name="detail"
//                                 value={addProduct.detail}
//                                 onChange={handleAddProductChange}
//                                 placeholder="Nhập nội dung detai ..."
//                             ></textarea>

//                             <Errors errors={error} />

//                             <button type="submit" className="btn btn-default">
//                                 Submit
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default AddProduct;