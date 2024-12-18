// import { useEffect, useState } from "react";
// import { api } from "../../api";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useNavigate } from 'react-router-dom';

// function BlogDetail() {
//     const params = useParams();
//     console.log(params);

//     const navigate = useNavigate(); //hook điều hướng
   
//     const [blogDetail, setBlogDetail] = useState(null);
//     console.log({ blogDetail });

//     const [comments, setComments] = useState([]);
//     console.log({comments});

//     const [idComment, setIdComment] = useState(0); // khai báo idComment cho phần comment là 0 ( bình luận cha)

//     const [commentContent, setCommentContent] = useState(''); // Khai báo nội dung phần bình luận 
//     // console.log({commentContent});
//     const getAuthUser = localStorage.getItem('auth'); // Lấy auth của user trên local
   
//     useEffect(() => {
//       api.get("/blog/detail/" + params.id).then((res) => {  
//       setBlogDetail(res.data.data);
//       setComments(res.data.data.comment);
//     });
//     }, [params.id]);

//   //Hàm xử lý input khi trường nhập comment thay đổi ( ngừoi dùng nhập bình luận)
//     const handleComment = (event) => {    
//         //kiểm tra xem khi muốn bình luận thì đã login hay chưa
//         if(!getAuthUser){
//             toast.error('Không thể bình luận do chưa đăng nhập !');
//             navigate('/login');
//             return;
//         };
//         setCommentContent(event.target.value); 
//     };

//   // Hàm xử lý khi người dùng click vào button "post comment"
//     const handlePostComment = () => {     
//         const accessToken = localStorage.getItem('token');

//       //Lấy thông tin user từ auth
//         const idUser = JSON.parse(getAuthUser).id;
//         const nameUser = JSON.parse(getAuthUser).name;
//         const imageUser = JSON.parse(getAuthUser).avatar;
//         console.log(idUser,nameUser,imageUser,accessToken);

//         let config = {
//             headers: {
//                 'Authorization': 'Bearer ' + accessToken,
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 'Accept': 'application/json',
//             }
//         };

//        //Kiểm tra xem nếu muốn post comment thì trong ô nhập liệu phải có nội dung
//         if(commentContent){
//             const formData = new FormData();
//             formData.append('id_blog', params.id);
//             formData.append('id_user', idUser);
//             formData.append('id_comment', idComment);
//             formData.append('comment', commentContent );
//             formData.append('image_user', imageUser);
//             formData.append('name_user', nameUser);

//             api.post("/blog/comment/" + params.id, formData, config)
//             .then( res => {
//                 console.log(res.data);
//                 // Thêm bình luận mới vào danh sách comments
//                 setComments(prevComments => [
//                     ...prevComments,
//                     res.data.data.comment
//                 ]);
//                 setCommentContent(''); // xoá nội dung trong ô nhập liệu sau khi post
//                 toast.success('Đăng bình luận thành công !');
//             })

//             .catch(error => {
//                 console.log(error);
//                 toast.error('Có lỗi, hãy xem trong console !')
//             })
            
//         }else{
//             toast.error('Vui lòng nhập bình luận !');
//         };
//     };

//    // Hàm xử lý khi người dùng click REPLY
//     const handleReply = (dadCommentID) => {
//         // console.log({dadCommentID});
//         setIdComment(dadCommentID); 
//         document.getElementById('comment-input').focus();        
//     };

//     return (
//         <>
//             <div className="col-sm-9">
//             {blogDetail && (
//                 <>
//                 <div className="blog-post-area">
//                     <h2 className="title text-center">Latest From our Blog</h2>
                    
//                     <div className="single-blog-post">
//                         <h3>{blogDetail.title}</h3>
//                         <div className="post-meta">
//                             <ul>
//                                 <li><i className="fa fa-user"></i> Mac Doe</li>
//                                 <li><i className="fa fa-clock-o"></i>{blogDetail.created_at}</li>
//                                 <li><i className="fa fa-calendar"></i> {blogDetail.updated_at}</li>
//                             </ul>
//                         </div>
//                         <a href="#">
//                             <img src={"http://localhost/doan/laravel8/public/upload/Blog/image/" + blogDetail.image} alt="Blog Post" />
//                         </a>
//                         <p>{blogDetail.content}</p> 
                        
