import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const ItemDetails = () => {
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const { id } = useParams();

  async function fetchItem() {
    const { data } = await axios.get(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${id}`
    );
    setItemDetails(data);
    setLoading(false);
  }

  function addLike() {
    setItemDetails((prev) => ({
      ...prev,
      likes: prev.likes + 1,
    }));
    setIsLiked(true);
  }

  function removeLike() {
    setItemDetails((prev) => ({
      ...prev,
      likes: prev.likes - 1,
    }));
    setIsLiked(false);
  }

  useEffect(() => {
    fetchItem();
  }, []);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                {loading ? (
                  <div className="skeleton-box nft-image"></div>
                ) : (
                  <img
                    src={itemDetails.nftImage}
                    className="img-fluid img-rounded mb-sm-30 nft-image"
                    alt=""
                  />
                )}
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  <h2>
                    {loading ? (
                      <div
                        className="skeleton-box"
                        style={{ width: "60%", height: "30px" }}
                      ></div>
                    ) : (
                      `${itemDetails.title} #${itemDetails.tag}`
                    )}
                  </h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {loading ? (
                        <div
                          className="skeleton-box"
                          style={{ width: "30px", height: "20px" }}
                        ></div>
                      ) : (
                        itemDetails.views
                      )}
                    </div>
                    {isLiked ? (
                      <button onClick={removeLike} className="item_info_like">
                        <i className="fa fa-heart margin-left likes_colour"></i>
                        {itemDetails?.likes}
                      </button>
                    ) : (
                      <button onClick={addLike} className="item_info_like">
                        <i className="fa fa-heart margin-left likes-colour"></i>
                        {itemDetails?.likes}
                      </button>
                    )}
                  </div>
                  {loading ? (
                    <div>
                    <p
                        className="skeleton-box"
                        style={{ width: "100%", height: "80px" }}
                        ></p>
                        </div>
                  ) : (
                    itemDetails.description
                  )}
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          {loading ? (
                            <div
                              className="skeleton-box"
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                              }}
                            ></div>
                          ) : (
                            <Link to={`/author/${itemDetails.ownerId}`}>
                              <img
                                className="lazy"
                                src={itemDetails.ownerImage}
                                alt=""
                              />
                              <i className="fa fa-check"></i>
                            </Link>
                          )}
                        </div>
                        <div className="author_list_info">
                          {loading ? (
                            <div
                              className="skeleton-box"
                              style={{ width: "100px", height: "20px" }}
                            ></div>
                          ) : (
                            <Link to={`/author/${itemDetails.ownerId}`}>
                              {itemDetails.ownerName}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          {loading ? (
                            <div
                              className="skeleton-box"
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                              }}
                            ></div>
                          ) : (
                            <Link to={`/author/${itemDetails.creatorId}`}>
                              <img
                                className="lazy"
                                src={itemDetails.creatorImage}
                                alt=""
                              />
                              <i className="fa fa-check"></i>
                            </Link>
                          )}
                        </div>
                        <div className="author_list_info">
                          {loading ? (
                            <div
                              className="skeleton-box"
                              style={{ width: "100px", height: "20px" }}
                            ></div>
                          ) : (
                            <Link to={`/author/${itemDetails.creatorId}`}>
                              {itemDetails.creatorName}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      {loading ? (
                        <div
                          className="skeleton-box"
                          style={{ width: "50px", height: "20px" }}
                        ></div>
                      ) : (
                        <span>{itemDetails.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
