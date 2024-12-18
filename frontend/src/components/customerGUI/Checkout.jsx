
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import ProductInCheckout from "../components/ProductInCheckout";
import Header from "./Header";
import Footer from "../Footer";
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

function formatToDDMMYYYY(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

const fixPrice = (price) =>{
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
export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    //console.log(location)
    const [errors, setErrors]  = useState([]);
    // const [productList, setProductList] = useState(null);
    const productList = location.state.list || [];
    // const [userID, setUserID] = useState(localStorage.getItem('uid'));
    // console.log(userID)
    const [orderItems, setOrderItems] = useState([]);
    const [userData, setUserData] = useState(null);

    useEffect(()=>{
        const fetchUser = async() =>{
            try{
                const ruser = await axios.get(`http://localhost:8000/api/user/get-detail/${localStorage.getItem('uid')}`)
                //console.log("Outlet: ",localStorage.getItem('uid'))
                if (ruser.data.status !== 200){
                    alert("Lỗi 500")
                    throw new Error("Lỗi")
                }
                setUserData(ruser.data.data)
            }
            catch(err){
                console.error("Error Message: ", err.message)
            }
        }
        fetchUser()
    },[])
    const [defAdress, setAddress] = useState([])
    useEffect(() => {
        const fetchAdress = async () => {
            let adress = [];
            const res = await axios.get(`http://localhost:8000/api/user/GetAll/${localStorage.getItem('uid')}`)
            //console.log(res)
            if (res.status != 200) throw new Error("Error while fetching address")
            adress = res.data.data?res.data.data: []
            setAddress(adress); // Update images state once all images are fetched
        };

        fetchAdress();
        console.log(defAdress)
    }, [userData]);

    const [Pnumber, setPhone] = useState([])
    useEffect(() => {
        const fetchPhone = async () => {
            //console.log(currentUser.uid)
            let rphone = [];
            const res = await axios.get(`http://localhost:8000/api/user/GetPhone/${localStorage.getItem('uid')}`)
            //console.log(res)
            if (res.status != 200) throw new Error("Error while fetching phone number")
            rphone = res.data.data?res.data.data: []
            setPhone(rphone&& rphone.length>0?rphone.map(item => item.phone):[]); // Update images state once all images are fetched
        };

        fetchPhone();
    }, [userData]);

    const [holdPhone, setP] = useState("")
    const [holdAddress, setA] = useState("")

    useEffect(()=>{
        setA(defAdress && defAdress.length >0 ?defAdress.find(i => i.isdefault === true).address:"")
    },[defAdress])

    useEffect(()=>{
        setP(Pnumber && Pnumber.length >0 ?Pnumber[0]:"")
    },[Pnumber])

    const handleOrder = async() =>{
        try{
            const Torder = [...productList].map((item)=>{
                return{
                    product_id: item.product_id,
                    quantity: item.pquantity,
                    subtotal: item.pquantity * item.price
                }
            })
    
            console.log("Make order: ", {
                orderItems: Torder,
                status: "Pending",
                shipping_address: holdAddress,
                shipping_fee: 0,
                shipping_co: "Grab",
                quantity: productList.reduce((sum, i) => sum + i.pquantity, 0),
                total_price: location.state.total
            })
            const addOrder = await axios.post(`http://localhost:8000/api/order/CreateOrder/${localStorage.getItem('uid')}`,{
                orderItems: Torder,
                status: "Pending",
                shipping_address: holdAddress,
                shipping_fee: 0,
                shipping_co: "Grab",
                quantity: productList.reduce((sum, i) => sum + i.quantity, 0),
                total_price: location.state.total
            })
            console.warn(addOrder)
            if (addOrder.data.status !==200) {
                alert('Đặt hàng thất bại')
                throw new Error("Failure")
            }
            else{
                alert('Đặt hàng thành công')
                navigate('/user/info/history-log')
            }
        }
        catch(err){
            console.error("Log Error: ",err.message)
        }
    }

    return (userData && userData.lname && <>
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
                                        className={`mt-1 p-2  w-4/5  bg-blue-50 hover:bg-blue-100 `}
                                        value={holdPhone}
                                        onChange={(e)=>setP(e.target.value)}
                                />

                                </div>

                                <div className="mb-4">
                                    <div>Địa chỉ</div>
                                    <input
                                        type="address"
                                        id="address"
                                        name="address"
                                        className={`mt-1 p-2 w-4/5 bg-blue-50 hover:bg-blue-100 `}
                                        value={holdAddress}
                                       onChange={(e) => setA(e.target.value)}
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

                                    (  <div className="flex flex-row items-center mr-20">
                                        <div className=" w-2/5 flex items-center space-x-2">
                                            <span>
                                                <img src={product.image[0]} alt="" width={"100px"} />
                                            </span>
                                            <span>{product.pname}</span>
                                        </div>
                                        {/* <div className=" w-2/5 text-right ">{prodPrice}</div> */}
                                        <div className=" w-1/5 text-right mr-20">x {product.pquantity}</div>
                                        <div className=" w-2/5 text-right ">{fixPrice(product.pquantity * product.price)}</div>
                                    </div>)
                                )}
                                <div className="flex justify-between mr-20">
                                    <div>Thành tiền</div>
                                    <div>{fixPrice(location.state.total)}</div>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>
                                <div className="flex justify-between mr-20">
                                    <div>Phí vận chuyển</div>
                                    <div>100.000 VND</div>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>  
                                <div className="promotion flex justify-between mr-20">
                                    <input type="text" placeholder="Nhập mã giảm giá" className="border border-black rounded-md p-2 w-3/5" />
                                    <button className="bg-red-600 text-white p-2 rounded-md">Áp dụng</button>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>  
                                <div className="flex justify-between mr-20">
                                    <div className="font-semibold">Tổng tiền</div>
                                    <div>{fixPrice(location.state.total - location.state.discount)}</div>
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
                                    <div className="bg-red-600 text-white font-bold p-2 rounded-md" onClick={handleOrder}>Đặt hàng</div>
                                </div>
                            </div>

                            <div className="h-10"></div>
                            
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
        </>
    )
}