//                         <div className="pager-area">
//                             <ul className="pager pull-right">
//                                 <li><a href="#">Pre</a></li>
//                                 <li><a href="#">Next</a></li>
//                             </ul>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="rating-area">
//                     <ul className="ratings">
//                         <li className="rate-this">Rate this item:</li>
//                         <li>
//                             <i className="fa fa-star color"></i>
//                             <i className="fa fa-star color"></i>
//                             <i className="fa fa-star color"></i>
//                             <i className="fa fa-star"></i>
//                             <i className="fa fa-star"></i>
//                         </li>
//                         <li className="color">(6 votes)</li>
//                     </ul>
//                     <ul className="tag">
//                         <li>TAG:</li>
//                         <li><a className="color" href="#">Pink <span>/</span></a></li>
//                         <li><a className="color" href="#">T-Shirt <span>/</span></a></li>
//                         <li><a className="color" href="#">Girls</a></li>
//                     </ul>
//                 </div>

//                 <div className="socials-share">
//                     <a href="#">
//                         <img src="/images/blog/socials.png" alt="Social Share" />
//                     </a>
//                 </div>
//                 {/* Phần bình luận  */}
//                 <div className="response-area">
//                     <h2>{comments.length} RESPONSES</h2>
//                     <ul className="media-list">
//                        {
//                         comments.map( comment => (
//                             <>
//                                <li className={`media ${comment.id_comment !== 0 ? 'second-media' : ''}`}>

//                                     <a className="pull-left" href="#">
//                                        <img className="media-object" src={'http://localhost/doan/laravel8/public/upload/user/avatar/' + comment.image_user} alt="User Avatar" />
//                                     </a>

//                                     <div className="media-body">
//                                        <ul className="sinlge-post-meta">
//                                           <li><i className="fa fa-user"></i>{comment.name_user}</li>
//                                           <li><i className="fa fa-clock-o"></i> {comment.created_at}</li>
//                                           <li><i className="fa fa-calendar"></i> DEC 5, 2013</li>
//                                        </ul>
//                                        <p>{comment.comment}</p>
//                                        <button className="btn btn-primary" onClick={() => handleReply(comment.id)} ><i className="fa fa-reply"></i>Reply</button>
//                                     </div>
//                                </li>
//                             </>
//                         ))
//                        }
//                     </ul>                    
//                 </div>
//                 {/* Viết feedback reply */}
//                 <div className="replay-box">
//                     <div className="row">
//                         <div className="col-sm-12">
//                             <h2>Leave a replay</h2>
//                             <div className="text-area">
//                                 <div className="blank-arrow">
//                                     <label>Your Name</label>
//                                 </div>
//                                 <span>*</span>
//                                 <textarea 
//                                 id="comment-input"
//                                 name="message" 
//                                 rows="11"
//                                 value={commentContent}
//                                 onChange={handleComment}
//                                 ></textarea>
//                                 <button className="btn btn-primary" onClick={handlePostComment} >post comment</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 </>

//                 )};

//             </div>  
//         </>
//     );
// }

// export default BlogDetail;


////////////////////////////////////

// import StarRatings from "react-star-ratings";
// import { useEffect, useState } from "react";
// import { api } from "../../api";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// function Rate(props) {
//   const { user_id, blog_id, isLogged, accessToken } = props;
//   const [numberVote, setNumberVote] = useState(0); // số vote
  
//   const [rating, setRating] = useState(0);
//   useEffect(() => {
//     console.log({ rating });
//   }, [rating]);

//   const params = useParams();

//   const navigate = useNavigate();

//   //Hàm lấy rating từ API
//   const handleFetchRating = () => {
//     api
//       .get("blog/rate/" + params.id)
//       .then((res) => {
//         const dataRatingApi = res.data.data;
//         console.log({ dataRatingApi });
//         var ratingValues = Object.values(dataRatingApi);
//         console.log({ ratingValues });
//         setNumberVote(ratingValues.length)

//         //Kiểm tra xem API trả về có dữ liệu hay không
//         if (ratingValues && ratingValues.length > 0) {
//           let total = 0;

//           // Map lấy rate
//           ratingValues.map((dataRating) => {
//             return (total += dataRating.rate);
//           });
//           const average = total / ratingValues.length;
//           setRating(average);
//         } else {
//           setRating(0); // set là 0 nếu không có dữ liệu từ API
//         }
//       })

//       .catch((err) => {
//         console.log(`Lỗi khi lấy rating từ API đó là : ${err.typeError}`);
//         toast.error("Có lỗi, hãy xem trong console !");
//         setRating(0);
//       });
//   };

//   useEffect(() => {
//     handleFetchRating();
//   }, [params.id]);

//   // Hàm xử lý khi user bắt đầu đánh giá
//   function changeRating(newRating) {
//     if (!isLogged) {
//       toast.error("Vui lòng đăng nhập để đánh giá !");
//       navigate("/login");
//       return;
//     }

