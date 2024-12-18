import StarRatings from "react-star-ratings";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { api } from "../../api";

function Rate(props) {
  const { user_id, blog_id, isLogged, accessToken } = props;

  const params = useParams();
  const navigate = useNavigate();

  const [numberVote, setNumberVote] = useState(0); // số vote
  const [rating, setRating] = useState(0);

  useEffect(() => {
    console.log({ rating });
  }, [rating]);

  //Hàm lấy rating từ API
  const handleFetchRating = () => {
    api
      .get("blog/rate/" + params.id)
      .then((res) => {
        const dataRatingApi = res.data.data;
        // console.log({ dataRatingApi });
        var ratingValues = Object.values(dataRatingApi);
        console.log({ ratingValues });
        setNumberVote(ratingValues.length)

        //Kiểm tra xem API trả về có dữ liệu hay không
        if (ratingValues && ratingValues.length > 0) {
          let total = 0;

          // Map lấy rate
          ratingValues.map((dataRating) => {
            return (total += dataRating.rate);
          });
          const average = total / ratingValues.length;
          setRating(average);
        } else {
          setRating(0); // set là 0 nếu không có dữ liệu từ API
        }
      })

      .catch((err) => {
        console.log(`Lỗi khi lấy rating từ API đó là : ${err.typeError}`);
        toast.error("Có lỗi, hãy xem trong console !");
        setRating(0);
      });
  };

  useEffect(() => {
    handleFetchRating();
  }, [params.id]);

  // Hàm xử lý khi user bắt đầu đánh giá
  function changeRating(newRating) {
    if (!isLogged) {
      toast.error("Vui lòng đăng nhập để đánh giá !");
      navigate("/login");
      
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

    // FormData gửi qua API
    const formDataRating = new FormData();
    formDataRating.append("user_id", user_id);
    formDataRating.append("blog_id", blog_id);
    formDataRating.append("rate", newRating);

    api
      .post("blog/rate/" + params.id, formDataRating, config)
      .then(() => {
        // console.log(res.data);
        toast.success(`Đánh giá blog thành công với số sao là ${newRating}`); // thông báo rating thành công

        handleFetchRating(); // Gọi lại hàm handleFectchRating để cập nhật lại điểm đánh giá
      })

      .catch((error) => {
        console.log({ error });
        toast.error("Có lỗi, hãy xem trong console !");
      });
  }

  return (
      <ul className="ratings">
        <li className="rate-this">Rate this item:</li>
        <li>
          <StarRatings rating={rating} 
          starRatedColor="orange" 
          changeRating={changeRating} 
          numberOfStars={6} 
          name="rating" />
        </li>
        <li className="color">{`${numberVote} votes`}</li>
      </ul>
  );
}
export default Rate;
