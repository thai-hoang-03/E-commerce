import { useState } from 'react';
import Register from './Register';
import Errors from './Errors';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { toast } from "react-toastify";

function Login() {

// Form sau khi submit
  const [login, setLogin] = useState({
	email: '',
	password: '',
  });

const [errors, setErrors] = useState({}); // useState cho lỗi

const navigate = useNavigate(); //hook điều hướng

// Xử lý Forminput login khi các trường trong input có thay đổi
  const handleLoginChange = (event) => {
	const { name, value } = event.target;
    
	setLogin((prevStateLogin) => ({
		...prevStateLogin,
		[name]: value
	  }));
  };

// Hàm submit Form Login

  const handleSubmit = e => {
	e.preventDefault();
	let errorsSubmit = {};
    let flag = true;

	if(!login.email){
		errorsSubmit.email = 'Vui lòng nhập email!';
		flag = false;
	};

	if(!login.password){
		errorsSubmit.password = 'Vui lòng nhập password!';
		flag = false;
	};

	if(!flag){
		setErrors(errorsSubmit);
	}else{
		errorsSubmit = null;
        setErrors({});
        
		// Gọi API để post data
		const sendDataApi = {
			email: login.email,
			password: login.password,
			level: 0
		};

		api.post('login', sendDataApi).then(response => {
			if(response.data.errors){
				setErrors(response.data.errors)
			}else{
				console.log(response.data);
				const{token, Auth} = response.data;
				const authJson = JSON.stringify(Auth); 
				// console.log(Auth);
				//Lưu token và auth vào local
				localStorage.setItem('token', token);
				localStorage.setItem('auth', authJson);
				toast.success("Login successfully!");
				navigate('/productHome'); //sau khi login thành công thì chuyển về trang Home
			};
		})

		.catch( err => {
			setErrors(err);
		})
	};
  };


  return (
    <>
    <section id="form">
		<div className="container">
			<div className="row">
				<div className="col-sm-4 col-sm-offset-1">
					<div className="login-form">
						<h2>Login to your account</h2>
						<form onSubmit={handleSubmit}>
                        {/* Nhập email */}
							<input 
							 type="email" 
							 placeholder="Email Address" 
							 name='email'
							 onChange={handleLoginChange}
							 />
						{/* Nhập password */}
						    <input 
							 type="password" 
							 placeholder="Password"
							 name='password'
							 onChange={handleLoginChange}
							/>	 
						{/* Click checkbox */}
							<span>
							  <input 
							  type="checkbox" 
							  name="keepSignedIn"
							  className="checkbox"
							//   onChange={handleLoginChange}         
							  /> 
								Keep me signed in
							</span>

							<Errors errors={errors} /> {/* Lỗi xuất hiện ở đây */}

							<button type="submit" className="btn btn-default">Login</button>
						</form>
					</div>
				</div>
				<div className="col-sm-1">
					<h2 className="or">OR</h2>
				</div>

				<Register/>

			</div>
		</div>
	</section>
    </>
  );
}

export default Login;



