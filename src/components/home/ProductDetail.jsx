import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, urlImage } from "../../api";
import { toast } from "react-toastify";

function ProductDetail() {
  const params = useParams();

  const [productDetail, setProductDetail] = useState({});
  console.log({ productDetail });
  const [imageProduct, setImageProduct] = useState([]);

  //Hàm xử lý lấy product detail từ API về
  const handleFetchProductDetail = () => {
    if (params.id) {
      api
        .get("product/detail/" + params.id)
        .then((res) => {
          if (res.data.data) {
            setProductDetail(res.data.data);
            if (res.data.data.image) {
              setImageProduct(JSON.parse(res.data.data.image)); //set all image product của user đó
            }
          }
        })

        .catch((err) => {
          toast.error(err);
        });
    }
  };

  useEffect(() => {
    handleFetchProductDetail();
  }, [params.id]);

  return (
    <>
      <div className="col-sm-9 padding-right">
        <div className="product-details">
          {/*Bên trái product detail  */}
          <div className="col-sm-5">
            <div className="view-product">
              <img src={`${urlImage}/product/${productDetail.id_user}/${imageProduct[0]}`} alt="" />
              <a href="images/product-details/1.jpg" rel="prettyPhoto">
                <h3>ZOOM</h3>
              </a>
            </div>
            <div id="similar-product" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner"> {/*Tạm thời để display:flex*/}
                {imageProduct.map((image) => {
                  return (
                    <>

                      <div className="item active">
                        <a href="">
                          <img src={`${urlImage}/product/${productDetail.id_user}/${image}`} alt="Similar Product" />
                        </a>
                      </div>

                      {/* <div className="item">
                        <a href="">
                          <img src={`${urlImage}/product/${productDetail.id_user}/${image}`} alt="Similar Product" />
                        </a>
                      </div>

                      <div className="item">
                        <a href="">
                          <img src={`${urlImage}/product/${productDetail.id_user}/${image}`} alt="Similar Product" />
                        </a>
                      </div> */}

                    </>
                  );
                })}
              </div>

              {/* Controls */}
              <a className="left item-control" href="#similar-product" data-slide="prev">
                <i className="fa fa-angle-left"></i>
              </a>
              <a className="right item-control" href="#similar-product" data-slide="next">
                <i className="fa fa-angle-right"></i>
              </a>
            </div>
          </div>

          {/*Bên phải product detail  */}
          <div className="col-sm-7">
            <div className="product-information">
              <img src="/images/product-details/new.jpg" className="newarrival" alt="New Product" />
              <h2>{productDetail.name}</h2>
              <p>Web ID: {productDetail.web_id}</p>
              <img src="/images/product-details/rating.png" alt="Rating" />
              <span>
                <span>US ${productDetail.price}</span>
                <label>Quantity:</label>
                <input type="number" defaultValue="3" />
                <button type="button" className="btn btn-default cart">
                  <i className="fa fa-shopping-cart"></i>
                  Add to cart
                </button>
              </span>
              <p>
                <b>Availability:</b> In Stock
              </p>
              <p>
                <b>Condition:</b> {productDetail.condition}
              </p>
              <p>
                <b>Brand:</b> E-SHOPPER
              </p>
              <a href="">
                <img src="/images/product-details/share.png" className="share img-responsive" alt="Share" />
              </a>
            </div>
          </div>
        </div>

        <div className="category-tab shop-details-tab">
          <div className="col-sm-12">
            <ul className="nav nav-tabs">
              <li>
                <a href="#details" data-toggle="tab">
                  Details
                </a>
              </li>
              <li>
                <a href="#companyprofile" data-toggle="tab">
                  Company Profile
                </a>
              </li>
              <li>
                <a href="#tag" data-toggle="tab">
                  Tag
                </a>
              </li>
              <li className="active">
                <a href="#reviews" data-toggle="tab">
                  Reviews (5)
                </a>
              </li>
            </ul>
          </div>
          <div className="tab-content">
            <div className="tab-pane fade" id="details">
              {/* Details content here */}
            </div>

            <div className="tab-pane fade" id="companyprofile">
              {/* Company profile content here */}
            </div>

            <div className="tab-pane fade" id="tag">
              {/* Tag content here */}
            </div>

            <div className="tab-pane fade active in" id="reviews">
              <div className="col-sm-12">
                <ul>
                  <li>
                    <a href="">
                      <i className="fa fa-user"></i>EUGEN
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <i className="fa fa-clock-o"></i>12:41 PM
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <i className="fa fa-calendar-o"></i>31 DEC 2014
                    </a>
                  </li>
                </ul>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                  ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <p>
                  <b>Write Your Review</b>
                </p>

                <form action="#">
                  <span>
                    <input type="text" placeholder="Your Name" />
                    <input type="email" placeholder="Email Address" />
                  </span>
                  <textarea name=""></textarea>
                  <b>Rating: </b> <img src="/images/product-details/rating.png" alt="Rating" />
                  <button type="button" className="btn btn-default pull-right">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="recommended_items">
          <h2 className="title text-center">recommended items</h2>
          <div id="recommended-item-carousel" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">{/* Recommended items content here */}</div>
            <a className="left recommended-item-control" href="#recommended-item-carousel" data-slide="prev">
              <i className="fa fa-angle-left"></i>
            </a>
            <a className="right recommended-item-control" href="#recommended-item-carousel" data-slide="next">
              <i className="fa fa-angle-right"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
