import { useState, useEffect } from "react";

function CategoryProduct({state, NavigateTo, ViewCategories, ViewProductDetail }){
    const cateData = state.categoryData
    const [mode, setMode] = useState({
        maxPrice: 0,
        minPrice: 0,
        brand:"",
        sortMode: ""
    })

    if (!cateData){
        throw ('404 Not Found');
    }
    const [prod, setProduct] = useState(state.productData.filter(item => item.cate_id == state.currentCategory));
    useEffect(()=>{
        setProduct(state.productData.filter(item => item.cate_id == state.currentCategory))
    },[state.productData])
    useEffect(()=>{
        let temp = state.productData.filter(item => item.cate_id == state.currentCategory)
        if (mode.brand && mode.brand != "") temp = temp.filter(item => item.brand == mode.brand)
        if (mode.maxPrice != 0) temp = temp.filter(item => item.price <= mode.maxPrice)
        if (mode.minPrice != 0) temp = temp.filter(item => item.price >= mode.minPrice)
        if (mode.sortMode == "asc") temp = temp.sort((a, b) => (a.price || 0) - (b.price || 0))
        if (mode.sortMode == "desc") temp = temp.sort((a, b) => (b.price || 0) - (a.price || 0))
        setProduct(temp)
    },[mode,state.productData, state.currentCategory])
    
    const [images, setImages] = useState({});
    useEffect(() => {
        const fetchImages = async () => {
            const newImages = {};
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
    }, [prod]);

    const [start, setStart] = useState(0); // Quản lý điểm bắt đầu
    const [end, setEnd] = useState(4); // Quản lý điểm kết thúc
    const handleNext = () => {
        //console.log("Next")
        setStart((prev) => Math.min(prev + 4, sortedItems.length - 4));
        setEnd((prev) => Math.min(prev + 4, sortedItems.length));
    };
    
    const handlePrevious = () => {
        //console.log("Prev")
        setStart((prev) => Math.max(prev - 4, 0));
        setEnd((prev) => Math.max(prev - 4, 4));
    };
    console.log(images)
    const formatPrice = (price) =>{
        const format = String(price);
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
    }
    return(
        <>
            <div className="detail">
                <h4>Chọn theo tiêu chí</h4>
                <div className="sort-bar">
                    <select value={mode.brand} onChange={(e) => setMode((prev) => ({...prev,brand: e.target.value}))}>
                        <option value = "">Hãng sản xuất</option>
                        <option value = "Samsung">Samsung</option>
                        <option value = "Apple">Apple</option>
                        <option value = "Xiaomi">Xiaomi</option>
                        <option value = "Marshall">Marshall</option>
                    </select>
                    <input type="number" placeholder="Mức giá cao nhất" value={mode.maxPrice==0?"Mức giá cao nhất":mode.maxPrice} onChange={(e) => setMode((prev) => ({...prev,maxPrice: e.target.value}))}/>
                    <input type="number" placeholder="Mức giá thấp nhất" value={mode.minPrice==0?"Mức giá cao nhất":mode.minPrice} onChange={(e) => setMode((prev) => ({...prev,minPrice: e.target.value}))}/>
                    <select value={mode.sortMode} onChange={(e) => setMode((prev) => ({...prev,sortMode: e.target.value}))}>
                        <option value="">Sắp xếp theo giá tiền</option>
                        <option value="asc">Tăng dần</option>
                        <option value="desc">Giảm dần</option>
                    </select>
                </div>
                <div className="spotlight-cate">
                    <h2>{state.categoryData.find(item => item.cate_id == state.currentCategory ).cate_name}</h2>
                    <div className="spotlight-seed">
                        {/* Chia danh sách sản phẩm thành các nhóm 4 sản phẩm */}
                        {Array.from({ length: 3 }, (_, i) => (
                        <div className="row" key={i}>
                            {prod.slice(i * 4, i * 4 + 4).map((item, index) => {
                            const img = images[item.product_id];
                            return (
                                <div
                                key={item.product_id} // Sử dụng product_id làm key nếu là duy nhất
                                className="product-card"
                                onClick={(e) => {
                                    e.preventDefault();
                                    ViewProductDetail(item.product_id); // Sửa từ `row` thành `item`
                                }}
                                >
                                {/* Hiển thị hình ảnh sản phẩm */}
                                <div className="product-view" onClick={() => ViewProductDetail(row.product_id)}>
                                      <img
                                          className="product-img"
                                          src={img ? img.image_url : "default_image.png"}
                                          alt="Product"
                                      />
                                  </div>
                                {/* Tên sản phẩm */}
                                <div className="prod-data">
                                      <div className="product-name">{item.pname}</div>
                                      <div className="product-cash">
                                          {(() => {
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
                                          })()}{" "}
                                      </div>
                                  </div>
                                </div>
                            );
                            })}
                        </div>
                        ))}
                    </div>
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
            <div className="mar"></div>
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
        <div className="category">
            <CategoryDetail 
                NavigateTo={NavigateTo} 
                ViewCategories={ViewCategories}
                ViewProductDetail={ViewProductDetail}
                state ={state}
            />
        </div>
    )
}

export default Categories;