//     // Truyền token vào header
//     let config = {
//       headers: {
//         Authorization: "Bearer " + accessToken,
//         "Content-Type": "application/x-www-form-urlencoded",
//         Accept: "application/json",
//       },
//     };

//     // FormData gửi qua API
//     const formDataRating = new FormData();
//     formDataRating.append("user_id", user_id);
//     formDataRating.append("blog_id", blog_id);
//     formDataRating.append("rate", newRating);

//     api
//       .post("blog/rate/" + params.id, formDataRating, config)
//       .then((res) => {
//         // console.log(res.data);
//         toast.success(`Đánh giá blog thành công với số sao là ${newRating}`); // thông báo rating thành công

//         handleFetchRating(); // Gọi lại hàm handleFectchRating để cập nhật lại điểm đánh giá
//       })

//       .catch((error) => {
//         console.log({ error });
//         toast.error("Có lỗi, hãy xem trong console !");
//       });
//   }

//   return (
//     <>
//       <ul className="ratings">
//         <li className="rate-this">Rate this item:</li>
//         <li>
//           <StarRatings rating={rating} 
//           starRatedColor="orange" 
//           changeRating={changeRating} 
//           numberOfStars={6} 
//           name="rating" />
//         </li>
//         <li className="color">{`${numberVote} votes`}</li>
//       </ul>
//     </>
//   );
// }
// export default Rate;

///////////////////////////////////////

// import { useEffect, useState } from "react";
// import Errors from "../authentication/Errors";
// import { toast } from "react-toastify";
// import { api } from "../../api";
// import MenuLeftAccount from "./MenuLeftAccount";

// function UpdateMember() {

//   const [error, setError] = useState({});
//   const [getFile, setGetFile] = useState(null); // Lưu file gốc vào useState để lấy ra kiểm tra type và size
//   console.log({getFile});

//   const accessToken = localStorage.getItem("token"); // Lấy token
//   const getAuthUser = localStorage.getItem("auth"); // Lấy auth của user trên local
//   let idUser;
//   if (getAuthUser) {
//     idUser = JSON.parse(getAuthUser).id;
//   }

//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     address: "",
//     avatar: null,
//     level: 0,
//   });
//   console.log({ userData });

//   // Hàm lấy dữ liệu có sẵn từ trước của user trong local và render ra các ô input
//   const handleFetchOldLocal = () => {
//     let userLocalData = localStorage.getItem("auth");

//     if (userLocalData) {
//       userLocalData = JSON.parse(userLocalData);
//       console.log({ userLocalData });

//       //set dữ liệu cũ từ local vào sate để render ra các ô input
//       setUserData({
//         name: userLocalData.name,
//         email: userLocalData.email,
//         password: "",
//         phone: userLocalData.phone,
//         address: userLocalData.address,
//         avatar: userLocalData.avatar,
//         level: 0,
//       });
//     }
//   };

//   useEffect(() => {
//     handleFetchOldLocal();
//   }, []);

//   // Hàm Xử lý file hình ảnh avatar
//   const handleFile = (e) => {
//     const uploadFile = e.target.files[0];
//     if (uploadFile) {
//       setGetFile(uploadFile);
//     }

//     //Mã hoá để gửi qua API
//     let reader = new FileReader();

//     reader.readAsDataURL(uploadFile);
//     reader.onload = (e) => {
//       setUserData((state) => ({
//         ...state,
//         avatar: e.target.result,
//       }));
//     };
//   };

//   // Hàm Xử lý Forminput register khi các trường trong input có thay đổi
//   const handleUpdate = (event) => {
//     const { name, value } = event.target;

//     setUserData((stateUserData) => ({
//       ...stateUserData,
//       [name]: value,
//     }));
//   };

//   // Hàm xử lý khi bấm submit dữ liệu profile mà ngừoi dùng vừa update
//   const handleSubmitDataUpdate = (e) => {
//     e.preventDefault();
//     let dataError = {};
//     let flag = true;

//     if (!userData.name) {
//       dataError.name = "Name không được để trống !";
//       flag = false;
//     }

//     if (!userData.phone) {
//       dataError.phone = "Phone không được để trống !";
//       flag = false;
//     }

//     if (!userData.address) {
//       dataError.address = "Address không được để trống !";
//       flag = false;
//     }

//     if (userData.avatar === null) {
//       dataError.avatar = "Avatar không được để trống !";
//       flag = false;
//     } else {

