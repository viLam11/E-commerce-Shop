import React, { useEffect, useState, useCallback } from 'react';

function Product({ state, ViewProductDetail }) {
    console.log("Product Data:", state.productData);
    return (
        <div className="spotlight">
            
            <h2>Giới thiệu sản phẩm</h2>
            
            <DetailProduct state={state} ViewProductDetail={ViewProductDetail} />
        </div>
    );
}

function DetailProduct({ state, ViewProductDetail }) {
    const [images, setImages] = useState({}); // Store images for products by ID

    // Sort products by `sold` property
    const sortedItems = state.productData
        ? state.productData
        : null;

    // Fetch images for products in sortedItems
    useEffect(() => {
        const fetchImages = async () => {
            const newImages = {};
            for (let row of sortedItems || []) {
                try {
                    const response = await fetch(`http://localhost:8000/api/product/GetImageByProduct/${row.product_id}`);
                    if (!response.ok) throw new Error("Failed to fetch image");
                    const data = await response.json();
                    newImages[row.product_id] = data.data ? data.data.find(item => item.ismain) : null;
                } catch (error) {
                    console.error("Error fetching image:", error);
                    newImages[row.product_id] = null; // Fallback if image fetch fails
                }
            }
            setImages(newImages); // Update images state once all images are fetched
        };

        fetchImages();
    }, []);
    const [start, setStart] = useState(0); // Quản lý điểm bắt đầu
    const [end, setEnd] = useState(4); // Quản lý điểm kết thúc
    const handleNext = () => {
        console.log("Next")
        setStart((prev) => Math.min(prev + 4, sortedItems.length - 4));
        setEnd((prev) => Math.min(prev + 4, sortedItems.length));
    };
    
    const handlePrevious = () => {
        console.log("Prev")
        setStart((prev) => Math.max(prev - 4, 0));
        setEnd((prev) => Math.max(prev - 4, 4));
    };
    return (<>
    <span onClick={handlePrevious}>&#x2B05;</span><span onClick={handleNext}>&#x27A1;</span>
            <div className="spotlight-list">
                {sortedItems
                    ? sortedItems.slice(start, end).map((row, index) => {
                          const img = images[row.product_id];
                          const productCate = state.categoryData
                              ? state.categoryData.find(item => item.cate_id === row.cate_id)
                              : null;

                          return (
                              <div
                                  className="spotlight-product"
                                  key={index}
                              >
                                  <div className='product-view' onClick={() => ViewProductDetail(row.product_id)}>
                                      <img
                                          className="product-img"
                                          src={img ? img.image_url : "default_image.png"}
                                          alt="Product"
                                      />
                                  </div>
                                  <div className="prod-data">
                                      <div className="product-name">{row.pname}</div>
                                      <div className="product-cash">
                                          {(() => {
                                              const format = String(row.price);
                                              let token = " đ";
                                              let checkpoint = 0;
                                              for (let i = format.length - 1; i >= 0; i--) {
                                                  token = format[i] + token;
                                                  checkpoint++;
                                                  if (checkpoint === 3 && i !== 0) {
                                                      token = "." + token;
                                                      checkpoint = 0;
                                                  }
                                              }

                                              return token;
                                          })()}{" "}
                                          <span>({row.sold})</span>
                                      </div>
                                  </div>
                              </div>
                          );
                      })
                    : null}
            </div>
            </>
    );
}

export default Product;
