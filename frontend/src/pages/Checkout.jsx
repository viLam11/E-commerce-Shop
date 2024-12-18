import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductInCheckout from "../components/ProductInCheckout";


// definition of productList: [ {prodName, prodID: , quantity: , img: , price: ..}]
// request to createOrder:  "orderItems": [ {
//     "product_id":"13cf029b-44b4-41db-a59c-d8126f3e5787",
//     "quantity": 1,
//     "subtotal": "10000"
//   }], 
// const productList =[ {
//     prodName: "Iphone",
//     prodID: "#prod01",
//     quantity: 1,
//     img: "https://th.bing.com/th/id/R.26fd47d8cd148081597eb4070ec6081f?rik=vKSdFuUdliHwaw&pid=ImgRaw&r=0",
//     price: 1000
// }]
export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location)
    const [errors, setErrors]  = useState([]);
    const {productList} = location.state || [];
    const [userID, setUserID] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userData, setUserData] = useState({});
    const [discountCode, setDiscountCode] = useState(null);   
    const [discounted, setDiscounted] = useState(false);
    const [discountedPrice, setDiscountedPrice] = useState(null);  
    // console.log(productList);
    useEffect(() => {
        if (!productList || productList.length === 0) {
            setErrors(["Chưa có sản phẩm để thanh toán"]);
        }

        //const storedUserID = localStorage.getItem("userID");
        const storedUserID = 'uid3';
        // const storedUserID = "7ea46d0d-0d9c-470f-9d05-50535c2f6cc0";    
        
        if (!storedUserID) {
            alert("Vui lòng đăng nhập để tiếp tục");
            navigate("/");
        }
        setUserID(storedUserID);
    }, [productList]);

    useEffect(() => {
        if (!userID) {
            return;
        }

        console.log(productList);

        axios.get(`http://localhost:8000/api/user/get-detail/${userID}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data.data);
                    setUserData(response.data.data);
                }
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    alert(error.response.data.msg);
                } else {
                    console.log(error);
                }
            });

        const ordersData = productList?productList.map((product, index) => {
            return {
                product_id: product.prodID,
                quantity: product.quantity,
                subtotal: product.price * product.quantity
            }
        }):null
        console.log("CHECK PRODUCT LIST: ", productList);
        setOrderItems(ordersData);

        const totalPrice = productList.reduce((total, product) => {
            return total + product.price * product.quantity;
        }, 0);
        setTotalPrice(totalPrice);

    }, [userID]);


    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    function handleApplyPromotion() {
        
        const promotionErrorElement = document.getElementById('promotionError');

        if (!discountCode) {
            promotionErrorElement.textContent = 'Vui lòng nhập mã giảm giá';
        } else {
            promotionErrorElement.textContent = '';
            // Apply promotion logic here
        }

        const prodInPromo = productList.map((product, index) => {
            return {
                product_id: product.prodID,
                quantity: product.quantity
            }
        })

        axios.post(`http://localhost:8000/api/promotion/Apply`, {
            "uid":  userID,
            "product": prodInPromo,
            "promotion_id": discountCode
        })
            .then((response) => {
                if(response.status === 200) {
                    setDiscounted(true);
                    console.log(response.data.data.new_total);
                    setDiscountedPrice(response.data.data.new_total);
                }
                
            })
            .catch((err) => {
                if(err.response) {
                    alert(err.response.data.msg);   
                } else {
                    console.log(err);
                }
            })


    };

    function handlePlaceOrder() {

        console.log("CHECK ORDER ITEMS: ", orderItems);

        console.log("CHECK RESQUEST: ", {
            orderItems: orderItems,
            "status": "Pending", 
            "shipping_address": "3/2 Huỳnh Tấn Phát", 
            "shipping_fee": 10000, 
            "shipping_co": "f",
            "quantity": "1",
            "total_price": 100000,
            "promotion_id": "promotion1"
        } )

        axios.post(`http://localhost:8000/api/order/CreateOrder/${userID}`, {
                orderItems: orderItems,
                "status": "Pending", 
                "shipping_address": "3/2 Huỳnh Tấn Phát", 
                "shipping_fee": 10000, 
                "shipping_co": "f",
                "quantity": "1",
                "total_price": 100000,
                "promotion_id": "promotion1"
            
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <div className="w-11/12 m-auto">
                    <div className="my-4 ml-10">
                        <span className="text-gray-600">Cửa hàng / </span>
                        <span className="font-medium">Thanh toán</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-6 ml-10">Xác nhận đặt hàng</h1>
                    <div className="flex flex-row " >
                        <div className="col-1 w-1/2 text-sm">
                            <div className="w-10/12 ml-10">
                                <div className="mb-4 flex items-end w-full">
                                    

                                    <div className="w-full">
                                        <div>Họ tên</div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="lastName"
                                            className={`mt-1 p-2  w-4/5 bg-gray-100 text-gray-600 outline-none readOnly`}
                                            value={ userData.lname  + " " + userData.fname}
                                            readOnly
                                        />
                                    </div>

                                </div>
                                <div className="mb-4">
                                    <div>Email</div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`mt-1 p-2  w-4/5 bg-gray-100 text-gray-600 `}
                                        value={userData.email}
                                        readOnly
                                    />

                                </div>

                                <div className="mb-4">
                                    <div>Số điện thoại</div>
                                    <input
                                        type="number"
                                        id="phone"
                                        name="phone"
                                        className={`mt-1 p-2  w-4/5  bg-gray-100 text-gray-600 `}
                                        value={userData.phone}
                                        readOnly
                                />

                                </div>

                                <div className="mb-4">
                                    <div>Địa chỉ</div>
                                    <input
                                        type="address"
                                        id="address"
                                        name="address"
                                        className={`mt-1 p-2 w-4/5 bg-blue-50 hover:bg-blue-100 `}
                                        value={userData.address}
                                    //   onChange={(e) => setPass(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <div>Thêm ghi chú</div>
                                    <input
                                        type="note"
                                        id="note"
                                        name="note"
                                        className={`mt-1 p-2 w-4/5 bg-blue-50 hover:bg-blue-100 `}
                                        value={"sdfasdfadsfa"}
                                    //   onChange={(e) => setPass(e.target.value)}
                                    />
                                </div>


                            </div>
                        </div>
                        <div className="col-2  w-1/2">
                            <div className="products w-8/12 space-y-4 m-auto">
                                {productList && productList.length > 0 &&  productList.map((product, index) => 

                                    ( <ProductInCheckout prodName={product.prodName} prodPrice={product.price} quantity={product.quantity} subtotal={product.quantity * product.price} img={product.img} />)
                                )}
                                <div className="border-b border-gray-600 mr-20"></div>
                                <div className="flex justify-between mr-20">
                                    <div>Thành tiền</div>
                                    <div>{formatNumber(totalPrice)} VND</div>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>
                                <div className="flex justify-between mr-20">
                                    <div>Phí vận chuyển</div>
                                    <div>{formatNumber(15000)} VND</div>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>  
                                <div className="promotion flex justify-between mr-20" id="promotion">   
                                    <input type="text" placeholder="Nhập mã giảm giá" className="border border-black rounded-md p-2 w-3/5"
                                        onChange={(e) => setDiscountCode(e.target.value)}   
                                    />
                                    <button className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                                        onClick={handleApplyPromotion}
                                    >Áp dụng</button>
                                </div>
                                <div id="promotionError" className="text-red-600 text-sm italic"></div>
                                <div className="border-b border-gray-600 mr-20"></div>  
                                <div className="flex justify-between mr-20">
                                    <div className="font-semibold">Tổng tiền</div>
                                    {discounted ? <div> <span className="">{formatNumber(discountedPrice)} VND</span>  <span className="line-through">{formatNumber(totalPrice + 15000)} VND</span> </div>:  <div>{formatNumber(totalPrice + 15000)} VND</div>}
                                    
                                </div>

                                <div className="payment-method">
                                    <label htmlFor="method" className="font-bold">Chọn phương thức thanh toán: </label>
                                    <div className="p-2 ml-2">
                                        <div className="space-x-2">
                                            <input type="radio" value="cash" name="payment" className="" />
                                            <span>Trả tiền khi nhận hàng</span>
                                        </div>
                                        <div className="space-x-2">
                                            <input type="radio" value="qr" name="payment" className="" />
                                            <span>Mã QR momo</span>
                                        </div>
                                       
                                    </div>
                                </div>

                                <div className="flex justify-center items-center">
                                    <div className="bg-red-600 text-white font-bold p-2 rounded-md hover:bg-red-700"
                                        onClick={handlePlaceOrder}  
                                    >Đặt hàng</div>
                                </div>
                            </div>

                            <div className="h-10"></div>
                            
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}