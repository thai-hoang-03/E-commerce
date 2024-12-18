import { useEffect, useState } from "react";
import { api } from "../../api";
import { Link } from "react-router-dom";


function BlogList() {
  const [blogs, setBlogs] = useState([]);

  console.log({ blogs });

  useEffect(() => {
    api.get("/blog").then((res) => {
      setBlogs(res.data.blog.data);
    });
  }, []);

  return (
    <>         
          <div className="col-sm-9">
            <div className="blog-post-area">
              <h2 className="title text-center">Latest From our Blog</h2>
              {blogs.length > 0 &&
                blogs.map((blog) => {
                                  
                  return (
                    <div className="single-blog-post">
                      <h3>{blog.title}</h3>
                      <div className="post-meta">
                        <ul>
                          <li>
                            <i className="fa fa-user"></i> Mac Doe
                          </li>
                          <li>
                            <i className="fa fa-clock-o"></i> {blog.created_at}
                          </li>
                          <li>
                            <i className="fa fa-calendar"></i> {blog.updated_at}
                          </li>
                        </ul>
                      </div>
                      <a href="">
                        <img src= {"http://localhost/doan/laravel8/public/upload/Blog/image/" + blog.image}  alt="" />
                      </a>
                      <p>{blog.description}</p> 
                      <Link to={"/blogs/" + blog.id} className="btn btn-primary" href="">Read More</Link>
                    </div>
                  );
                })}

              <div className="pagination-area">
                <ul className="pagination">
                  <li>
                    <a href="" className="active">
                      1
                    </a>
                  </li>
                  <li>
                    <a href="">2</a>
                  </li>
                  <li>
                    <a href="">3</a>
                  </li>
                  <li>
                    <a href="">
                      <i className="fa fa-angle-double-right"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
       
    </>
  );
}

export default BlogList;
