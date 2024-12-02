import { useState, useEffect } from "react";

function CategoryProduct({state, NavigateTo, ViewCategories, ViewProductDetail }){
    const cateData = state.categoryData
    if (!cateData){
        throw ('404 Not Found');
    }
    const prod = state.productData.filter(item => item.cate_id == state.currentCategory);
    const [images, setImages] = useState([]);
    useEffect(() => {
        const fetchImages = async () => {
            const newImages = [];
            for (let row of prod || []) {
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
    console.log(images)
    return(
        <>
            <div>
                <h4>Chọn theo tiêu chí</h4>
                <div>
                    <select>
                        <option value = "">--Chọn hãng công nghệ--</option>
                        <option value = "Samsung">Samsung</option>
                        <option value = "Apple">Apple</option>
                        <option value = "Xiaomi">Xiaomi</option>
                        <option value = "Marshall">Marshall</option>
                    </select>
                    <select>
                        <option value="">--Sắp xếp theo giá tiền--</option>
                        <option value="arc">Tăng dần</option>
                        <option value="desc">Giảm dần</option>
                    </select>
                </div>
                <div>
                    {prod.map((item, index) =>{
                        const img = images[item.product_id]
                        console.log(item.product_id)
                        return (
                        <div class="product-card" onClick={(e) =>{e.preventDefault(); ViewProductDetail(row.product_id)}}>
                            <img src={img} alt={item.pname} />
                            <h3>{item.pname}</h3>
                            <p class="price">{(() => {
                                    const format = String(item.price);
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
                                })()}</p>
                            <button class="cart-btn">Thêm vào giỏ hàng</button>
                        </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

 function CategoryDetail({ state, NavigateTo, ViewCategories, ViewProductDetail }){
    const cateData = state.categoryData;
    if (!cateData){
        alert('No category defined')
        throw ('404 Not Found');
    }
    return (
        <>
            <div className="breadcrumbs">
                <div>
                    <a href="#" className='shopping' onClick={(e) =>{e.preventDefault(); NavigateTo("Shopping")}}>Mua sắm</a> / <a href="#">{cateData.find(item => item.cate_id == state.currentCategory).cate_name}</a> /
                </div> 
                <CategoryProduct 
                    NavigateTo={NavigateTo} 
                    ViewCategories={ViewCategories}
                    ViewProductDetail={ViewProductDetail}
                    state ={state}
                    cateData = {state.categoryData}
                />
            </div>
        </>
    )
}

function Categories({ state, NavigateTo, ViewCategories, ViewProductDetail }){
    console.log(state.categoryData)
    return (
        <>
            <CategoryDetail 
                NavigateTo={NavigateTo} 
                ViewCategories={ViewCategories}
                ViewProductDetail={ViewProductDetail}
                state ={state}
            />
        </>
    )
}

export default Categories;