import { useEffect, useState } from "react";
import Errors from "../authentication/Errors";
import { toast } from "react-toastify";
import { api } from "../../api";
import MenuLeftAccount from "./MenuLeftAccount";

function UpdateMember() {

  const [error, setError] = useState({});
  const [getFile, setGetFile] = useState(null); // Lưu file gốc vào useState để lấy ra kiểm tra type và size
  console.log({getFile});

  const accessToken = localStorage.getItem("token"); // Lấy token
  const getAuthUser = localStorage.getItem("auth"); // Lấy auth của user trên local
  let idUser;
  if (getAuthUser) {
    idUser = JSON.parse(getAuthUser).id;
  }

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    avatar: null,
    level: 0,
  });
  console.log({ userData });

  // Hàm lấy dữ liệu có sẵn từ trước của user trong local và render ra các ô input
  const handleFetchOldLocal = () => {
    let userLocalData = localStorage.getItem("auth");

    if (userLocalData) {
      userLocalData = JSON.parse(userLocalData);
      console.log({ userLocalData });

      //set dữ liệu cũ từ local vào sate để render ra các ô input
      setUserData({
        name: userLocalData.name,
        email: userLocalData.email,
        password: "",
        phone: userLocalData.phone,
        address: userLocalData.address,
        avatar: userLocalData.avatar,
        level: 0,
      });
    }
  };

  useEffect(() => {
    handleFetchOldLocal();
  }, []);

  // Hàm Xử lý file hình ảnh avatar
  const handleFile = (e) => {
    const uploadFile = e.target.files[0];
    if (uploadFile) {
      setGetFile(uploadFile);
    }

    //Mã hoá để gửi qua API
    let reader = new FileReader();

    reader.readAsDataURL(uploadFile);
    reader.onload = (e) => {
      setUserData((state) => ({
        ...state,
        avatar: e.target.result,
      }));
    };
  };

  // Hàm Xử lý Forminput register khi các trường trong input có thay đổi
  const handleUpdate = (event) => {
    const { name, value } = event.target;

    setUserData((stateUserData) => ({
      ...stateUserData,
      [name]: value,
    }));
  };

  // Hàm xử lý khi bấm submit dữ liệu profile mà ngừoi dùng vừa update
  const handleSubmitDataUpdate = (e) => {
    e.preventDefault();
    let dataError = {};
    let flag = true;

    if (!userData.name) {
      dataError.name = "Name không được để trống !";
      flag = false;
    }

    if (!userData.phone) {
      dataError.phone = "Phone không được để trống !";
      flag = false;
    }

    if (!userData.address) {
      dataError.address = "Address không được để trống !";
      flag = false;
    }

    if (userData.avatar === null) {
      dataError.avatar = "Avatar không được để trống !";
      flag = false;
    } else {

      if (getFile) {
        const { type, size } = getFile;

        if (!type.includes("image")) {
          dataError.avatarType = "Vui lòng chọn đúng định dạng hình ảnh!";
          flag = false;
        } else if (size > 1024 * 1024) {
          dataError.avatarSize = "Vui lòng chọn hình ảnh nhỏ hơn 1MB!";
          flag = false;
        }
        
      }

    }

    if (!flag) {
      setError(dataError);
      return;
    } else {
      dataError = null;
      setError({});

      // Kiểm tra xem có token tồn tại hay không trước khi gọi API
      if (!accessToken) {
        console.log("Token không tồn tại !");
        return;
      }

      // Truyền token vào header
      let config = {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      };

      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("phone", userData.phone);
      formData.append("address", userData.address);
      formData.append("avatar", userData.avatar);
      formData.append("level", 0);

      api
        .post("user/update/" + idUser, formData, config)
        .then((res) => {
          const token = res.data.token;
          const auth = res.data.Auth;
          const authJson = JSON.stringify(auth);

          // Lấy auth và token mới vào local
          localStorage.setItem("auth", authJson);
          localStorage.setItem("token", token);

          toast.success("Update thông tin thành công");
        })

        .catch((error) => {
          console.log(error);
          toast.error("Có lỗi khi gọi API để post, hãy xem trong console");
        });
    }
  };

  return (
    <>
      <MenuLeftAccount/>    
      
      <div class="col-sm-9">
        <div class="blog-post-area">
          <h2 class="title text-center">Update user</h2>
          <div class="signup-form">
            <h2>User update</h2>

            <form onSubmit={handleSubmitDataUpdate} enctype="multipart/form-data">
              {/* Nhập name để đăng ký */}
              <input type="text" placeholder="Name" name="name" value={userData.name} onChange={handleUpdate} />

              {/*Nhập email để đăng ký  */}
              <input type="email" readOnly placeholder="Email Address" name="email" value={userData.email} />

              {/* Nhập password để đăng ký */}
              <input type="password" placeholder="Password" name="password" value={userData.password} onChange={handleUpdate} />

              {/* Nhập password để đăng ký */}
              <input type="text" placeholder="your phone" name="phone" value={userData.phone} onChange={handleUpdate} />

              {/* Nhập address để đăng ký */}
              <input type="text" placeholder="your address" name="address" value={userData.address} onChange={handleUpdate} />

              {/* Chọn Avatar để đăng ký */}
              <input type="file" name="avatar" onChange={handleFile} />

              {/* Chọn Level */}
              <select name="level">
                <option value={0}>Member</option>
              </select>

              <Errors errors={error} />

              <button type="submit" className="btn btn-default">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateMember;