//       if (getFile) {
//         const { type, size } = getFile;
//         if (!type.includes("image")) {
//           dataError.avatarType = "Vui lòng chọn đúng định dạng hình ảnh!";
//           flag = false;
//         } else if (size > 1024 * 1024) {
//           dataError.avatarSize = "Vui lòng chọn hình ảnh nhỏ hơn 1MB!";
//           flag = false;
//         }
//       }

//     }

//     if (!flag) {
//       setError(dataError);
//       return;
//     } else {
//       dataError = null;
//       setError({});

//       // Kiểm tra xem có token tồn tại hay không trước khi gọi API
//       if (!accessToken) {
//         console.log("Token không tồn tại !");
//         return;
//       }

//       // Truyền token vào header
//       let config = {
//         headers: {
//           Authorization: "Bearer " + accessToken,
//           "Content-Type": "application/x-www-form-urlencoded",
//           Accept: "application/json",
//         },
//       };

//       const formData = new FormData();
//       formData.append("name", userData.name);
//       formData.append("email", userData.email);
//       formData.append("password", userData.password);
//       formData.append("phone", userData.phone);
//       formData.append("address", userData.address);
//       formData.append("avatar", userData.avatar);
//       formData.append("level", 0);

//       api
//         .post("user/update/" + idUser, formData, config)
//         .then((res) => {
//           const token = res.data.token;
//           const auth = res.data.Auth;
//           const authJson = JSON.stringify(auth);

//           // Lấy auth và token mới vào local
//           localStorage.setItem("auth", authJson);
//           localStorage.setItem("token", token);

//           toast.success("Update thông tin thành công");
//         })

//         .catch((error) => {
//           console.log(error);
//           toast.error("Có lỗi khi gọi API để post, hãy xem trong console");
//         });
//     }
//   };

//   return (
//     <>
//       <MenuLeftAccount/>    
      
//       <div class="col-sm-9">
//         <div class="blog-post-area">
//           <h2 class="title text-center">Update user</h2>
//           <div class="signup-form">
//             <h2>User update</h2>

//             <form onSubmit={handleSubmitDataUpdate} enctype="multipart/form-data">
//               {/* Nhập name để đăng ký */}
//               <input type="text" placeholder="Name" name="name" value={userData.name} onChange={handleUpdate} />

//               {/*Nhập email để đăng ký  */}
//               <input type="email" readOnly placeholder="Email Address" name="email" value={userData.email} />

//               {/* Nhập password để đăng ký */}
//               <input type="password" placeholder="Password" name="password" value={userData.password} onChange={handleUpdate} />

//               {/* Nhập password để đăng ký */}
//               <input type="text" placeholder="your phone" name="phone" value={userData.phone} onChange={handleUpdate} />

//               {/* Nhập address để đăng ký */}
//               <input type="text" placeholder="your address" name="address" value={userData.address} onChange={handleUpdate} />

//               {/* Chọn Avatar để đăng ký */}
//               <input type="file" name="avatar" onChange={handleFile} />

//               {/* Chọn Level */}
//               <select name="level">
//                 <option value={0}>Member</option>
//               </select>

//               <Errors errors={error} />

//               <button type="submit" className="btn btn-default">
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default UpdateMember;


///////////////////////////////////////////////////////

  // Sử dụng filter để lọc những bình luận cha
  // const parentComent = comments ? comments.filter((filterComment) =>  filterComment.id_comment === 0 ) : []; // nếu có comments thì mới dùng filter
  // console.log({ parentComent });


<ul className="media-list">
{parentComent.map((comment) => {
  console.log({ comment });
  return (
    <>
      <li className="media">
        <a className="pull-left" href="#">
          <img
            className="media-object"
            src={"http://localhost/doan/laravel8/public/upload/user/avatar/" + comment.image_user}
            alt="User Avatar"
          />
        </a>

        <div className="media-body">
          <ul className="sinlge-post-meta">
            <li>
              <i className="fa fa-user"></i>
              {comment.name_user}
            </li>
            <li>
              <i className="fa fa-clock-o"></i>
              {comment.created_at}
            </li>
            <li>
              <i className="fa fa-calendar"></i> DEC 5, 2013
            </li>
          </ul>
          <p>{comment.comment}</p>
          <button className="btn btn-primary" onClick={() => handleReply(comment.id)}>
            <i className="fa fa-reply"></i>Reply
          </button>
        </div>
      </li>

      {/* Render các bình luận con */}
      {comments.map((item) => {
        if (item.id_comment === comment.id) {
          return (
            <>
              <li className="media second-media">
                <a className="pull-left" href="#">
                  <img
                    className="media-object"
                    src={"http://localhost/doan/laravel8/public/upload/user/avatar/" + item.image_user}
                    alt="User Avatar"
                  />
                </a>

                <div className="media-body">
                  <ul className="sinlge-post-meta">
                    <li>
                      <i className="fa fa-user"></i>
                      {item.name_user}
                    </li>
                    <li>
                      <i className="fa fa-clock-o"></i>
                      {item.created_at}
                    </li>
                    <li>
                      <i className="fa fa-calendar"></i> DEC 5, 2013
                    </li>
                  </ul>
                  <p>{item.comment}</p>
                  <button className="btn btn-primary" onClick={() => handleReply(item.id)}>
                    <i className="fa fa-reply"></i>Reply
                  </button>
                </div>
              </li>
            </>
          );
        }
      })}
    </>
  );
})}
</ul>
// Việc truyền đối số vào hàm renderComments (như renderComments(comments)) là cần thiết khi bạn muốn hàm có khả năng tái sử dụng và linh hoạt trong việc xử lý dữ liệu đầu vào, đặc biệt khi sử dụng đệ quy.

