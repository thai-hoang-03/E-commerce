import { Link } from "react-router-dom";
function MenuLeftAccount() {
  return (
    <>
      <div className="col-sm-3">
        <div className="left-sidebar">
          <h2>Category Account</h2>
          <div className="panel-group category-products" id="accordian">

            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                <Link className="link-style" to="/updateMember">Update user</Link>
                </h4>
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading"> 
                <h4 className="panel-title">
                <Link className="link-style" to="/myProduct">My product</Link> 
                </h4>
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading"> 
                <h4 className="panel-title">
                <Link className="link-style" to="/addProduct">Add product</Link> 
                </h4>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
export default MenuLeftAccount;
