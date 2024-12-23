import {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from '../Footer';
import '../../design/Shopping/cart.css'
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
export default function Cart(){
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [productData, setData] = useState([])
    const navigate = useNavigate()
    const uid = localStorage.getItem('uid')
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
    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const [prodList, setList] = useState([])
    const [qlist, setq] = useState([])
    const [buyList, setBuy] = useState([])
    const [voucher, setVoucher] = useState({})
    const [total, setTotal] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [toggle, setTog] = useState(0)
    useEffect(()=>{
        const fetchCart = async() =>{
            try{
                const response = await axios.get(`http://localhost:8000/api/cart/GetCart/${uid}?limit=1000`)
                if (response.status !== 200) {
                    alert('Lỗi khi lấy dữ liệu giỏ hàng');
                    return;
                }
    
                const cartData = response.data.data; // Dữ liệu giỏ hàng
                const productIds = cartData.map((item) => item.product_id);
    
                // Lọc sản phẩm từ productData
                const filteredProducts = productData?.filter((item) =>
                    productIds.includes(item.product_id)
                );
                const updatedProducts = filteredProducts?.map((product) => {
                    const cartItem = cartData.find((item) => item.product_id === product.product_id);
                    return {
                        ...product,
                        pquantity: cartItem?.quantity || 0, // Gắn `quantity` hoặc mặc định là 0 nếu không tìm thấy
                        chose: false
                    };
                });
                
                const quantities = cartData.map((item) => item.quantity);
                setList(updatedProducts || []);
                setq(quantities || []);
            } 
            catch(e){
                alert('Lỗi 2718')
            }
        }
        fetchCart()
    },[toggle, productData])
    useEffect(() => { 
        const selectedProducts = prodList.filter(item => item.chose === true);
        setBuy(selectedProducts);
    }, [prodList, productData]);
    
    useEffect(() => {
        const sum = buyList.reduce((acc, item) => acc + (item.price * item.pquantity), 0);
        setTotal(sum);
    }, [buyList, prodList]);

    useEffect(() => {
        switch(voucher.apply_range){
            case 'all':
                setDiscount(voucher.value?voucher.value:Math.min(voucher.percentage * total, voucher.max_amount))
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
    }, [buyList, prodList, voucher]);

    const handleUpdate = async (item, q) => {
        try {
            const update = await axios.put(`http://localhost:8000/api/cart/UpdateCart/${uid}`, {
                product_id: item.product_id,
                quantity: q
            });
    
            if (update.status !== 200) {
                throw new Error("Lỗi cập nhật");
            }
            
            // Thêm xử lý nếu cần sau khi cập nhật thành công
            console.log("Cập nhật thành công", update.data);
        } catch (e) {
            if (e.response) {
                // Nếu lỗi từ server, lấy thông tin chi tiết
                alert(`Lỗi cập nhật: ${e.response.data.message || e.message}`);
            } else {
                // Lỗi từ client hoặc các lỗi khác
                alert(e.message || "Lỗi cập nhật");
            }
        }
    };    

    const handleDelete = async(item) =>{
        try {
            const update = await axios.post(`http://localhost:8000/api/cart/DeleteCart/${uid}`, {
                product_id: item,
            });
    
            if (update.status !== 200) {
                throw new Error("Lỗi cập nhật");
            }
            setTog(!toggle)
            // Thêm xử lý nếu cần sau khi cập nhật thành công
            alert("Cập nhật thành công");
        } catch (e) {
            if (e.response) {
                // Nếu lỗi từ server, lấy thông tin chi tiết
                alert(`Lỗi cập nhật: ${e.response.data.message || e.message}`);
            } else {
                // Lỗi từ client hoặc các lỗi khác
                alert(e.message || "Lỗi cập nhật");
            }
        }
    }
    const [start, setStart] = useState(0); // Quản lý điểm bắt đầu
    const [end, setEnd] = useState(5); // Quản lý điểm kết thúc
    const handleNext = () => {
        //console.log("Next")
        setStart((prev) => Math.min(prev + 5, prodList.length - 1));
        setEnd((prev) => Math.min(prev + 5, prodList.length));
    };
    
    const handlePrevious = () => {
        //console.log("Prev")
        setStart((prev) => Math.max(prev - 5, 0));
        setEnd((prev) => Math.max(prev - 5, 5));
    };

    return (prodList && 
        <>
        <Header/>
        <div className='cart'>
            <div className='breadcrumb'><span onClick={()=> NavigateTo('HomePage')} style={{color: "gray", cursor: "pointer"}}>Trang chủ</span> / <span>Giỏ hàng</span></div>
            <div style={{ marginTop: "50px", padding: "10px" }}>
      {/* Header */}
                <div
                    style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr 100px 100px 150px 150px",
                    backgroundColor: "#A0C4FF",
                    fontWeight: "bold",
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "8px",
                    width: "1200px"
                    }}
                >
                    <div style={{display:"inline-flex", gap: "10px"}}><input type='checkbox' checked={prodList.length > 0 && prodList.every((item) => item.chose)} onChange={(e)=>{
                                    const tempArr = [...prodList]
                                    for (let i = 0; i < tempArr.length; i++)
                                        tempArr[i] = {
                                            ...tempArr[i],
                                            chose: e.target.checked,
                                        };
                                    setList(tempArr);
                                }}/> Chọn tất cả</div>
                    <div>Sản phẩm</div>
                    <div>Đơn giá</div>
                    <div>Số lượng</div>
                    <div>Thành tiền</div>
                    <div></div>
                </div>

                {/* Body */}
                {prodList && prodList.length > 0 ? (
                    prodList.slice(start,end).map((item, index) => (
                    <div
                        key={index}
                        style={{
                        display: "grid",
                        gridTemplateColumns: "120px 1fr 100px 100px 150px 150px",
                        backgroundColor: index % 2 === 0 ? "#A0C4FF" : "#A0C4FF",
                        padding: "10px",
                        textAlign: "center",
                        marginTop: "20px",
                        borderRadius: "8px",
                        width: "1200px",
                        height: "55px",
                        justifyContent: "center"
                        }}
                    >
                        <div style={{paddingTop: "5px"}}><input type="checkbox" checked={item.chose} onChange={(e)=>{
                            const tempArr = [...prodList]
                            tempArr[index + start] = {
                                ...tempArr[index + start],
                                chose: e.target.checked,
                            };
                            setList(tempArr)
                        }}/></div>
                        <div style={{display: "inline-flex", alignItems:"center",marginLeft:"50px", justifyItems:"center", paddingRight:"10px"}}><img src={item.image[0]} style={{height: "40px", marginTop: "-8px"}}/> <div style={{paddingBottom:"0px", marginLeft:"10px"}}>{item.pname}</div></div>
                        <div style={{paddingTop: "5px",alignItems:"center"}}>{fixPrice(item.price)}</div>
                        <div style={{display: "inline-flex", width: "40px", height: "40px", marginLeft: "30px", border: "2px solid #696969", borderRadius: "6px", paddingLeft:"5px", paddingTop: "3px"}}>
                            <input type='number' value={item.pquantity} style={{width: "20px", height: "30px", border: "none", backgroundColor: "transparent", cursor: "pointer"}} 
                            onChange={(e)=>{
                                    const tempArr = [...prodList]
                                    tempArr[index] = {
                                        ...tempArr[index],
                                        pquantity: Math.min(e.target.value, item.quantity),
                                    };
                                    setList(tempArr);
                                    handleUpdate(item, Math.min(e.target.value, item.quantity))
                                }}/>
                            <div style={{fontSize: "10px", cursor: "pointer"}}>
                                <div onClick={()=>{
                                    const tempArr = [...prodList]
                                    tempArr[index] = {
                                        ...tempArr[index],
                                        pquantity: Math.min(item.pquantity + 1,item.quantity),
                                    };
                                    setList(tempArr);
                                    handleUpdate(item, Math.min(item.pquantity + 1,item.quantity))
                                }}>⮝</div>
                                <div onClick={()=>{
                                    const tempArr = [...prodList]
                                    tempArr[index] = {
                                        ...tempArr[index],
                                        pquantity: Math.max(item.pquantity - 1, 0),
                                    };
                                    setList(tempArr);
                                    handleUpdate(item, Math.max(item.pquantity - 1, 0))
                                }}>⮟</div>
                            </div>
                        </div>
                        <div style={{paddingTop: "5px"}}>{fixPrice(item.price * item.pquantity)}</div>
                        <div style={{paddingTop: "0px"}}>
                        {/* Lựa chọn button */}
                        <style>
                            {`
                                .dbutton{
                                    background-color: lightblue;
                                    color: black
                                }
                                .dbutton:hover{
                                    background-color: red;
                                    color: white
                                }
                            `}
                        </style>
                        <button className='dbutton' style={{ padding: "5px 10px", border:"1px solid gray", borderRadius: "8px"}} 
                        onClick={()=> handleDelete(item.product_id)}
                        >Xóa</button>

                        </div>
                    </div>
                    ))
                ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                    Không có sản phẩm nào.
                    </div>
                )}
                <div style={{display: "inline-flex"}}>
                <div className='btn-css' style={{padding: "10px 15px 10px 15px", border: "1px solid #696D5D", borderRadius: "6px", cursor: "pointer", marginTop: "20px", width: "80px", height: "40px" }}>Trở về</div>
                <span className='click left' onClick = {handlePrevious}></span>
                <span className='click right' onClick={handleNext}></span>
                </div>
                
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
                            <Voucher buyList={buyList} setVoucher={setVoucher} setIsPopupOpen={setIsPopupOpen} total={total}/>
                            <button className="closePopup" onClick={closePopup} style={{marginTop: "-30px"}}>
                            Đóng
                            </button>
                        </div>
                    </div>
                )}
                <div style={{display: "inline-flex"}}>
                    <div style={{marginTop: "50px", display:"inline-flex", height: '40px'}}>
                        <input type='text' placeholder='Mã giảm giá' value={voucher.promotion_id} style={{padding: "5px", borderRadius: "8px", width: "210px", border: "1px solid black"}}/>
                        <div className='btn-css' onClick={openPopup} style={{width: "160px", textAlign:"center", paddingTop:"6px", marginLeft: "20px"}}>Chọn mã giảm giá</div>
                    </div>
                    <div style={{marginLeft: "410px", width: "400px", border: "2px solid #ADC1C6", padding:"20px",borderRadius: "10px"}}>
                        <div style={{marginBottom: "20px", color: "#D41545", fontSize: "18px", fontWeight: "bold"}}>Tổng cộng</div>
                        <div style={{display: 'inline-flex'}}>
                            <div>Thành tiền: </div>
                            <div style={{marginLeft: "170px"}}>{fixPrice(total)}</div>
                        </div>
                        <div className='underline' style={{marginBottom: "10px", width: "350px" }}></div>
                        <div style={{display: 'inline-flex'}}>
                            <div>Giảm giá: </div>
                            <div style={{marginLeft: "180px"}}>{fixPrice(discount)}</div>
                        </div>
                        <div className='underline' style={{marginBottom: "10px", width: "350px" }}></div>
                        <div style={{display: 'inline-flex'}}>
                            <div>Vận chuyển: </div>
                            <div style={{marginLeft: "160px"}}>Free</div>
                        </div>
                        <div className='underline' style={{marginBottom: "10px", width: "350px" }}></div>
                        <div style={{display: 'inline-flex', marginBottom: "10px"}}>
                            <div>Tổng cộng: </div>
                            <div style={{marginLeft: "170px"}}>{fixPrice(total-discount)}</div>
                        </div>
                        <div className='btn-css' style={{width: "100px", alignItems: "center", textAlign: "center", marginLeft: "120px"}} onClick={() => navigate('/customer/pay',{state: {list: buyList, total: total, discount: discount, voucher: voucher}})}>Mua hàng</div>
                    </div>
                </div>
                </div>
        </div>
        <Footer/>
        </>
    )
}