// Giải thích:
// Tại sao không chỉ gọi hàm không đối số?

// Nếu bạn chỉ gọi renderComments() mà không truyền đối số, hàm đó sẽ không biết phải xử lý danh sách bình luận nào (hoặc sử dụng một biến toàn cục, điều này không khuyến khích vì tính không linh hoạt và khó kiểm soát).
// Khi sử dụng đệ quy, bạn cần truyền các tham số để hàm có thể xử lý một tập dữ liệu cụ thể (ví dụ: danh sách bình luận con cho một bình luận cha).
// Cách hoạt động khi truyền đối số:

// comments là danh sách toàn bộ bình luận (bao gồm cả bình luận cha và con).
// renderComments(comments, parentId = 0) nhận danh sách bình luận và chỉ hiển thị những bình luận có id_comment bằng parentId.
// parentId = 0 là bình luận cấp cha.
// Trong mỗi bước đệ quy, parentId sẽ thay đổi thành id của bình luận cha hiện tại, để hiển thị các bình luận con.
// Ví dụ về cách xử lý dữ liệu đệ quy:

// Hàm renderComments cần biết hai thông tin:
// comments: Dữ liệu danh sách bình luận.
// parentId: ID của bình luận cha hiện tại (mặc định là 0 để bắt đầu từ cấp cao nhất).
// javascript
// Copy code
// const renderComments = (commentList, parentId = 0) => {
//   return commentList
//     .filter((comment) => comment.id_comment === parentId) // Lọc các bình luận thuộc parentId
//     .map((comment) => (
//       <li key={comment.id}>
//         <p>{comment.comment}</p>
//         {/* Gọi đệ quy để render các bình luận con */}
//         <ul>{renderComments(commentList, comment.id)}</ul>
//       </li>
//     ));
// };
// Khi sử dụng trong render:
// Ở phần return của React:
// javascript
// Copy code
// <ul className="media-list">{renderComments(comments)}</ul>
// Lần đầu tiên, bạn truyền toàn bộ danh sách comments vào hàm, và hàm sẽ bắt đầu lọc các bình luận cấp cha (parentId = 0) để hiển thị. Sau đó, hàm tiếp tục gọi chính nó (đệ quy) để hiển thị bình luận con.
// So sánh hai cách:
// Chỉ gọi hàm không đối số (renderComments()):
// Hàm không đủ thông tin để xử lý (trừ khi comments và parentId được định nghĩa là biến toàn cục, nhưng điều này không tốt trong React vì làm giảm tính tái sử dụng và dễ gây lỗi).
// Truyền đối số (renderComments(comments)):
// Tính linh hoạt cao hơn: Bạn có thể dùng hàm với bất kỳ danh sách bình luận nào, không bị giới hạn bởi biến toàn cục.
// Dễ quản lý: Hàm luôn nhận đúng dữ liệu được truyền vào, không phụ thuộc vào trạng thái bên ngoài.
// Tóm lại:
// Ban đầu chỉ gọi hàm mà không truyền đối số có thể là cách đơn giản, nhưng khi xử lý dữ liệu phức tạp (như đệ quy để hiển thị bình luận), việc truyền đối số vào hàm là cần thiết để hàm hoạt động chính xác và tái sử dụng linh hoạt.

// EditProduct
// import MenuLeftAccount from "./MenuLeftAccount";
// import Errors from "../authentication/Errors";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { api, headerConfig, urlImage } from "../../api";

