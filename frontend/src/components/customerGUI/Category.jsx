import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../../design/product/review.css'
import '../../design/Home/highlight.css'
import Header from "./Header";
import Footer from "../Footer";

function CategoryProduct({cate_id, cate_name, productData}){
    
    const navigate = useNavigate()
    const [brandList, setBrandList] = useState(() => {
        const uniqueBrands = [...new Set(
            productData
                .filter(item => item.cate_id === cate_id)
                .map(item => item.brand)
        )];
        return uniqueBrands;
    });
    useEffect(()=>{
        setBrandList(() => {
            const uniqueBrands = [...new Set(
                productData
                    .filter(item => item.cate_id === cate_id)
                    .map(item => item.brand)
            )];
            return uniqueBrands;
        })
        console.log(brandList)
    },[productData])
    const [mode, setMode] = useState({
        maxPrice: 0,
        minPrice: 0,
        brand:"",
        sortMode: ""
    })
    const [prod, setProduct] = useState(productData.filter(item => item.cate_id == cate_id));
    useEffect(()=>{
        setProduct(productData.filter(item => item.cate_id == cate_id))
    },[productData])
    useEffect(()=>{
        let temp = productData.filter(item => item.cate_id == cate_id)
        if (mode.brand && mode.brand != "") temp = temp.filter(item => item.brand == mode.brand)
        if (mode.maxPrice != 0) temp = temp.filter(item => item.price <= mode.maxPrice)
        if (mode.minPrice != 0) temp = temp.filter(item => item.price >= mode.minPrice)
        if (mode.sortMode == "asc") temp = temp.sort((a, b) => (a.price || 0) - (b.price || 0))
        if (mode.sortMode == "desc") temp = temp.sort((a, b) => (b.price || 0) - (a.price || 0))
        setProduct(temp)
    },[mode,productData, cate_id])
    
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
        setStart((prev) => Math.min(prev + 3, prod.length / 3));
        //setEnd((prev) => Math.min(prev + 4, sortedItems.length));
    };
    
    const handlePrevious = () => {
        //console.log("Prev")
        setStart((prev) => Math.max(prev - 3, 0));
        //setEnd((prev) => Math.max(prev - 4, 4));
    };
    //console.log(images)
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
                    <select style={{marginTop: "5px"}} value={mode.brand} onChange={(e) => setMode((prev) => ({...prev,brand: e.target.value}))}>
                        <option value = "">Hãng sản xuất</option>
                        {brandList && brandList.length > 0?brandList.map((item, index)=>{
                            return(<option key={index} value = {item}>{item}</option>)
                        }):null}
                    </select>
                    <input type="number" placeholder="Mức giá cao nhất" value={mode.maxPrice==0?"Mức giá cao nhất":mode.maxPrice} onChange={(e) => setMode((prev) => ({...prev,maxPrice: e.target.value}))}/>
                    <input type="number" placeholder="Mức giá thấp nhất" value={mode.minPrice==0?"Mức giá cao nhất":mode.minPrice} onChange={(e) => setMode((prev) => ({...prev,minPrice: e.target.value}))}/>
                    <select style={{marginTop: "5px"}} value={mode.sortMode} onChange={(e) => setMode((prev) => ({...prev,sortMode: e.target.value}))}>
                        <option value="">Sắp xếp theo giá tiền</option>
                        <option value="asc">Tăng dần</option>
                        <option value="desc">Giảm dần</option>
                    </select>
                </div>
                <div className="spotlight-cate">
                    <h2>{cate_name}</h2>
                    <div className="spotlight-seed">
                        {/* Chia danh sách sản phẩm thành các nhóm 4 sản phẩm */}
                        {Array.from({ length: 3 }, (_, i) => (
                        <div className="row" key={i}>
                            {prod.slice((i+start) * 4,Math.min(i * 4 + 4, prod.length)).map((item, index) => {
                            const img = images[item.product_id];
                            return (
                                <div
                                key={item.product_id} // Sử dụng product_id làm key nếu là duy nhất
                                className="product-card" // Sửa từ `col` thành `product-card`
                                // style={{ display: i * 4 + index >= start && i * 4 + index < end ? "block" : "none" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/product-detail/${item.product_id}`); // Sửa từ `row` thành `item`
                                }}
                                >
                                {/* Hiển thị hình ảnh sản phẩm */}
                                <div className="product-view" onClick={() => navigate(`/product-detail/${item.product_id}`)}>
                                      <img style={{paddingLeft: "25px"}}
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
                    <style>
                        {
                            `.page-button {
                                display: flex;
                                justify-content: center;
                                margin-bottom: 40px;
                                margin-top: -20px;
                                align-items: center;
                            }
                            .page-button button {
                                width: 50px;
                                height: 50px;
                                align-items: center;
                                justify-content: center;
                                text-align: center;
                                background-color: white;
                                border: 1px solid gray;   
                                color: black;   
                                padding: 10px 20px;
                                text-align: center;
                                text-decoration: none;
                                display: inline-block;
                                font-size: 16px;
                                margin: 4px 2px;
                                cursor: pointer;
                                border-radius: 16px;
                                transition: background-color 0.3s ease, transform 0.3s ease;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            }
                            .page-button button:hover {
                                background-color: red;
                                color: white;
                                transform: translateY(-2px);
                            }
                            .page-button button:disabled {
                                background-color: #ccc;
                                cursor: not-allowed;
                            }
                            .page-button button svg {
                                vertical-align: middle;
                                width: 10px;
                                fill: currentColor;
                            }`
                        }
                    </style>
                    <div className="page-button">
                        <button className="left" onClick={handlePrevious} disabled={start === 0}>
                        <svg enable-background="new 0 0 13 20" viewBox="0 0 13 20" x="0" y="0" class="shopee-svg-icon icon-arrow-left-bold"><polygon points="4.2 10 12.1 2.1 10 -.1 1 8.9 -.1 10 1 11 10 20 12.1 17.9"></polygon></svg>
                        </button>
                        <button className="right" onClick={handleNext} disabled={end === prod.length}>
                        <svg enable-background="new 0 0 13 21" viewBox="0 0 13 21" x="0" y="0" class="shopee-svg-icon icon-arrow-right-bold"
                        fill="color"><polygon points="11.1 9.9 2.1 .9 -.1 3.1 7.9 11 -.1 18.9 2.1 21 11.1 12 12.1 11"></polygon></svg>
                        </button>
                    </div>
            </div>
        </>
    )
}

 function CategoryDetail({cate_id, cate_name, productData}){
    return (productData &&
        <>
            <div className="mar"></div>
            <div className="breadcrumbs">
                <div>
                    <a href="/user/shopping" className='shopping'>Mua sắm</a> / <a href={`/category/${cate_id}`}>{cate_name}</a> /
                </div> 
                <CategoryProduct 
                    cate_id={cate_id}
                    cate_name={cate_name}
                    productData={productData}
                />
            </div>
        </>
    )
}

function Categories(){
    const categoryData = [{cate_id: "c01", cate_name:"Điện thoại"}, {cate_id: "c02", cate_name:"Laptop"}, {cate_id: "c03", cate_name:"Máy tính bảng"}, {cate_id: "c04", cate_name:"Đồng hồ thông minh"}, {cate_id: "c05", cate_name:"Phụ kiện"}]
    const {id} = useParams()
    const cate_id = categoryData.find(i => i.cate_id == id).cate_id
    const cate_name = categoryData.find(i => i.cate_id == id).cate_name
    const [productData, setData] = useState([])
    useEffect(()=>{
        const fetchData = async() => {
            try{
                const rdata = await axios.get(`http://localhost:8000/api/product/getAll?limit=1000`)
                //console.log(rdata)
                if (rdata.status != 200) throw new Error("Feth data fail")
                setData(rdata.data.data)
            }
            catch(err){
                console.error("Error: ", err.message)
            }
        }
        fetchData()
    },[])
    return (productData &&
        <>
            <Header/>
            <div className="category">
            <CategoryDetail 
                cate_id={cate_id}
                cate_name={cate_name}
                productData={productData}
            />
            <Footer />
        </div>
        </>
    )
}

export default Categories;