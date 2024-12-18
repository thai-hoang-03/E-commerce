import { useState } from "react";
import Errors from "./Errors";
import { api } from "../../api/index.js";
import { toast } from "react-toastify";

function Register() {
  // Form sau khi submit signup
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    avatar: null,
    level: 0,
  });

  const [getFile, setGetFile] = useState(null); // Lưu file gốc vào useState để lấy ra kiểm tra type và size
  const [errors, setErrors] = useState({}); // Lỗi
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // file avatar

  // Xử lý Forminput register khi các trường trong input có thay đổi
  const handleSignupChange = (event) => {
    const { name, value } = event.target;

    setSignup((stateSignUp) => ({
      ...stateSignUp,
      [name]: value,
    }));
  };
  //   console.log(signup);

  // Xử lý file hình ảnh avatar
  const handleFile = (e) => {
    const uploadFile = e.target.files[0];
    if (uploadFile) {
      setGetFile(uploadFile);
    }

    //Mã hoá để gửi qua API
    let reader = new FileReader();
    reader.onload = (e) => {
      setSignup((state) => ({
        ...state,
        avatar: e.target.result,
      }));
    };
    reader.readAsDataURL(uploadFile);
  };

  // Hàm submit
  const handleSubmit = (e) => {
    e.preventDefault();
    let errorsSubmit = {};
    let flag = true;

    if (!signup.name) {
      errorsSubmit.name = "Vui lòng nhập tên!";
      flag = false;
    }
    if (!signup.email) {
      errorsSubmit.email = "Vui lòng nhập email!";
      flag = false;
    }
    if (!signup.password) {
      errorsSubmit.password = "Vui lòng nhập mật khẩu!";
      flag = false;
    }
    if (!signup.phone) {
      errorsSubmit.phone = "Vui lòng nhập số điện thoại!";
      flag = false;
    }
    if (!signup.address) {
      errorsSubmit.address = "Vui lòng nhập địa chỉ!";
      flag = false;
    }
    if (signup.avatar === null) {
      errorsSubmit.avatar = "Vui lòng chọn Avatar !!!";
      flag = false;
    } else {
      const { type, size } = getFile;
      if (!type.includes("image")) {
        errorsSubmit.avatarType = "Vui lòng chọn đúng định dạng hình ảnh!";
        flag = false;
      } else if (size > 1024 * 1024) {
        errorsSubmit.avatarSize = "Vui lòng chọn hình ảnh nhỏ hơn 1MB!";
        flag = false;
      }
    }
    if (!flag) {
      setErrors(errorsSubmit);
      return;
    } else {
      errorsSubmit = null;
      setErrors({});

	  // Gọi API để post data
      const sendDataApi = {
        name: signup.name,
        email: signup.email,
        password: signup.password,
        phone: signup.phone,
        address: signup.address,
        avatar: signup.avatar,
        level: 0,
      };
	
      api.post("register", sendDataApi).then((response) => {
        if (response.data.errors) {
          setErrors(response.data.errors);
        } else {
          console.log(response.data);
		      toast.success("Register account successfully!");
          setSignup({
            name: "",
            email: "",
            password: "",
            phone: "",
            address: "",
            avatar: null,
            level: 0,
          });
          setGetFile(null);
          setFileInputKey(Date.now()); // Reset key để render lại input file
        }
      });
    };
  };


  return (
    <>
      <div className="col-sm-4">
        <div className="signup-form">
          <h2>New User Signup!</h2>
          <form onSubmit={handleSubmit} enctype="multipart/form-data">
            {/* Nhập name để đăng ký */}
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={signup.name}
              onChange={handleSignupChange}
            />
            {/*Nhập email để đăng ký  */}
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={signup.email}
              onChange={handleSignupChange}
            />
            {/* Nhập password để đăng ký */}
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={signup.password}
              onChange={handleSignupChange}
            />
            {/* Nhập password để đăng ký */}
            <input
              type="text"
              placeholder="your phone"
              name="phone"
              value={signup.phone}
              onChange={handleSignupChange}
            />
            {/* Nhập address để đăng ký */}
            <input
              type="text"
              placeholder="your address"
              name="address"
              value={signup.address}
              onChange={handleSignupChange}
            />
            {/* Chọn Avatar để đăng ký */}
            <input key={fileInputKey} type="file" name="avatar" onChange={handleFile} />
            {/* Chọn Level */}
            <select name="level">
              <option value={0}>Member</option>
            </select>
            <Errors errors={errors} />

            <button type="submit" className="btn btn-default">
              Signup
            </button>
          </form>

        </div>
      </div>
    </>
  );
}
export default Register;