// function EditProduct() {
//     const auth = localStorage.getItem("auth");
//     const accessToken = localStorage.getItem("token");
//     const productLocalDad = localStorage.getItem('productWantEdit');

//     const [brands, setBrands] = useState([]);
//     const [error, setError] = useState({});
//     const [category, setCategory] = useState([]); 
//     const [image, setImage] = useState([]); // Lưu file ảnh của product đã được đăng trước đó 
//     const [checkImage, setCheckImage] = useState([]); //Lưu tên các image checked
//     console.log({checkImage});

//     const [avatar, setAvatar] = useState([]); // lưu các file ảnh được add vào product
//     console.log({avatar});

//     const [idUser, setIdUser] = useState(null); // Chứa ID của USER hiện tại
//     useEffect( () => {
//       if(auth){
//         const getID = JSON.parse(auth).id;
//         setIdUser(getID)
//       };
//     },[auth]);

//     const [productEdit, setProductEdit] = useState({
//         name: "",
//         price: "",
//         category: "",
//         brand: "",
//         status: "",
//         sale: "",
//         company: "",
//         detail: ""
//     });
//     console.log({productEdit});

//     //Hàm gọi API lấy dữ liệu Category và Brand
//     const handleFetchCategoryBrand = () => {
//         api.get('category-brand').then( res => {
//             if(res.data.category && res.data.brand){
//                 setCategory(res.data.category);
//                 setBrands(res.data.brand);
//             };
//         })
//     };

//     useEffect( () => {
//         handleFetchCategoryBrand()
//     },[]);    
   
//     //Hàm xử lý lấy dữ liệu product từ local về
//     const handleFetchDataProductLocal = () => {
//         let productLocal = productLocalDad;
//         if(productLocal){
//             productLocal = JSON.parse(productLocal);
//             console.log({productLocal});

//         //  //set dữ liệu cũ từ local vào sate để render ra các ô input

//          setProductEdit({
//             name: productLocal.name,
//             price: productLocal.price,
//             category: productLocal.id_category,
//             brand: productLocal.id_brand,
//             status: productLocal.status,
//             sale: productLocal.sale,
//             company: productLocal.company_profile,
//             detail: productLocal.detail
//          });
          
//          setImage(JSON.parse(productLocal.image)); //set all image product của user đó

//         }else{
//             toast.error('Không có product trong Local');
//         };
//     };

//     useEffect( () => {
//         handleFetchDataProductLocal();
//     },[]);

//     // Hàm xử lý khi các trường input và select thay đổi
//     const handleEditProductChange = (e) => {
//         const {name, value} = e.target;

//         setProductEdit( (prev) => {
//             const updateProduct = {
//                 ...prev,
//                 [name] : value
//             };
            
//             //Kiểm tra nếu status = 1 thì sẽ đưa sale về ""
//             if(name === 'status' && value === "1"){
//                 updateProduct.sale = "";
//             };

//             return updateProduct;
//         });
//     };

//     //Hàm xử lý khi trường nhập ảnh thay đổi
//     const handleFileAvatar = (e) => {
//         const files = Array.from(e.target.files); // Hàm Array.from() được sử dụng để tạo một mảng từ một đối tượng giống mảng
//         if(files.length > 0){
//             setAvatar( (prev) => [
//                 ...prev,
//                 ...files
//             ]);
//         };
//     };

//     //Hàm xử lý khi user click vào các ô checkbox
//     const handleCheckBox = (e) => {
//         const {value, checked} = e.target;
//         setCheckImage( (prev) => {
//             if(checked){
//                 const updateCheckBox = [
//                     ...prev,
//                     value
//                 ]
//                 return updateCheckBox
//             }else{
//                 return prev.filter( image => image !== value);
//             };
//         });
//     };

//     //Hàm xử lý khi user submit form edit
//     const handleSubmitEdit = (e) => {
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
//         } else{
//             dataError = null;
//             setError({});

//             if(!accessToken){
//                 toast.error("Token không tồn tại !");
//                 return;
//             };

//             const formData = new FormData();
//             formData.append("name", productEdit.name);
//             formData.append("price", productEdit.price);
//             formData.append("category", productEdit.category);
//             formData.append("brand", productEdit.brand);
//             formData.append("company", productEdit.company);
//             formData.append("detail", productEdit.detail);
//             formData.append("status", productEdit.status); 
//             formData.append("sale", productEdit.sale);
//             formData.append("avatarCheckBox[]", checkImage);

//             avatar.map((valueFile) => {
//                 formData.append("file[]", valueFile);
//             });

