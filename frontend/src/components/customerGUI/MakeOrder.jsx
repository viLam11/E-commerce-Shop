import {useState, useEffect} from 'react'
import axios from 'axios'
//import { get } from '../../../../backend/src/routes/cart.route';

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

function Voucher({state, buyList, setVoucher, setIsPopupOpen}){
    const [vouchers, setList] = useState([])
    const [fitVoucher, setFit] = useState([])
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
        
        setFit([...vouchers].filter(item => item.quantity > 0 
            && (product_con(item) || category_con(item) || item.apply_range == "all")))
    },[vouchers])
    return (
        <div style={{width: "450px", height:"500px"}}>
            <h3>Bạn có thể chọn 1 voucher</h3>
            <div style={{overflowY: "scroll", height: "400px", marginTop: "10px"}}>
                {fitVoucher&&fitVoucher.length>0?fitVoucher.map((item, index)=>{
                return(
                    <div key={index} style={{display: "inline-flex", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)", marginTop:"20px", borderRadius: "8px", width: "340px", height:"120px", cursor: "pointer"}} onClick={()=>{setVoucher(item); setIsPopupOpen(false)}}>
                        <div style={{backgroundColor: "#EF8D82", padding:"10px"}}>
                            <img src='https://static.vecteezy.com/system/resources/previews/022/039/886/non_2x/discount-coupons-icon-style-vector.jpg' alt='Vouchers' style={{width: "60px", height: "60px"}}/>
                            <br />
                            {item.name}
                        </div>
                        <div style={{padding:"10px", textAlign: "left"}}>
                            <div>Số lượng còn lại: {item.quantity}</div>
                            <div>Ngày hết hạn: {formatToDDMMYYYY(item.endtime)}</div>
                            <div>Đơn tối thiểu: {fixPrice(item.minspent)}</div>
                            {item.value?<div>Giảm {fixPrice(item.value)}</div>
                            :<>
                                <div>Giảm {item.percentage}%</div>
                                <div>Giảm tối đa: {fixPrice(item.max_amount)}</div>
                            </>}
                        </div>
                    </div>
                )
            }):<div>Không có voucher phù hợp</div>}</div>
        </div>
    )
}
export default function MakeOrder({state, NavigateTo}){
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };
    const [defPhone, setPhone] = useState("")
    const [defAdress, setAddress] = useState("")
    const [hashAddress, setHash] = useState({
        street: "",
        district:"",
        city: "",
        province: "",
    })
    useEffect(() => {
        const fetchAdress = async () => {
            console.log(state.currentUser.uid)
            let adress = [];
            const res = await axios.get(`http://localhost:8000/api/user/GetAll/${state.currentUser.uid}`)
            //console.log(res)
            if (res.status != 200) throw new Error("Error while fetching address")
            adress = res.data.data?res.data.data: []
            setAddress(adress&&adress.length > 0?adress.find(item => item.isdefault == true).address:""); // Update images state once all images are fetched
        };

        fetchAdress();
    }, [state.currentUser]);
    useEffect(() => {
        const fetchPhone = async () => {
            console.log(state.currentUser.uid)
            let rphone = [];
            const res = await axios.get(`http://localhost:8000/api/user/GetPhone/${state.currentUser.uid}`)
            //console.log(res)
            if (res.status != 200) throw new Error("Error while fetching phone number")
            rphone = res.data.data?res.data.data: []
            setPhone(rphone&& rphone.length>0?rphone.map(item => item.phone):[]); // Update images state once all images are fetched
        };

        fetchPhone();
    }, [state.currentUser]);
    useEffect(() => {
        const [street, district, city, province] = defAdress.split(",");
        setHash({
          street: street || "",
          district: district || "",
          city: city || "",
          province: province || "",
        });
      }, [defAdress]);
    const [prodList, setList] = useState([])
    const [qlist, setq] = useState([])
    const [buyList, setBuy] = useState([])
    const [voucher, setVoucher] = useState({})
    const [total, setTotal] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [toggle, setTog] = useState(0)
    useEffect(()=>{
        const fetchCart = async() =>{
            console.log(state.currentUser.uid)
            try{
                const response = await axios.get(`http://localhost:8000/api/cart/GetCart/${state.currentUser.uid}?limit=1000`)
                console.log(response)
                if (response.status !== 200) {
                    alert('Lỗi khi lấy dữ liệu giỏ hàng');
                    return;
                }
    
                const cartData = response.data.data; // Dữ liệu giỏ hàng
                const productIds = cartData.map((item) => item.product_id);
    
                // Lọc sản phẩm từ productData
                const filteredProducts = state.productData?.filter((item) =>
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
                alert('Lỗi')
            }
        }
        fetchCart()
    },[toggle])
    useEffect(() => { 
        const selectedProducts = prodList.filter(item => item.chose === true);
        setBuy(selectedProducts);
    }, [prodList]);
    
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
            const update = await axios.put(`http://localhost:8000/api/cart/UpdateCart/${state.currentUser.uid}`, {
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
            const update = await axios.post(`http://localhost:8000/api/cart/DeleteCart/${state.currentUser.uid}`, {
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
    console.warn(state.currentOrder)
    return (   
    <div className="checkout-container">
        <div className="form-section">
        <h2>Thông tin giao hàng</h2>
        <form className="checkout-form">
            <label>
            Họ tên *
            <input type="text" placeholder="Nhập họ tên" required />
            </label>
            <label>
            Company Name
            <input type="text" placeholder="Nhập tên công ty" />
            </label>
            <label>
            Street Address*
            <input type="text" placeholder="Nhập địa chỉ" value={hashAddress.street} required />
            </label>
            <label>
            Apartment, floor, etc. (optional)
            <input type="text" placeholder="Chi tiết địa chỉ (nếu có)" />
            </label>
            <label>
            Town/City*
            <input type="text" placeholder="Nhập thành phố" value={hashAddress.city} required />
            </label>
            <label>
            Phone Number*
            <input type="tel" placeholder="Nhập số điện thoại" value={defPhone[0]} required />
            </label>
            <label>
            Email Address*
            <input type="email" placeholder="Nhập email" required />
            </label>
            <label className="checkbox-container">
            <input type="checkbox" /> Save this information for faster check-out next time
            </label>
        </form>
        </div>

        <div className="summary-section">
        <div className="items-list">
            {state.currentOrder&&state.currentOrder.length>0
            ?state.currentOrder.map((item, index)=>{
                return(
                    <div className='item'>
                        <div>{item.pname}</div>
                        <div>{fixPrice(item.price * item.pquantity)}</div>
                    </div>
                )
            }):null}
        </div>
        <div className="price-summary">
            <p>Subtotal: {fixPrice(state.currentOrder.reduce((sum, cur) => sum + (cur.price || 0) * (cur.pquantity || 0), 0))}</p>
            <p>Shipping: Free</p>
            <p><strong>Total: {fixPrice(state.currentOrder.reduce((sum, cur) => sum + (cur.price || 0) * (cur.pquantity || 0), 0))}</strong></p>
        </div>
        <div className="payment-options">
            <label>
            <input type="radio" name="payment" value="bank" /> Bank
            </label>
            <label>
            <input type="radio" name="payment" value="cod" defaultChecked /> Cash on delivery
            </label>
        </div>
        <div className="coupon-section">
            <input type="text" placeholder="Mã giảm giá" />
            <button>Áp dụng</button>
        </div>
        <button className="place-order">Place Order</button>
        <p>Nếu thanh toán QR</p>
        </div>
    </div>
    )
}