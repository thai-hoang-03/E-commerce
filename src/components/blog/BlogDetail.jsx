import { useEffect, useState } from "react";
import { api } from "../../api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Rate from "../blog/Rate.jsx";

function BlogDetail() {
  const params = useParams();

  const navigate = useNavigate(); //hook điều hướng

  const [blogDetail, setBlogDetail] = useState(null);

  const [comments, setComments] = useState([]);

  const [idComment, setIdComment] = useState(0); // khai báo idComment cho phần comment là 0 ( bình luận cha)

  const [commentContent, setCommentContent] = useState(""); // Khai báo nội dung phần bình luận
  
  const accessToken = localStorage.getItem("token");
  const getAuthUser = localStorage.getItem("auth"); // Lấy auth của user trên local
  let idUser, nameUser, imageUser; //khai báo thông tin của user
  if(getAuthUser) {
    idUser = JSON.parse(getAuthUser).id;
    nameUser = JSON.parse(getAuthUser).name;
    imageUser = JSON.parse(getAuthUser).avatar;
  }
  
  // Sử dụng filter để lọc những bình luận cha
  // const parentComent = comments ? comments.filter((filterComment) =>  filterComment.id_comment === 0 ) : []; // nếu có comments thì mới dùng filter
  // console.log({ parentComent });

  // Hàm lấy blog detail và danh sách comment từ API
  const handleFetchDetailBlog = (hasBlogDetail = true) => {
    api.get("/blog/detail/" + params.id)
    .then((res) => {
      if (hasBlogDetail) {
        setBlogDetail(res.data.data);
      }
      if (res.data.data && res.data.data.comment) { // kiểm tra có comment thì mới được set
        setComments(res.data.data.comment);
      } else {
        setComments([]); // Nếu không có comment, đặt giá trị là mảng rỗng
      }
    })

    .catch(error => {
      toast.error(error);
      setComments([]);
    })
  };

  useEffect(() => {
    handleFetchDetailBlog();
  }, [params.id]);

  useEffect(() => {
    console.log({ comments });
  }, [comments]);


  //Hàm xử lý input khi trường nhập comment thay đổi ( ngừoi dùng nhập bình luận)
  const handleComment = (event) => {
    //kiểm tra xem khi muốn bình luận thì đã login hay chưa
    if (!getAuthUser) {
      toast.error("Không thể bình luận do chưa đăng nhập !");
      navigate("/login");
      return;
    }
    setCommentContent(event.target.value);
  };

  // Hàm xử lý khi người dùng click vào button "post comment"
  const handlePostComment = () => {

    //Lấy thông tin user từ auth
    // const idUser = JSON.parse(getAuthUser).id;
    // const nameUser = JSON.parse(getAuthUser).name;
    // const imageUser = JSON.parse(getAuthUser).avatar;
    console.log(idUser, nameUser, imageUser, accessToken);

    let config = {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    };

    //Kiểm tra xem nếu muốn post comment thì trong ô nhập liệu phải có nội dung
    if (commentContent) {
      const formData = new FormData();
      formData.append("id_blog", params.id);
      formData.append("id_user", idUser);
      formData.append("id_comment", idComment);
      formData.append("comment", commentContent);
      formData.append("image_user", imageUser);
      formData.append("name_user", nameUser);

      api
        .post("/blog/comment/" + params.id, formData, config)
        .then((res) => {

          // Set vào comments ngay sau khi post để tránh trường hợp bất đồng bộ do API POST 
          // lên reply của 1 comment con và bên sever chưa kịp GET và trả về data
          // Tóm lại làm như này là để khi mà post lên 1 phát là có data của comment đó trong state comments 
          // luôn, chứ không phải đợi sever trả về rồi mới gọi API để get (do độ trễ của API GET trả response có thể nhanh hoặc chậm, nếu chậm thì ngừoi dùng không nhìn thấy comment của mình ngay )
          const newComment = res.data.data.comment;
          console.log({newComment});
          setComments( (prev) => [
            ...prev,
            newComment
          ]);
          
          // Gọi lại hàm handeFetch để get comment mà sever trả về
          handleFetchDetailBlog(false);
          setCommentContent(""); // xoá nội dung trong ô nhập liệu sau khi post
          toast.success("Đăng bình luận thành công !");
        })

        .catch((error) => {
          console.log(error);
          toast.error("Có lỗi, hãy xem trong console !");
        });
    } else {
      toast.error("Vui lòng nhập bình luận !");
    }
  };

  // Hàm xử lý khi người dùng click REPLY
  const handleReply = (dadCommentID) => {
    // console.log({dadCommentID});
    setIdComment(dadCommentID);
    document.getElementById("comment-input").focus();
  };

  // Hàm đệ quy xử lý để render các comment từ cha tới con 
  const renderComments = (commentList, parentId = 0) => {
    return commentList
      .filter((comment) => comment.id_comment === parentId)
      .map((comment) => (
        <>
        <li className={`media ${parentId === 0 ? "" : "second-media"}`}>
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
                <i className="fa fa-user"></i> {comment.name_user}
              </li>
              {/* <li>
                <i className="fa fa-clock-o"></i> {comment.created_at}
              </li> */}
            </ul>
            <p>{comment.comment}</p>
            <button className="btn btn-primary" onClick={() => handleReply(comment.id)}>
              <i className="fa fa-reply"></i> Reply
            </button>
          </div>

          <ul className="media-list">{renderComments(commentList,comment.id)}</ul> {/* Đệ quy để render bình luận con */}

        </li>
        </>
      ));
  };
  

  return (
    <>
      <div className="col-sm-9">
        {blogDetail && (
          <>
            <div className="blog-post-area">
              <h2 className="title text-center">Latest From our Blog</h2>

              <div className="single-blog-post">
                <h3>{blogDetail.title}</h3>
                <div className="post-meta">
                  <ul>
                    <li>
                      <i className="fa fa-user"></i> Mac Doe
                    </li>
                    <li>
                      <i className="fa fa-clock-o"></i>
                      {blogDetail.created_at}
                    </li>
                    <li>
                      <i className="fa fa-calendar"></i> {blogDetail.updated_at}
                    </li>
                  </ul>
                </div>
                <a href="#">
                  <img src={"http://localhost/doan/laravel8/public/upload/Blog/image/" + blogDetail.image} alt="Blog Post" />
                </a>
                <p>{blogDetail.content}</p>

                <div className="pager-area">
                  <ul className="pager pull-right">
                    <li>
                      <a href="#">Pre</a>
                    </li>
                    <li>
                      <a href="#">Next</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rating-area">
              
              <Rate user_id = {idUser} blog_id = {params.id} isLogged = {getAuthUser} accessToken = {accessToken} /> {/* component rating ở đây */}
               
              <ul className="tag">
                <li>TAG:</li>
                <li>
                  <a className="color" href="#">
                    Pink <span>/</span>
                  </a>
                </li>
                <li>
                  <a className="color" href="#">
                    T-Shirt <span>/</span>
                  </a>
                </li>
                <li>
                  <a className="color" href="#">
                    Girls
                  </a>
                </li>
              </ul>
            </div>

            <div className="socials-share">
              <a href="#">
                <img src="/images/blog/socials.png" alt="Social Share" />
              </a>
            </div>
            
          {/* Phần bình luận  */}
          <div className="response-area">
              <h2>{comments.length} RESPONSES</h2>
              <ul className="media-list">
                  {renderComments(comments)} 
              </ul>
            </div>
          
            {/* Viết feedback reply */}
            <div className="replay-box">
              <div className="row">
                <div className="col-sm-12">
                  <h2>Leave a replay</h2>
                  <div className="text-area">
                    <div className="blank-arrow">
                      <label>Your Name</label>
                    </div>
                    <span>*</span>
                    <textarea id="comment-input" name="message" rows="11" value={commentContent} onChange={handleComment}></textarea>
                    <button className="btn btn-primary" onClick={handlePostComment}>
                      post comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default BlogDetail;