//             //Gọi api để post product vừa edit
//             if(productLocalDad){
//                 let idProduct = JSON.parse(productLocalDad).id;
//                 api.post("user/product/update/" + idProduct, formData, headerConfig(accessToken))
//                    .then( res => {
//                        if(res.data.error){
//                         setError(res.data.error);
//                        }else{
//                         toast.success('Edit product thành công ');
//                         setAvatar([]);
//                        };
//                    })

//                    .catch( err => {
//                        toast.error(err);
//                    })
//             };  
//         };
//     };

//    return(
//     <>
//     <MenuLeftAccount/>
//             <div className="col-sm-9">
//                 <div className="blog-post-area">
//                     <h2 className="title text-center">Edit product</h2>
//                     <div className="signup-form">
//                       <h2>Recreate the product</h2>
//                       <form onSubmit={handleSubmitEdit} enctype="multipart/form-data">

//                     {/* Name */}
//                         <div className="input">

//                            <label>Name</label>
//                            <input 
//                              type="text" 
//                              name="name" 
//                              value={productEdit.name} 
//                              onChange={handleEditProductChange} 
//                              placeholder="Name" />
//                         </div>

//                     {/*Price */}
//                     <div className="input">
//                          <label htmlFor="oke">Price</label>                       
//                          <input 
//                          type="text" 
//                          name="price" 
//                          value={productEdit.price} 
//                          onChange={handleEditProductChange} 
//                          placeholder="Price"/>
//                     </div>     

//                     {/* Category */}
//                     <div className="input">
//                          <label>Category</label>
//                          <select 
//                          name="category"                      
//                          onChange={handleEditProductChange}
//                          value={productEdit.category}
//                          >
//                             <option value="" disabled >Please choose category</option>
//                             {category.map( ( objectCategory ) => (
//                                     <option value={objectCategory.id}>{objectCategory.category}</option>
//                                 ))}
//                          </select>
//                     </div>     

//                     {/*Brands */}
//                     <div className="input">
//                          <label>Brand</label>
//                          <select 
//                          name="brand" 
//                          onChange={handleEditProductChange}
//                          value={productEdit.brand}
//                         >
//                             <option value="" disabled >Please choose brand</option>
//                             {brands.map( (objectBrands) => (
//                                 <option value={objectBrands.id}>{objectBrands.brand}</option>
//                             ))}
//                          </select>
//                     </div>     
               
//                     {/* Status là sale hay new */}   
//                     <div className="input">
//                          <label>Status</label>                       
//                          <select 
//                          name="status" 
//                          onChange={handleEditProductChange} 
//                          value={productEdit.status}
//                          >
//                             <option value="" disabled >Please choose status</option>
//                             <option value={0}>sale</option>
//                             <option value={1}>new</option>
//                          </select>
//                     </div>     

//                     {/* Khi chọn status là sale thì hiển thị input nhập giá sale */}
//                         {(productEdit.status === '0' || productEdit.status === 0) && (
//                         <div className="input"> 
//                             <label>Price sale</label>       
//                             <div className="priceSale">
//                                 <input className="oke" type="text" placeholder="0" name="sale" value={productEdit.sale} 
//                                 onChange={handleEditProductChange} 
//                                 /> 
//                                 <p>%</p>
//                             </div>       
//                         </div>     
//                         )}

//                     {/* Company profile */}
//                     <div className="input">
//                          <label>Company</label>
//                          <input 
//                          type="text" 
//                          value={productEdit.company} 
//                          name="company" 
//                          onChange={handleEditProductChange} 
//                          placeholder="Company profile"/>
//                     </div>

//                     {/* Chọn avatar */}
//                          <input 
//                          type="file" 
//                          onChange={handleFileAvatar} 
//                          name="avatar" multiple/>
                        
//                         {/* Những file avatar đã được upload từ trước */}
//                         <div className="div-uploaded">
//                              <h5>Files Uploaded:</h5>
//                         {image.map( childrenImage => {
//                             return (
//                                 <>
//                                      <ul>
//                                          <li className="li-image">

//                                             <img src={`${urlImage}/product/${idUser}/${childrenImage}`} />
 
//                                             <input 
//                                                 type="checkbox" 
//                                                 className="check-box-update"
//                                                 value={childrenImage}
//                                                 onChange={handleCheckBox}
//                                             />

//                                          </li>
//                                     </ul>
                                        
//                                 </>
//                             )
//                         })}
//                         </div>

//                     {/* Detail */}
//                     <div className="input">
//                          <label>Detail</label>
//                          <textarea 
//                          id="comment-detail" 
//                          name="detail" 
//                          value={productEdit.detail} 
//                          onChange={handleEditProductChange} 
//                          placeholder="Nhập nội dung detai ...">
//                          </textarea>
//                     </div>   

