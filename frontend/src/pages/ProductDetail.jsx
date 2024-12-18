import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import RenderStars from "../components/RenderStart";
import axios from "axios";
import Reviews from "../components/Reviews";
import NewReview from "../components/newReview";

const categoryMap = {
    1: "Smartphone",
    2: "Tablet",
    3: "Laptop",
    4: "Smartwatch"
}

export default function ProductDetail() {
    const navigate = useNavigate();
    const { prodID } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [count, setCount] = useState(0);

    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    // ### PRODUCT INFO
    const [prodName, setProdName] = useState(null);
    const [prodPrice, setProdPrice] = useState(null);

    const [inStock, setInStock] = useState(null);
    const [prodDescript, setProdDescript] = useState(null);
    const [prodAvgRating, setProdAvgRating] = useState(0);
    const [prodBuyCount, setProdBuyCount] = useState(0);
    const [prodStatus, setProdStatus] = useState("Available")
    const [prodCatID, setProdCatID] = useState(null);

    // ### IMAGE LIST
    const [imgList, setImgList] = useState([]);
    const [displayImg, setDisplayImg] = useState(null);

    // ### REVIEW
    const [reviewList, setReviewList] = useState([]);
    const [pageNumReview, setPageNumReview] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const increaseQuantity = () => setQuantity((prev) => prev + 1);
    const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchProductDetails = axios.get(`http://localhost:8000/api/product/get-detail/${prodID}`);
                const fetchReviewList = axios.get(`http://localhost:8000/api/product/GetReview/${prodID}`);  
                const [productResponse, reviewResponse] = await Promise.all([fetchProductDetails, fetchReviewList]);

                if (productResponse.status === 200) {
                    console.log(productResponse.data.data);
                    const prodData = productResponse.data.data;
                    const imgData = prodData.image;
                    setProdName(prodData.pname);
                    setProdPrice(prodData.price);
                    setInStock(prodData.quantity);
                    setProdDescript(prodData.description);
                    setProdCatID(prodData.cate_id);
                    setProdBuyCount(prodData.sold);
                    setProdAvgRating(prodData.rating);
                    console.log("CHECK IMG LIST: ",imgData);
                    setImgList(imgData);
                    setDisplayImg(imgData[0]);
                }
                
                if (reviewResponse.data){
                    console.log("REVIEW LIST: ", reviewResponse.data.data);
                    const reviewData = reviewResponse.data.data;
                    if(!reviewData) return; 
                    setReviewList(reviewResponse.data.data);
                    // setPageNumReview(reviewResponse.data.to);
                    // setCurrentPage(0);
                }
            } catch (error) {
                if (error.response) {
                    // alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            }
        };

        fetchData();
    }, [])

    // FUNTION
    function handleDisplayImg(index) {
        setDisplayImg(imgList[index]);
    }

    function handleCheckout(prodID, quantity, prodName, img, prodPrice) {
        console.log("CHECKOUT: ", prodID, quantity);
        const productList = [{
            prodID: prodID,
            prodName: prodName,
            quantity: quantity,
            img: img,
            price: prodPrice
        }];
        navigate(`/customer/pay`, { state: { productList } });
    }

    function handlePageClick(pageNum) {
        setCurrentPage(pageNum);
        const index = Number(pageNum);
        const offset = index*3;
        axios.get(`http://localhost/Assignment/Backend/api/review/product/${prodID}/fetch/${offset}/3`)
            .then((response) => {
                if (response.status === 200) {
                    console.log("REVIEW LIST 2: ", response.data.data.data);
                    setReviewList(response.data.data.data);
                    setPageNumReview(response.data.data.page_count);
                    setCurrentPage(0);
                }
            })
            .catch((error) => {
                if (error.response) {
                    // alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            })
        }


    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow mt-6">
                {/* CHECK ID */}

                <div className="w-10/12 mx-auto h-12 justify-center">
                    <span><a href="customer/shopping">
                        Mua sắm
                    </a></span> /
                    {<span className="mx-2"><a href="customer/shopping">
                        {categoryMap[prodCatID]}
                    </a></span>
                    }
                    /<span>
                        <a href="customer/shopping" className="font-bold "> {prodName ? prodName : null} </a>
                    </span>
                </div>

                <div className="prod-info w-10/12 mx-auto flex flex-row">
                    <div className="w-full flex flex-row">
                        <div className="col-1 w-1/5 flex flex-col">
                            {Array.isArray(imgList) &&  imgList.length > 0 ? imgList.map((item, index) => (
                                <div key={index} className="bg-gray-200 py-2 mb-2 rounded-md"
                                    onClick={() => handleDisplayImg(index)}
                                >
                                    <img key={index} src={item} alt="" className="w-3/5 mx-auto" />
                                </div>)) : null}
                        </div>
                        <div className="w-4/5 ml-2">
                            <div className=" h-full flex items-center justify-center bg-gray-200">
                                <img
                                    src={displayImg ? displayImg : null}
                                    alt=""
                                    className="block w-4/5 max-h-full p-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Element chứu thông tin cơ bản của prodct */}
                    <div className="w-full space-y-1 ml-6">
                        <div className="text-left font-bold text-2xl">{prodName}</div>
                        <RenderStars rating={prodAvgRating} />
                        <div className="text-lg font-bold">{formatPrice(prodPrice)}</div>

                        <div className="border border-b-1 w-10/12 "></div>
                        <div className="h-6"></div>
                        <div className="flex flex-row mt-10 space-x-4">
                            <div className="border border-black w-32 flex items-center justify-between">
                                {/* Nút giảm số lượng */}
                                <button
                                    onClick={decreaseQuantity}
                                    className="bg-gray-300 text-black h-full w-10 hover:bg-gray-400"
                                >
                                    -
                                </button>
                                {/* Hiển thị số lượng */}
                                <div className="quantity text-lg font-semibold">{quantity}</div>
                                {/* Nút tăng số lượng */}
                                <button
                                    onClick={increaseQuantity}
                                    className="bg-gray-300 text-black h-full w-10 hover:bg-gray-400"
                                >
                                    +
                                </button>
                            </div>
                            <div className="bg-red-500 font-bold text-white p-2"
                                onClick={() => {
                                    handleCheckout(prodID, quantity, prodName, imgList[0], prodPrice)}
                                }
                            >Mua ngay</div>
                        </div>
                    </div>




                </div>

                {/* Element chứ thông tin chi tiết của sản phẩm */}
                <div className="mt-10 w-10/12 mx-auto border p-2">
                    <h2 className="text-2xl text-red-500 text-center font-semibold">Thông tin chi tiết</h2>
                    <p className="font-serif tracking-wide leading-relaxed p-6 text-justify" style={{ fontFamily: 'Lora, serif' }} dangerouslySetInnerHTML={{ __html: prodDescript }} >
                    </p>
                </div>

                <div className="w-10/12 mx-auto space-y-4">
                    <div className="text-2xl text-red-500 text-center font-semibold mb-4 mt-10">Đánh giá và nhận xét</div>
                    <NewReview prodID={prodID} />
                    {/* {Array.from({ length: 3 }).map((item, index) => (   <Reviews rating={Number(2)} comment={"hi"} />))}                */}
                    {reviewList.length > 0 &&  reviewList.map((item, index) => <Reviews rating={item.rating} customer_name={item.customer_name}  comment={item.comment} time={item.time} />)}
                </div>

                
                <div className="flex justify-end z-10 w-10/12 mx-auto my-4">
                        {Array.from({ length: pageNumReview }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageClick(i)} 
                                className={`px-3 py-1 mx-1 hover:bg-blue-300 ${currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200"
                                    } rounded`}
                            >
                                {i + 1}
                            </button>
                        ))}
                </div>
            </main>
            <div className="h-60"></div>
            <Footer />

        </div>
    )
}