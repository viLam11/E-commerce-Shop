
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

function Voucher({state, buyList, setVoucher, setIsPopupOpen, total}){
    const [vouchers, setList] = useState([])
    const [fitVoucher, setFit] = useState([])
    const [unReach, setReach] = useState([])
    const [unApplied, setApply] = useState([])
    useEffect(()=>{
        const fetchVoucher = async() => {
            const res = await fetch('http://localhost:8000/api/promotion/GetAll')
            const data = await res.json()
            console.log(data)
            if (data.status != 200) throw new Error("Error while fetching data")
            setList(data.data)
        }

        fetchVoucher()
    },[])
    const discountValue = (voucher) =>{
        switch(voucher.apply_range){
            case 'all':
                return(voucher.value?voucher.value:Math.min(voucher.percentage * total, voucher.max_amount))
                break;
            case 'category':
                let tempArr = [...buyList].filter(item => item.cate_id == voucher.apply_id)
                let tempSum = tempArr.reduce((acc, item) => acc + (item.price * item.pquantity), 0);
                return(voucher.value?voucher.value:Math.min(voucher.percentage * tempSum, voucher.max_amount))
                break;
            case 'product':
                let tempArr2 = [...buyList].filter(item => item.product_id == voucher.apply_id)
                let tempSum2 = tempArr2.reduce((acc, item) => acc + (item.price * item.pquantity), 0);
                return(voucher.value?voucher.value:Math.min(voucher.percentage * tempSum, voucher.max_amount))
                break;
        }
    }
    //buyList.map(i => i.product_id).includes(item.apply_id) || buyList.map(i => i.cate_id).includes(item.apply_id) ||
    useEffect(()=>{
        const product_con = (item)=>{
            return (item.apply_range == "product" 
            && buyList.map(i => i.product_id).includes(item.apply_id) 
            && item.minspent <= buyList.find(i => item.product_id == item.apply_id).pquantity * buyList.find(i => item.product_id == item.apply_id).price)
        }   

        const category_con = (item)=>{
            return (item.apply_range == "category_id"
                && buyList.map(i => i.cate_id).includes(item.apply_id)
                && minspent <= buyList.filter(i => i.cate_id == item.apply_id).reduce((sum, current) => sum + current.price * current.pquantity, 0)
            )
        }
        
        const uproduct_con = (item)=>{
            return (item.apply_range == "product" 
                && buyList.map(i => i.product_id).includes(item.apply_id) 
                && item.minspent > buyList.find(i => item.product_id == item.apply_id).pquantity * buyList.find(i => item.product_id == item.apply_id).price)
        }   

        const ucategory_con = (item)=>{
            return (item.apply_range == "category_id"
                && buyList.map(i => i.cate_id).includes(item.apply_id)
                && minspent > buyList.filter(i => i.cate_id == item.apply_id).reduce((sum, current) => sum + current.price * current.pquantity, 0)
            )
        }

        setFit([...vouchers].filter(item => item.quantity > 0 
            && (product_con(item) || category_con(item) || (item.apply_range == "all" && item.minspent <= buyList.reduce((sum, cur) => sum += cur.pquantity * cur.price, 0))))
            .sort((a, b) => discountValue(b) - discountValue(a))
        )
        setReach([...vouchers].filter(item => item.quantity > 0 
            && (uproduct_con(item) || ucategory_con(item) || (item.apply_range == "all" && item.minspent > buyList.reduce((sum, cur) => sum += cur.pquantity * cur.price, 0))))
            .sort((a, b) => discountValue(b) - discountValue(a))
        )
        setApply([...vouchers].filter(item => !uproduct_con(item) && !ucategory_con(item) && item.apply_range !='all')
                .sort((a, b) => discountValue(b) - discountValue(a))
        )
    },[vouchers])
    return (
        <div style={{width: "450px", height:"500px"}}>
            <style>
                {`
                  .body-ticket {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        background-color: #f5f5f5;
                    }

                    .ticket {
                        display: flex;
                        width: 400px;
                        height: 200px;
                        background-color: #fffacd;
                        border: 2px solid #f2b647;
                        border-radius: 10px;
                        position: relative;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }

                    .ticket::before,
                    .ticket::after {
                        content: '';
                        position: absolute;
                        width: 20px;
                        height: 20px;
                        background-color: #fff;
                        border: 2px solid #f2b647;
                        border-radius: 50%;
                    }

                    .ticket::before {
                        top: 0;
                        left: -12px;
                    }

                    .ticket::after {
                        bottom: 0;
                        left: -12px;
                    }

                    .divider {
                        border: 3px dashed white;
                        margin: auto;
                    }
                    .element {
                        overflow: auto; /* Cho phép cuộn nội dung */
                        scrollbar-width: none; /* Firefox */
                        -ms-overflow-style: none; /* Internet Explorer 10+ */
                    }
                    .element::-webkit-scrollbar {
                        display: none; /* Chrome, Safari và Edge */
                    }
                `}
            </style>
            <div className='element' style={{overflowY: "scroll", height: "450px", marginTop: "15px", width:"500px", marginLeft:"-20px"}}>
                <h3 style={{marginTop:"10px", marginBottom:"10px"}}>Bạn có thể chọn 1 voucher</h3>
                <div style={{width: "500px", height:"8px", backgroundColor: "#F3F6F8", marginLeft:"0px"}}></div>
                <div style={{marginTop:"15px", textAlign:"left", paddingLeft:"10px", fontWeight:"bold"}}>Mã giảm giá</div>
                {fitVoucher&&fitVoucher.length>0?fitVoucher.map((item, index)=>{
                return(<>
                 {index == 0?<div style={{borderRadius:"10px 10px 0px 10px", backgroundColor:"#F7D9E1", height:"25px", width:"120px", marginBottom:"-26px", marginLeft:"320px", padding:"4px", fontSize:"12px", color:"red", zIndex:"2", paddingTop:"2px"}}>Lựa chọn tốt nhất</div>:null}
                    <div key={index} className="ticket" style={{display: "inline-flex", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)", marginTop:"20px", borderRadius: "8px", width: "380px", height:"120px", cursor: "pointer", zIndex:"1"}} onClick={()=>{setVoucher(item); setIsPopupOpen(false)}}>
                        <div className='left-section' style={{ padding:"10px", width: "140px", alignItems:"center"}}>
                            <img  src='../../../public/img/vouchersx.png' alt='Vouchers' style={{width: "60px", height: "60px", marginLeft: "30px"}}/>
                            <div style={{marginTop: "10px", fontWeight: "bold", color:"red"}}>{item.name}</div>
                        </div>
                        <div className='divider' style={{height: "100%"}}></div>
                        <div className='right-section' style={{padding:"10px", textAlign: "left", width:"240px", paddingLeft:"20px"}}>
                            {item.value?<div style={{fontWeight: "bold"}}>Giảm {fixPrice(item.value)}</div>
                                :<>
                                    <div style={{fontWeight: "bold"}}>Giảm {item.percentage}%</div>
                                    <div style={{fontWeight: "bold"}}>Giảm tối đa: {fixPrice(item.max_amount)}</div>
                            </>}
                            <div style={{fontSize: "14px", color:"black"}}>Đơn tối thiểu: {fixPrice(item.minspent)}</div>
                            <div style={{fontSize: "12px", color:"gray"}}>Ngày hết hạn: <span style={{color:"red"}}>{formatToDDMMYYYY(item.endtime)}</span></div>
                        </div>
                    </div>
                    </>
                )
            }):<div>Không có voucher phù hợp</div>}
            {unReach && unReach.length > 0?
            <>
                <div style={{width: "500px", height:"8px", backgroundColor: "#F3F6F8", marginLeft:"0px", marginTop:"20px"}}></div>
                <div style={{marginTop:"15px", textAlign:"left", paddingLeft:"10px", fontWeight:"bold"}}>Voucher không khả dụng</div>
                {unReach.map((item,index)=>{
                    return(
                        <>
                        <div key={index} className="ticket" style={{display: "inline-flex", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)", marginTop:"20px", borderRadius: "8px 8px 0px 0px", width: "380px", height:"120px", cursor: "pointer", zIndex:"1"}}>
                            <div className='left-section' style={{ padding:"10px", width: "140px", alignItems:"center"}}>
                                <img  src='../../../public/img/vouchersx.png' alt='Vouchers' style={{width: "60px", height: "60px", marginLeft: "30px"}}/>
                                <div style={{marginTop: "10px", fontWeight: "bold", color:"red"}}>{item.name}</div>
                            </div>
                            <div className='divider' style={{height: "100%"}}></div>
                            <div className='right-section' style={{padding:"10px", textAlign: "left", width:"240px", paddingLeft:"20px"}}>
                                {item.value?<div style={{fontWeight: "bold"}}>Giảm {fixPrice(item.value)}</div>
                                    :<>
                                        <div style={{fontWeight: "bold"}}>Giảm {item.percentage}%</div>
                                        <div style={{fontWeight: "bold"}}>Giảm tối đa: {fixPrice(item.max_amount)}</div>
                                </>}
                                <div style={{fontSize: "14px", color:"black"}}>Đơn tối thiểu: {fixPrice(item.minspent)}</div>
                                <div style={{fontSize: "12px", color:"gray"}}>Ngày hết hạn: <span style={{color:"red"}}>{formatToDDMMYYYY(item.endtime)}</span></div>
                            </div>
                        </div>
                        <div style={{width: "380px", border: "1px solid gray", borderRadius:"0px 0px 8px 8px", backgroundColor:"#F3F6F8", marginLeft: "60px", fontSize: "12px", padding:"2px", color:"gray", textAlign:"left", paddingLeft:"10px"}}>Chưa đạt giá trị đơn hàng tối thiểu</div>
                    </>
                    )
                })}
            </>:null}
            {unApplied?unApplied.map((item,index)=>{
                    return(
                        <>
                        <div key={index} className="ticket" style={{display: "inline-flex", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)", marginTop:"20px", borderRadius: "8px 8px 0px 0px", width: "380px", height:"120px", cursor: "pointer", zIndex:"1"}}>
                            <div className='left-section' style={{ padding:"10px", width: "140px", alignItems:"center"}}>
                                <img  src='../../../public/img/vouchersx.png' alt='Vouchers' style={{width: "60px", height: "60px", marginLeft: "30px"}}/>
                                <div style={{marginTop: "10px", fontWeight: "bold", color:"red"}}>{item.name}</div>
                            </div>
                            <div className='divider' style={{height: "100%"}}></div>
                            <div className='right-section' style={{padding:"10px", textAlign: "left", width:"240px", paddingLeft:"20px"}}>
                                {item.value?<div style={{fontWeight: "bold"}}>Giảm {fixPrice(item.value)}</div>
                                    :<>
                                        <div style={{fontWeight: "bold"}}>Giảm {item.percentage}%</div>
                                        <div style={{fontWeight: "bold"}}>Giảm tối đa: {fixPrice(item.max_amount)}</div>
                                </>}
                                <div style={{fontSize: "14px", color:"black"}}>Đơn tối thiểu: {fixPrice(item.minspent)}</div>
                                <div style={{fontSize: "12px", color:"gray"}}>Ngày hết hạn: <span style={{color:"red"}}>{formatToDDMMYYYY(item.endtime)}</span></div>
                            </div>
                        </div>
                        <div style={{width: "380px", border: "1px solid gray", borderRadius:"0px 0px 8px 8px", backgroundColor:"#F3F6F8", marginLeft: "60px", fontSize: "12px", padding:"2px", color:"gray", textAlign:"left", paddingLeft:"10px"}}>Voucher không áp dụng cho sản phẩm này</div>
                    </>
                    )
                }):null}
            </div>
        </div>
    )
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
    const [discount, setDiscount] = useState(location.state.discount)
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
            //alert(voucher.promotion_id)
            const addOrder = await axios.post(`http://localhost:8000/api/order/CreateOrder/${localStorage.getItem('uid')}`,{
                orderItems: Torder,
                status: "Pending",
                shipping_address: holdAddress,
                shipping_fee: 0,
                shipping_co: "Grab",
                quantity: productList.reduce((sum, i) => sum + i.pquantity, 0),
                total_price: location.state.total,
                promotion_id: voucher && voucher.promotion_id?voucher.promotion_id: null
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
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };
    const [voucher, setVoucher] = useState(location.state.voucher)
    useEffect(() => {
        switch(voucher.apply_range){
            case 'all':
                setDiscount(voucher.value?voucher.value:Math.min(voucher.percentage * location.state.total, voucher.max_amount))
                break;
            case 'category':
                let tempArr = [...buyList].filter(item => item.cate_id == voucher.apply_id)
                let tempSum = tempArr.reduce((acc, item) => acc + (item.price * item.pquantity), 0);
                setDiscount(voucher.value?voucher.value:Math.min(voucher.percentage * tempSum, voucher.max_amount))
                break;
            case 'product':
                let tempArr2 = [...buyList].filter(item => item.product_id == voucher.apply_id)
                let tempSum2 = tempArr2.reduce((acc, item) => acc + (item.price * item.pquantity), 0);
                setDiscount(voucher.value?voucher.value:Math.min(voucher.percentage * tempSum, voucher.max_amount))
                break;
        }
    }, [voucher]);
    return (userData && userData.lname && <>
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
            <style>{`
                    .btn-css{
                        padding: 5px;
                        border: 1px solid #C0C0C0;
                        background-color: #F7FFF7;
                        border-radius: 8px;
                        cursor: pointer;
                    }
                    .btn-css:hover{
                        background-color: #D32F2F;
                        color: #F7FFF7;
                    }
                    .openPopup {
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    }

                    .openPopup:hover {
                        background-color: #0056b3;
                    }

                    .popup {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                    }

                    .popupContent {
                        background: #fff;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                        width: 300px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }

                    .closePopup {
                        padding: 10px 20px;
                        background-color: #ff4d4d;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                        margin-top: -10px;
                    }

                    .closePopup:hover {
                        background-color: #cc0000;
                    }
                `}
                </style>
            {isPopupOpen && (
                    <div className="popup" onClick={closePopup}>
                        <div className="popupContent" onClick={(e) => e.stopPropagation()} style={{width: "500px", height:"600px"}}>
                            <h2 style={{fontWeight: "bold", color:"red", fontSize:"20px", backgroundColor:"#F3F6F8", width:"500px", marginLeft:"-20px", height:"50px", marginTop:"-20px", paddingTop: "10px", borderRadius:"8px 8px 0px 0px", boxShadow:"0 5px 10px 0 rgba(0, 0, 0, 0.3)"}}>Chọn Voucher</h2>
                            <Voucher buyList={location.state.list} setVoucher={setVoucher} setIsPopupOpen={setIsPopupOpen} total={location.state.total}/>
                            <button className="closePopup" onClick={closePopup} style={{marginTop: "-30px"}}>
                            Đóng
                            </button>
                        </div>
                    </div>
                )}
                <div className="w-11/12 m-auto" style={{marginTop:"90px"}}>
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
                                    <div>Free</div>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>
                                <div className="flex justify-between mr-20">
                                    <div>Giảm giá</div>
                                    <div>{fixPrice(discount)}</div>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>  
                                <div className="promotion flex justify-between mr-20">
                                    <input type="text" placeholder="Nhập mã giảm giá" className="border border-black rounded-md p-2 w-3/5" value={voucher.promotion_id} onChange={(e) => setVoucher({ ...voucher, promotion_id: e.target.value })}/>
                                    <button className="bg-red-600 text-white p-2 rounded-md" onClick={openPopup}>Áp dụng</button>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>  
                                <div className="flex justify-between mr-20">
                                    <div className="font-semibold">Tổng tiền</div>
                                    <div>{fixPrice(location.state.total - discount)}</div>
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
                                    <div className="bg-red-600 text-white font-bold p-2 rounded-md" onClick={handleOrder} style={{cursor:"pointer"}}>Đặt hàng</div>
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