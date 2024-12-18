function MenuLeft() {
    return (
        <>
        <div class="col-sm-3">
        <div className="left-sidebar">
                <h2>Category</h2>
                <div className="panel-group category-products" id="accordian">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <a data-toggle="collapse" data-parent="#accordian" href="#sportswear">
                                    <span className="badge pull-right"><i className="fa fa-plus"></i></span>
                                    Sportswear
                                </a>
                            </h4>
                        </div>
                        <div id="sportswear" className="panel-collapse collapse">
                            <div className="panel-body">
                                <ul>
                                    <li key="nike"><a href="#">Nike </a></li>
                                    <li key="under-armour"><a href="#">Under Armour </a></li>
                                    <li key="adidas"><a href="#">Adidas </a></li>
                                    <li key="puma"><a href="#">Puma</a></li>
                                    <li key="asics"><a href="#">ASICS </a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <a data-toggle="collapse" data-parent="#accordian" href="#mens">
                                    <span className="badge pull-right"><i className="fa fa-plus"></i></span>
                                    Mens
                                </a>
                            </h4>
                        </div>
                        <div id="mens" className="panel-collapse collapse">
                            <div className="panel-body">
                                <ul>
                                    <li key="fendi"><a href="#">Fendi</a></li>
                                    <li key="guess"><a href="#">Guess</a></li>
                                    <li key="valentino"><a href="#">Valentino</a></li>
                                    <li key="dior"><a href="#">Dior</a></li>
                                    <li key="versace"><a href="#">Versace</a></li>
                                    <li key="armani"><a href="#">Armani</a></li>
                                    <li key="prada"><a href="#">Prada</a></li>
                                    <li key="dolce"><a href="#">Dolce and Gabbana</a></li>
                                    <li key="chanel"><a href="#">Chanel</a></li>
                                    <li key="gucci"><a href="#">Gucci</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <a data-toggle="collapse" data-parent="#accordian" href="#womens">
                                    <span className="badge pull-right"><i className="fa fa-plus"></i></span>
                                    Womens
                                </a>
                            </h4>
                        </div>
                        <div id="womens" className="panel-collapse collapse">
                            <div className="panel-body">
                                <ul>
                                    <li key="fendi-women"><a href="#">Fendi</a></li>
                                    <li key="guess-women"><a href="#">Guess</a></li>
                                    <li key="valentino-women"><a href="#">Valentino</a></li>
                                    <li key="dior-women"><a href="#">Dior</a></li>
                                    <li key="versace-women"><a href="#">Versace</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title"><a href="#">Kids</a></h4>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title"><a href="#">Fashion</a></h4>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title"><a href="#">Households</a></h4>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title"><a href="#">Interiors</a></h4>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title"><a href="#">Clothing</a></h4>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title"><a href="#">Bags</a></h4>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title"><a href="#">Shoes</a></h4>
                        </div>
                    </div>
                </div>

                <div className="brands_products">
                    <h2>Brands</h2>
                    <div className="brands-name">
                        <ul className="nav nav-pills nav-stacked">
                            <li key="acne"><a href="#"> <span className="pull-right">(50)</span>Acne</a></li>
                            <li key="grune-erde"><a href="#"> <span className="pull-right">(56)</span>Grüne Erde</a></li>
                            <li key="albiro"><a href="#"> <span className="pull-right">(27)</span>Albiro</a></li>
                            <li key="ronhill"><a href="#"> <span className="pull-right">(32)</span>Ronhill</a></li>
                            <li key="oddmolly"><a href="#"> <span className="pull-right">(5)</span>Oddmolly</a></li>
                            <li key="boudestijn"><a href="#"> <span className="pull-right">(9)</span>Boudestijn</a></li>
                            <li key="rosch"><a href="#"> <span className="pull-right">(4)</span>Rösch creative culture</a></li>
                        </ul>
                    </div>
                </div>

                <div className="price-range">
                    <h2>Price Range</h2>
                    <div className="well">
                        <input
                            type="text"
                            className="span2"
                            value=""
                            data-slider-min="0"
                            data-slider-max="600"
                            data-slider-step="5"
                            data-slider-value="[250,450]"
                            id="sl2"
                        />
                        <br />
                        <b>$ 0</b> <b className="pull-right">$ 600</b>
                    </div>
                </div>

                <div className="shipping text-center">
                    <img src="/images/home/shipping.jpg" alt="Shipping" />
                </div>
            </div>

        </div>

        </>
    );
}

export default MenuLeft;
