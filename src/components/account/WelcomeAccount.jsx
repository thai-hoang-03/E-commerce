import { Link } from "react-router-dom";


const WelcomeAccount = () => {

  return (   

    <div className="account-container">
        <div className="account-message">
          <Link to="/updateMember">Welcome to your account</Link>
        </div>
    </div>

  );
};

export default WelcomeAccount;