//                         <Errors errors={error}/>

//                          <button type="submit" class="btn btn-default">Submit</button>

//                       </form>
//                     </div>
//                 </div>
//             </div>

//     </>


//    )

// };
// export default EditProduct;

import { useEffect, useState } from "react";
import { api, urlImage } from "../../api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "./Context";

function ProductHome() {
  const { filterProductFollowAccount } = useCart(); // dùng useContext
  const [allProduct, setAllProduct] = useState({});
  console.log({ allProduct });

  const [idProductWishList, setIdProductWishList] = useState([]); //Lưu trữ id của những product mà user đã add to wishlist
  console.log({idProductWishList});
 
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
    setIdProductWishList(dataWishList);  // Chỉ set lại khi có dữ liệu
  }, []);

  useEffect( () => {
    if(idProductWishList.length > 0){
      localStorage.setItem("WishList", JSON.stringify(idProductWishList) ); //set id của những product mà user chọn vào local
    }
  },[idProductWishList]);

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
    setIdProductWishList( (prev) => {
      if(!prev.includes(idProduct)){
        const updateWishList = [...prev, idProduct];
        toast.success(`Thêm ${nameProduct} vào wishlist thành công `);
        return updateWishList;
      }else{
        toast.info(`${nameProduct} đã có trong wishlist`);
        return prev;
      }
    });  
  };

  return (
    <>
      <div class="col-sm-9 padding-right">
        <div class="features_items">
          <h2 class="title text-center">Features Items</h2>

          {Object.values(allProduct).map((product) => {
            const idUser = product.id_user;
            const getImage = JSON.parse(product.image);
            const firstImage = getImage[0];
            console.log({ product });
            return (
              <>
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
                            <div className="productNumber">{filterProductFollowAccount.length}</div>
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
                          <a onClick={ () => handleAddToWishList(product.id, product.name)} className="wishlist">
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
              </>
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
    </>
  );
}
export default ProductHome;


import { useEffect, useState } from "react";
import { api, urlImage } from "../../api";
import { toast } from "react-toastify";

function WishList() {
  const [productWishList, setProductWishList] = useState([]); // Lưu trữ các sản phẩm wishlist
  const [idWishList, setIdWishList] = useState([]); // Lưu trữ các id của sản phẩm trong wishlist

  // Lấy wishlist từ localStorage
  useEffect(() => {
    const getWishList = localStorage.getItem("WishList");
    const dataWishList = getWishList ? JSON.parse(getWishList) : [];
    setIdWishList(dataWishList); // Cập nhật danh sách id sản phẩm wishlist
  }, []);

  // Hàm xử lý lấy product từ API wishlist về
  const handleGetProductWishList = () => {
    api
      .get("product/wishlist")
      .then((res) => {
        const getProduct = res.data.data;
        if (getProduct) {
          const product = getProduct.filter((productChild) =>
            idWishList.includes(productChild.id)
          );
          setProductWishList(product);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  // Lấy danh sách sản phẩm mỗi khi idWishList thay đổi
  useEffect(() => {
    if (idWishList.length > 0) {
      handleGetProductWishList();
    }
  }, [idWishList]);

  // Hàm xử lý khi user click delete sản phẩm khỏi wishlist
  const handleDeleteWishList = (idProduct) => {
    const remainingProductId = idWishList.filter((id) => id !== idProduct);
    setIdWishList(remainingProductId);

    // Set lại localStorage với danh sách id sản phẩm còn lại
    localStorage.setItem("WishList", JSON.stringify(remainingProductId));

    // // Cập nhật lại productWishList để xóa sản phẩm khỏi giao diện
    const remainingProduct = productWishList.filter(
      (product) => product.id !== idProduct
    );
    setProductWishList(remainingProduct);

    toast.success("Sản phẩm đã được xóa khỏi wishlist");
  };

  return (
    <>
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
                      <img
                        src={`${urlImage}/product/${product.id_user}/${firstImage}`}
                        alt=""
                      />
                      <h2>{product.price}$</h2>
                      <p>{product.name}</p>
                      <a href="#" className="btn btn-default add-to-cart">
                        <i className="fa fa-shopping-cart"></i>Add to cart
                      </a>
                      <a
                        onClick={() => handleDeleteWishList(product.id)}
                        style={{ marginLeft: 7 }}
                        className="btn btn-default add-to-cart"
                      >
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
    </>
  );
}

export default WishList;




