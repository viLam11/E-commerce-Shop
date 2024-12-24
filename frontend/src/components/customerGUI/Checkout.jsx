
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

const fixPrice = (price) => {
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

export function UpdatePhone({ currentUser, setCurPhone, closePopupPhone }) {
    const [phone, setVal] = useState("")
    const navigate = useNavigate()
    const [Pnumber, setPhone] = useState([])
    const [toggle, setToggle] = useState(1)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [Err, setErr] = useState("")
    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };
    useEffect(() => {
        let timer;
        if (isPopupOpen) {
            timer = setTimeout(() => {
                setIsPopupOpen(false);
            }, 3000); // Tự tắt sau 3 giây
        }
        return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount hoặc khi popup tắt
    }, [isPopupOpen]);
    useEffect(() => {
        const fetchPhone = async () => {
            console.log(currentUser.uid)
            let rphone = [];
            const res = await axios.get(`http://localhost:8000/api/user/GetPhone/${currentUser.uid}`)
            //console.log(res)
            if (res.status != 200) throw new Error("Error while fetching phone number")
            rphone = res.data.data ? res.data.data : []
            setPhone(rphone && rphone.length > 0 ? rphone.map(item => item.phone) : []); // Update images state once all images are fetched
        };

        fetchPhone();
    }, [currentUser, toggle]);

    const handleSubmit = async () => {
        //alert(phone)
        if (!phone || phone == "") {
            setErr('Vui lòng nhập đầy đủ thông tin')
        }
        else {
            const addPhone = await axios.post(`http://localhost:8000/api/user/CreatePhone/${currentUser.uid}`, { phone: [phone] })
            if (addPhone.status != 200) {
                setErr('Thêm số điện thoại thất bại')
            }
            else {
                //set('Thêm số điện thoại thành công')
                setVal("")
                setToggle(!toggle)
                setErr("")
            }
        }
        setIsPopupOpen(true)
    }

    const handleRemove = async (index) => {
        if (!Pnumber[index] || Pnumber[index] == "") {
            setErr('Vui lòng nhập đầy đủ thông tin')
        }
        else {
            const addPhone = await axios.post(`http://localhost:8000/api/user/DeletePhone/${currentUser.uid}`, { phone: Pnumber[index] })
            if (addPhone.status != 200) {
                setErr('Xóa số điện thoại thất bại')
            }
            else {
                //alert('Xóa số điện thoại thành công')
                setToggle(!toggle)
                setErr("")
            }
        }
        setIsPopupOpen(true)
    }
    return (
        <div className="profile-form" style={{width:"500px", marginLeft: "-20px", borderRadius: "0px 0px 8px 8px" }}>
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
                        .address-table tr:hover{
                            background-color: #F4F6E0;
                        }
                    `}
            </style>
            {isPopupOpen && (
                <div className="popup" onClick={closePopup}>
                    <div className="popupContent" onClick={(e) => e.stopPropagation()} style={Err == "" ? { width: "200px", height: "80px", backgroundColor: "rgba(0, 255, 0, 0.3)", color: "green" } : { width: "200px", height: "80px", backgroundColor: "rgba(255, 0, 0, 0.3)", color: "red" }}>
                        {Err == "" ?
                            <>
                                <div>&#9989;</div>
                                <div>Cập nhật thành công</div>
                            </> :
                            <>
                                <div style={{ marginTop: "-15px" }}>&#10060;</div>
                                <div>{Err}</div>
                            </>}
                    </div>
                </div>
            )}
            <h2>Thông tin địa chỉ</h2>
            <table className="address-table">
                <thead>
                    <th>STT</th>
                    <th>Số điện thoại</th>
                    <th style={{ width: "40px" }}>Chỉnh sửa</th>
                </thead>
                <tbody>
                    {Pnumber && Pnumber.length > 0 ?
                        Pnumber.map((p, index) => {
                            //console.log(Pnumber)
                            return (
                                <tr key={index} style={{cursor: "pointer"}}>
                                    <td onClick={()=>{setCurPhone(p); closePopupPhone()}}>{index + 1}</td>
                                    <td onClick={()=>{setCurPhone(p); closePopupPhone()}}>{p}</td>
                                    <td style={{ display: "inline-flex", width: "60px" }}><button onClick={() => handleRemove(index)} style={{ color: "white", backgroundColor: "red" }}>Xóa</button></td> {/* Close button */}
                                </tr>
                            )

                        }) : null}
                </tbody>
            </table>
            {!Pnumber || Pnumber.length <= 0 ? <div style={{ marginBottom: "10px", marginTop: "-14px" }}>Khách hàng hiện chưa cập nhật số điện thoại</div> : null}
            <div className="form-group">
                <div className="full-width">
                    <label htmlFor="phone">Nhập số điện thoại</label>
                    <input type="text" id="phone" value={phone} onChange={(e) => setVal(e.target.value)} />
                </div>
            </div>

            <div className="form-actions">
                <button className="btn-cancel">Hủy</button>
                <button className="btn-save" onClick={handleSubmit}>Thêm số điện thoại</button>
            </div>
        </div>
    )
}

export function UpdateAdress({ currentUser, closePopupAd, setCurAddress}) {
    const [address, setVal] = useState({
        province: "",
        city: "",
        district: "",
        street: "",
        isdefault: false
    })
    const navigate = useNavigate()
    const [toggle, setToggle] = useState(1)
    const [defAdress, setAddress] = useState([])
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [Err, setErr] = useState("")
    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };
    useEffect(() => {
        let timer;
        if (isPopupOpen) {
            timer = setTimeout(() => {
                setIsPopupOpen(false);
            }, 3000); // Tự tắt sau 3 giây
        }
        return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount hoặc khi popup tắt
    }, [isPopupOpen]);
    useEffect(() => {
        const fetchAdress = async () => {
            console.log(currentUser.uid)
            let adress = [];
            const res = await axios.get(`http://localhost:8000/api/user/GetAll/${currentUser.uid}`)
            //console.log(res)
            if (res.status != 200) throw new Error("Error while fetching address")
            adress = res.data.data ? res.data.data : []
            setAddress(adress); // Update images state once all images are fetched
        };

        fetchAdress();
        console.log(defAdress)
    }, [currentUser, toggle]);
    const sample = ['57 A Street C, District 1, City DN', '58 A Street D, District 3, City HN', '98 A Street C, District 3, City HN']
    const [partitionedAddresses, setPar] = useState(defAdress
        .map((addr) => {
            const parts = addr.address.split(',').map((item) => item.trim());
            return {
                street: parts[0] || "", // Nếu thiếu thì trả về chuỗi rỗng
                district: parts[1] || "",
                city: parts[2] || "",
                province: parts[3] || "",
                isdefault: addr.isdefault || false
            };
        })
        .sort((a, b) => b.isdefault - a.isdefault));
    const [prevState, setPrev] = useState(partitionedAddresses)
    useEffect(() => {
        setPar(
            defAdress
                .map((addr) => {
                    const parts = addr.address.split(',').map((item) => item.trim());
                    return {
                        street: parts[0] || "", // Nếu thiếu thì trả về chuỗi rỗng
                        district: parts[1] || "",
                        city: parts[2] || "",
                        province: parts[3] || "",
                        isdefault: addr.isdefault || false
                    };
                })
                .sort((a, b) => b.isdefault - a.isdefault) // Đưa các phần tử có isdefault: true lên đầu
        );

    }, [defAdress])
    // useEffect(()=>{
    //     setPrev([...partitionedAddresses])
    // },[defAdress])
    const handleSubmit = async () => {
        //alert(address.isdefault)
        let resAddress = address.street + ", " + address.district + ", " + address.city + ", " + address.province
        if (address.province == "" || address.street == "" || address.city == "" || address.district == "" || !address.province || !address.street || !address.city || !address.district) {
            setErr('Vui lòng nhập đầy đủ thông tin')
        }
        else if (defAdress.map(item => item.address).includes(resAddress)) {
            setErr('Địa chỉ đã tồn tại')
            setToggle(!toggle)
            setVal({
                province: "",
                city: "",
                district: "",
                street: "",
                isdefault: false
            })
        }
        else {
            const addAddress = await axios.post(`http://localhost:8000/api/user/CreateAddress/${currentUser.uid}`,
                {
                    address: resAddress,
                    isdefault: address.isdefault
                }
            )
            //console.log("add",addAddress)
            if (addAddress.data.status !== 200) {
                setErr(addAddress.msg || "Thêm địa chỉ thất bại")
            }
            else {
                setErr("")
                setToggle(!toggle)
                //alert('Thêm địa chỉ thành công')
                setVal({
                    province: "",
                    city: "",
                    district: "",
                    street: "",
                    isdefault: false
                })
                //defAdress.push(address.street + ", " + address.district + ", " + address.city +", " +address.province)
            }
        }
        setIsPopupOpen(true)
    }

    const handleUpdate = async (index) => {
        console.log(partitionedAddresses[index])
        // console.warn(prevState[index])
        if (partitionedAddresses[index].province == "" || partitionedAddresses[index].street == "" || partitionedAddresses[index].city == "" || partitionedAddresses[index].district == "") {
            setErr('Vui lòng nhập đầy đủ thông tin')
        }
        else {
            const updateAddress = await axios.put(`http://localhost:8000/api/user/UpdateAddress/${currentUser.uid}`,
                {
                    old_address: defAdress[index].address,
                    new_address: partitionedAddresses[index].street + ", " + partitionedAddresses[index].district + ", " + partitionedAddresses[index].city + ", " + partitionedAddresses[index].province,
                    isdefault: partitionedAddresses[index].isdefault
                }
            )
            if (updateAddress.status !== 200) {
                setErr(updateAddress.msg || "Thêm địa chỉ thất bại")
            }
            else {
                setErr("")
                setToggle(!toggle)
                //alert('Cập nhật địa chỉ thành công')
                //defAdress.push(item.street + ", " + item.district + ", " + item.city +", " +item.province)
            }
        }
        setIsPopupOpen(true)
    }

    const handleRemove = async (index) => {
        console.log(defAdress[index].address)
        const item = partitionedAddresses[index]
        if (!defAdress[index].address) {
            setErr('Vui lòng nhập đầy đủ thông tin')
        }
        else {
            const updateAddress = await axios.post(`http://localhost:8000/api/user/DeleteAddress/${localStorage.getItem('uid')}`,
                {
                    address: defAdress[index].address
                }
            )
            if (updateAddress.data.status !== 200) {
                setErr(updateAddress.msg || "Xóa địa chỉ thất bại")
            }
            else {
                if (defAdress && defAdress.length > 1 && defAdress[index].isdefault) {
                    let temp = defAdress.map(adrr => adrr.address)
                    temp = temp.filter(item => item != defAdress[index].address)
                    const resAddress = await axios.put(`http://localhost:8000/api/user/UpdateAddress/${localStorage.getItem('uid')}`,
                        {
                            old_address: temp[0],
                            new_address: temp[0],
                            isdefault: true
                        }
                    )
                }
                setErr("")
                setToggle(!toggle)
                //defAdress.push(item.street + ", " + item.district + ", " + item.city +", " +item.province)
            }
        }
        setIsPopupOpen(true)
    }
    return (
        <>
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
                        .address-table tr:hover{
                            background-color: #F4F6E0;
                        }
                    `}
            </style>
            {isPopupOpen && (
                <div className="popup" onClick={closePopup}>
                    <div className="popupContent" onClick={(e) => e.stopPropagation()} style={Err == "" ? { width: "200px", height: "80px", backgroundColor: "rgba(0, 255, 0, 0.3)", color: "green" } : { width: "200px", height: "80px", backgroundColor: "rgba(255, 0, 0, 0.3)", color: "red" }}>
                        {Err == "" ?
                            <>
                                <div>&#9989;</div>
                                <div>Cập nhật thành công</div>
                            </> :
                            <>
                                <div style={{ marginTop: "-15px" }}>&#10060;</div>
                                <div>{Err}</div>
                            </>}
                    </div>
                </div>
            )}
            <div className="profile-form" style={{ backgroundColor: "white", width:"1100px", marginLeft: "-20px", borderRadius: "0px 0px 8px 8px" }}>
                <h2>Thông tin địa chỉ</h2>
                <table className="address-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Số nhà</th>
                            <th>Phường/Xã</th>
                            <th>Quận/Huyện</th>
                            <th>Tỉnh/Thành phố</th>
                            <th>Mặc định</th>
                            <th style={{ width: "95px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            partitionedAddresses && partitionedAddresses.length > 0 ? partitionedAddresses.map((item, index) => {
                                return (
                                    <tr key={index} style={{cursor: "pointer"}}>
                                        <td onClick={()=>{setCurAddress(item.street + ', ' + item.district + ', ' + item.city + ', ' + item.province); closePopupAd()}}>{index + 1}</td> {/* Display the index + 1 for STT */}
                                        <td onClick={()=>{setCurAddress(item.street + ', ' + item.district + ', ' + item.city + ', ' + item.province); closePopupAd()}}><input type="text" id={`province${index}`} value={item.street} onChange={(e) => {
                                            const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                            tempArr[index] = {
                                                ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                                street: e.target.value, // Cập nhật trường `street`
                                            };
                                            setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                        }} /></td>
                                        <td onClick={()=>{setCurAddress(item.street + ', ' + item.district + ', ' + item.city + ', ' + item.province); closePopupAd()}}><input type="text" id={`province${index}`} value={item.district} onChange={(e) => {
                                            const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                            tempArr[index] = {
                                                ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                                district: e.target.value, // Cập nhật trường `street`
                                            };
                                            setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                        }} /></td>
                                        <td onClick={()=>{setCurAddress(item.street + ', ' + item.district + ', ' + item.city + ', ' + item.province); closePopupAd()}}><input type="text" id={`province${index}`} value={item.city} onChange={(e) => {
                                            const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                            tempArr[index] = {
                                                ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                                city: e.target.value, // Cập nhật trường `street`
                                            };
                                            setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                        }} /></td>
                                        <td onClick={()=>{setCurAddress(item.street + ', ' + item.district + ', ' + item.city + ', ' + item.province); closePopupAd()}}><input type="text" id={`province${index}`} value={item.province} onChange={(e) => {
                                            const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                            tempArr[index] = {
                                                ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                                province: e.target.value, // Cập nhật trường `street`
                                            };
                                            setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                        }} /></td>
                                        <td onClick={()=>{setCurAddress(item.street + ', ' + item.district + ', ' + item.city + ', ' + item.province); closePopupAd()}}><input type="checkbox" name="subscribe" checked={item.isdefault} onChange={(e) => {
                                            const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                            tempArr[index] = {
                                                ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                                isdefault: e.target.checked, // Cập nhật trường `street`
                                            };
                                            setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                        }} /></td>
                                        <td style={{ display: "inline-flex", alignItems: "center" }}><button style={{ width: "75px", backgroundColor: "greenyellow", color: "gray", marginRight: "30px", alignItems: "center" }} onClick={() => handleUpdate(index)}>Cập nhật</button><button onClick={() => handleRemove(index)} style={{ color: "white", backgroundColor: "red", marginLeft: "10px", alignItems: "center" }}>Xóa</button></td> {/* Close button */}
                                    </tr>
                                )
                            }) : <span style={{ paddingTop: "5px", textAlign: "center" }}>Người dùng không có thông tin địa chỉ</span>
                        }
                    </tbody>
                </table>
                <div className="form-group">
                    <div className="full-width">
                        <label htmlFor="province">Nhập Tỉnh/thành phố</label>
                        <input type="text" id="province" value={address.province} onChange={(e) => setVal((prev) => ({ ...prev, province: e.target.value }))} />
                    </div>
                    <div className="full-width">
                        <label htmlFor="city">Nhập Quận/Huyện</label>
                        <input type="text" id="city" value={address.city} onChange={(e) => setVal((prev) => ({ ...prev, city: e.target.value }))} />
                    </div>
                </div>
                <div className="form-group">
                    <div className="full-width">
                        <label htmlFor="district">Nhập Phường/Xã</label>
                        <input type="text" id="district" value={address.district} onChange={(e) => setVal((prev) => ({ ...prev, district: e.target.value }))} />
                    </div>
                    <div className="full-width">
                        <label htmlFor="street">Nhập số nhà/tên đường</label>
                        <input type="text" id="street" value={address.street} onChange={(e) => setVal((prev) => ({ ...prev, street: e.target.value }))} />
                    </div>
                </div>
                <label style={{ display: "inline-flex", width: "200px" }}>
                    <input style={{ width: "10px" }} type="checkbox" name="subscribe" checked={address.isdefault} onChange={(e) => setVal((prev) => ({ ...prev, isdefault: e.target.checked }))} />
                    <span style={{ marginTop: "5px", marginLeft: "10px" }}>Địa chỉ mặc định</span>
                </label>
                <div className="form-actions">
                    <button className="btn-cancel">Hủy</button>
                    <button className="btn-save" onClick={handleSubmit}>Thêm địa chỉ</button>
                </div>
            </div>
        </>
    )
}


function Voucher({ state, buyList, setVoucher, setIsPopupOpen, total,pquantity, pprice }) {
    const [vouchers, setList] = useState([])
    const [fitVoucher, setFit] = useState([])
    const [unReach, setReach] = useState([])
    const [unApplied, setApply] = useState([])
    useEffect(() => {
        const fetchVoucher = async () => {
            const res = await fetch('http://localhost:8000/api/promotion/GetAll')
            const data = await res.json()
            console.log(data)
            if (data.status != 200) throw new Error("Error while fetching data")
            setList(data.data)
        }

        fetchVoucher()
    }, [])
    const discountValue = (voucher) => {
        switch (voucher.apply_range) {
            case 'all':
                return (voucher.value ? voucher.value : Math.min(voucher.percentage * total, voucher.max_amount))
                break;
            case 'category':
                let tempArr = [...buyList].filter(item => item.cate_id == voucher.apply_id)
                let tempSum = tempArr.reduce((acc, item) => acc + (item.price * item.pquantity), 0);
                return (voucher.value ? voucher.value : Math.min(voucher.percentage * tempSum, voucher.max_amount))
                break;
            case 'product':
                let tempArr2 = [...buyList].filter(item => item.product_id == voucher.apply_id)
                let tempSum2 = tempArr2.reduce((acc, item) => acc + (item.price * item.pquantity), 0);
                return (voucher.value ? voucher.value : Math.min(voucher.percentage * tempSum, voucher.max_amount))
                break;
        }
    }
    //buyList.map(i => i.product_id).includes(item.apply_id) || buyList.map(i => i.cate_id).includes(item.apply_id) ||
    useEffect(() => {
        const product_con = (item) => {
            if (item.apply_range != "product") return false // Check if the voucher is applied to product
            let checkList = buyList.find(i => i.product_id == item.apply_id)
            if (!checkList ) return false
            let checkListPrice = checkList.price * (!checkList.pquantity?pquantity:checkList.pquantity)
            return (item.minspent <= checkListPrice)
        }

        const category_con = (item) => {
            if (item.apply_range != "category_id") return false // Check if the voucher is applied to category
            let checkList = buyList.filter(i => i.cate_id == item.apply_id)
            if (checkList.length == 0) return false
            let checkListPrice = checkList.reduce((sum, current) => sum + current.price * (current.pquantity?current.pquantity:pquantity), 0)
            return (item.minspent <= checkListPrice)
        }

        const uproduct_con = (item) => {
            if (item.apply_range != "product") return false // Check if the voucher is applied to product
            let checkList = buyList.find(i => i.product_id == item.apply_id)
            if (!checkList ) return false
            let checkListPrice = checkList.price * (!checkList.pquantity?pquantity:checkList.pquantity)
            return (item.minspent > checkListPrice) 
        }

        const ucategory_con = (item) => {
            if (item.apply_range != "category_id") return false // Check if the voucher is applied to category
            let checkList = buyList.filter(i => i.cate_id == item.apply_id)
            if (checkList.length == 0) return false
            let checkListPrice = checkList.reduce((sum, current) => sum + current.price * (current.pquantity?current.pquantity:pquantity), 0)
            return (item.minspent > checkListPrice)
        }

        setFit([...vouchers].filter(item => item.quantity > 0
            && (product_con(item) || category_con(item) || (item.apply_range == "all" && item.minspent <= buyList.reduce((sum, cur) => sum += cur.pquantity * cur.price, 0))))
            .sort((a, b) => discountValue(b) - discountValue(a))
        )
        setReach([...vouchers].filter(item => item.quantity > 0
            && (uproduct_con(item) || ucategory_con(item) || (item.apply_range == "all" && item.minspent > buyList.reduce((sum, cur) => sum += cur.pquantity * cur.price, 0))))
            .sort((a, b) => discountValue(b) - discountValue(a))
        )
        setApply([...vouchers].filter(item => !uproduct_con(item) && !ucategory_con(item) && item.apply_range != 'all')
            .sort((a, b) => discountValue(b) - discountValue(a))
        )
    }, [vouchers])
    return (
        <div style={{ width: "450px", height: "500px" }}>
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
            <div className='element' style={{ overflowY: "scroll", height: "450px", marginTop: "15px", width: "500px", marginLeft: "-20px" }}>
                <h3 style={{ marginTop: "10px", marginBottom: "10px" }}>Bạn có thể chọn 1 voucher</h3>
                <div style={{ width: "500px", height: "8px", backgroundColor: "#F3F6F8", marginLeft: "0px" }}></div>
                <div style={{ marginTop: "15px", textAlign: "left", paddingLeft: "10px", fontWeight: "bold" }}>Mã giảm giá</div>
                {fitVoucher && fitVoucher.length > 0 ? fitVoucher.map((item, index) => {
                    return (<>
                        {index == 0 ? <div style={{ borderRadius: "10px 10px 0px 10px", backgroundColor: "#F7D9E1", height: "25px", width: "120px", marginBottom: "-26px", marginLeft: "320px", padding: "4px", fontSize: "12px", color: "red", zIndex: "2", paddingTop: "2px" }}>Lựa chọn tốt nhất</div> : null}
                        <div key={index} className="ticket" style={{ display: "inline-flex", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)", marginTop: "20px", borderRadius: "8px", width: "380px", height: "120px", cursor: "pointer", zIndex: "1" }} onClick={() => { setVoucher(item); setIsPopupOpen(false) }}>
                            <div className='left-section' style={{ padding: "10px", width: "140px", alignItems: "center" }}>
                                <img src='../../../public/img/vouchersx.png' alt='Vouchers' style={{ width: "60px", height: "60px", marginLeft: "30px" }} />
                                <div style={{ marginTop: "10px", fontWeight: "bold", color: "red" }}>{item.name}</div>
                            </div>
                            <div className='divider' style={{ height: "100%" }}></div>
                            <div className='right-section' style={{ padding: "10px", textAlign: "left", width: "240px", paddingLeft: "20px" }}>
                                {item.value ? <div style={{ fontWeight: "bold" }}>Giảm {fixPrice(item.value)}</div>
                                    : <>
                                        <div style={{ fontWeight: "bold" }}>Giảm {item.percentage}%</div>
                                        <div style={{ fontWeight: "bold" }}>Giảm tối đa: {fixPrice(item.max_amount)}</div>
                                    </>}
                                <div style={{ fontSize: "14px", color: "black" }}>Đơn tối thiểu: {fixPrice(item.minspent)}</div>
                                <div style={{ fontSize: "12px", color: "gray" }}>Ngày hết hạn: <span style={{ color: "red" }}>{formatToDDMMYYYY(item.endtime)}</span></div>
                            </div>
                        </div>
                    </>
                    )
                }) : <div>Không có voucher phù hợp</div>}
                {unReach && unReach.length > 0 ?
                    <>
                        <div style={{ width: "500px", height: "8px", backgroundColor: "#F3F6F8", marginLeft: "0px", marginTop: "20px" }}></div>
                        <div style={{ marginTop: "15px", textAlign: "left", paddingLeft: "10px", fontWeight: "bold" }}>Voucher không khả dụng</div>
                        {unReach.map((item, index) => {
                            return (
                                <>
                                    <div key={index} className="ticket" style={{ display: "inline-flex", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)", marginTop: "20px", borderRadius: "8px 8px 0px 0px", width: "380px", height: "120px", cursor: "pointer", zIndex: "1" }}>
                                        <div className='left-section' style={{ padding: "10px", width: "140px", alignItems: "center" }}>
                                            <img src='../../../public/img/vouchersx.png' alt='Vouchers' style={{ width: "60px", height: "60px", marginLeft: "30px" }} />
                                            <div style={{ marginTop: "10px", fontWeight: "bold", color: "red" }}>{item.name}</div>
                                        </div>
                                        <div className='divider' style={{ height: "100%" }}></div>
                                        <div className='right-section' style={{ padding: "10px", textAlign: "left", width: "240px", paddingLeft: "20px" }}>
                                            {item.value ? <div style={{ fontWeight: "bold" }}>Giảm {fixPrice(item.value)}</div>
                                                : <>
                                                    <div style={{ fontWeight: "bold" }}>Giảm {item.percentage}%</div>
                                                    <div style={{ fontWeight: "bold" }}>Giảm tối đa: {fixPrice(item.max_amount)}</div>
                                                </>}
                                            <div style={{ fontSize: "14px", color: "black" }}>Đơn tối thiểu: {fixPrice(item.minspent)}</div>
                                            <div style={{ fontSize: "12px", color: "gray" }}>Ngày hết hạn: <span style={{ color: "red" }}>{formatToDDMMYYYY(item.endtime)}</span></div>
                                        </div>
                                    </div>
                                    <div style={{ width: "380px", border: "1px solid gray", borderRadius: "0px 0px 8px 8px", backgroundColor: "#F3F6F8", marginLeft: "60px", fontSize: "12px", padding: "2px", color: "gray", textAlign: "left", paddingLeft: "10px" }}>Chưa đạt giá trị đơn hàng tối thiểu</div>
                                </>
                            )
                        })}
                    </> : null}
                {unApplied ? unApplied.map((item, index) => {
                    return (
                        <>
                            <div key={index} className="ticket" style={{ display: "inline-flex", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)", marginTop: "20px", borderRadius: "8px 8px 0px 0px", width: "380px", height: "120px", cursor: "pointer", zIndex: "1" }}>
                                <div className='left-section' style={{ padding: "10px", width: "140px", alignItems: "center" }}>
                                    <img src='../../../public/img/vouchersx.png' alt='Vouchers' style={{ width: "60px", height: "60px", marginLeft: "30px" }} />
                                    <div style={{ marginTop: "10px", fontWeight: "bold", color: "red" }}>{item.name}</div>
                                </div>
                                <div className='divider' style={{ height: "100%" }}></div>
                                <div className='right-section' style={{ padding: "10px", textAlign: "left", width: "240px", paddingLeft: "20px" }}>
                                    {item.value ? <div style={{ fontWeight: "bold" }}>Giảm {fixPrice(item.value)}</div>
                                        : <>
                                            <div style={{ fontWeight: "bold" }}>Giảm {item.percentage}%</div>
                                            <div style={{ fontWeight: "bold" }}>Giảm tối đa: {fixPrice(item.max_amount)}</div>
                                        </>}
                                    <div style={{ fontSize: "14px", color: "black" }}>Đơn tối thiểu: {fixPrice(item.minspent)}</div>
                                    <div style={{ fontSize: "12px", color: "gray" }}>Ngày hết hạn: <span style={{ color: "red" }}>{formatToDDMMYYYY(item.endtime)}</span></div>
                                </div>
                            </div>
                            <div style={{ width: "380px", border: "1px solid gray", borderRadius: "0px 0px 8px 8px", backgroundColor: "#F3F6F8", marginLeft: "60px", fontSize: "12px", padding: "2px", color: "gray", textAlign: "left", paddingLeft: "10px" }}>Voucher không áp dụng cho sản phẩm này</div>
                        </>
                    )
                }) : null}
            </div>
        </div>
    )
}

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();

    const productList = location.state.list || [location.state.product];
    const [userData, setUserData] = useState(null);
    const [discount, setDiscount] = useState(location.state.discount || 0)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const ruser = await axios.get(`http://localhost:8000/api/user/get-detail/${localStorage.getItem('uid')}`)
                //console.log("Outlet: ",localStorage.getItem('uid'))
                if (ruser.data.status !== 200) {
                    alert("Lỗi 500")
                    throw new Error("Lỗi")
                }
                setUserData(ruser.data.data)
            }
            catch (err) {
                console.error("Error Message: ", err.message)
            }
        }
        fetchUser()
    }, [])
    const [defAdress, setAddress] = useState([])
    useEffect(() => {
        const fetchAdress = async () => {
            let adress = [];
            const res = await axios.get(`http://localhost:8000/api/user/GetAll/${localStorage.getItem('uid')}`)
            //console.log(res)
            if (res.status != 200) throw new Error("Error while fetching address")
            adress = res.data.data ? res.data.data : []
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
            rphone = res.data.data ? res.data.data : []
            setPhone(rphone && rphone.length > 0 ? rphone.map(item => item.phone) : []); // Update images state once all images are fetched
        };

        fetchPhone();
    }, [userData]);

    const [holdPhone, setP] = useState("")
    const [holdAddress, setA] = useState("")

    useEffect(() => {
        setA(defAdress && defAdress.length > 0 ? defAdress.find(i => i.isdefault === true).address : "")
    }, [defAdress])

    useEffect(() => {
        setP(Pnumber && Pnumber.length > 0 ? Pnumber[0] : "")
    }, [Pnumber])

    const [paymentMethod, setPaymentMethod] = useState("");

    const handleOrder = async () => {
        try {
            let shortLink = null; // Biến lưu shortLink nếu dùng QR

            // Tiếp tục xử lý tạo đơn hàng
            const Torder = [...productList].map((item) => ({
                product_id: item.product_id,
                quantity: location.state.voucher?item.pquantity: location.state.quantity,
                subtotal: item.pquantity?item.pquantity * item.price:location.state.product.price * location.state.quantity,
            }));

            console.log("Make order: ", {
                orderItems: Torder,
                status: "Pending",
                shipping_address: holdAddress,
                shipping_fee: 0,
                shipping_co: "Grab",
                quantity: productList.reduce((sum, i) => sum + i.pquantity, 0),
                total_price: location.state.total,
            });

            const addOrder = await axios.post(`http://localhost:8000/api/order/CreateOrder/${localStorage.getItem("uid")}`, {
                orderItems: Torder,
                status: "Pending",
                shipping_address: holdAddress,
                shipping_fee: 0,
                shipping_co: "Grab",
                quantity: location.state.voucher?productList.reduce((sum, i) => sum + i.pquantity, 0):location.state.quantity,
                total_price: location.state.total?location.state.total:location.state.product.price * location.state.quantity,
                promotion_id: voucher && voucher.promotion_id ? voucher.promotion_id : null,
            });

            console.log(addOrder.data, addOrder.data)
            if (paymentMethod === "qr") {
                const data = {
                    oid: addOrder.data.data.oid,
                    final_price: addOrder.data.data.final_price,
                    description: "Thanh toán đơn hàng",
                };
                // Gọi API mã QR momo
                const response = await axios.post("http://localhost:8000/api/payment/config", data);
                console.log("Payment config:", response.data);
                if (response.status === 200) {
                    console.log("Payment config:", response.data);

                    // Lưu shortLink từ phản hồi
                    shortLink = response.data.shortLink;
                    if (!shortLink) {
                        alert("Không tìm thấy shortLink trong phản hồi từ API!");
                        return; // Dừng lại nếu không có shortLink
                    }

                    alert("Thông tin thanh toán được lấy thành công!");
                } else {
                    console.error("Error fetching payment config: ", response.statusText);
                    alert("Không thể lấy thông tin thanh toán");
                    return; // Dừng lại nếu gọi API thất bại
                }
            }
            if (addOrder.data.status !== 200) {
                alert("Đặt hàng thất bại");
                throw new Error("Failure");
            } else {
                alert("Đặt hàng thành công");
                if (shortLink) {
                    // Chuyển hướng đến shortLink sau khi tạo đơn hàng
                    window.location.href = shortLink;
                } else {
                    // Chuyển đến lịch sử nếu không dùng mã QR
                    navigate("/user/info/history-log");
                }
            }
        }

        catch (err) {
            console.error("Log Error: ", err.message)
        }
    }
    const [isPopupOpen, setIsPopup] = useState(false);
    const openPopup = () => {
        setIsPopup(true);
        console.log(productList)
    };

    const closePopup = () => {
        setIsPopup(false);
    };

    const [isPopupPhone, setIsPopupPhone] = useState(false);
    const openPopupPhone = () => {
        setIsPopupPhone(true);
    };

    const closePopupPhone = () => {
        setIsPopupPhone(false);
    };

    const [isPopupAd, setIsPopupAd] = useState(false);
    const openPopupAd = () => {
        setIsPopupAd(true);
    };

    const closePopupAd = () => {
        setIsPopupAd(false);
    };
    const [voucher, setVoucher] = useState(location.state.voucher || {promotion_id: null});
    useEffect(() => {
        if (!location.state.voucher) return;
        switch (voucher.apply_range) {
            case 'all':
                setDiscount(voucher.value ? voucher.value : Math.min(voucher.percentage * location.state.total, voucher.max_amount))
                break;
            case 'category':
                let tempArr = [...buyList].filter(item => item.cate_id == voucher.apply_id)
                let tempSum = tempArr.reduce((acc, item) => acc + (item.price * item.pquantity), 0);
                setDiscount(voucher.value ? voucher.value : Math.min(voucher.percentage * tempSum, voucher.max_amount))
                break;
            case 'product':
                let tempArr2 = [...buyList].filter(item => item.product_id == voucher.apply_id)
                let tempSum2 = tempArr2.reduce((acc, item) => acc + (item.price * item.pquantity), 0);
                setDiscount(voucher.value ? voucher.value : Math.min(voucher.percentage * tempSum, voucher.max_amount))
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
                        <div className="popupContent" onClick={(e) => e.stopPropagation()} style={{ width: "500px", height: "600px" }}>
                            <h2 style={{ fontWeight: "bold", color: "red", fontSize: "20px", backgroundColor: "#F3F6F8", width: "500px", marginLeft: "-20px", height: "50px", marginTop: "-20px", paddingTop: "10px", borderRadius: "8px 8px 0px 0px", boxShadow: "0 5px 10px 0 rgba(0, 0, 0, 0.3)" }}>Chọn Voucher</h2>
                            <Voucher buyList={productList} setVoucher={setVoucher} setIsPopupOpen={setIsPopup} total={location.state.total || location.state.product.price * location.state.quantity} pquantity={location.state?(location.state.quantity?location.state.quantity:null):null} pprice ={location.state.product?location.state.product.price:null}/>
                            <button className="closePopup" onClick={closePopup} style={{ marginTop: "-30px" }}>
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
                {isPopupPhone && (
                    <div className="popup" onClick={closePopupPhone}>
                        <div className="popupContent" onClick={(e) => e.stopPropagation()} style={{ width: "500px", height: "400px" }}>
                            <h2 style={{ fontWeight: "bold", color: "red", fontSize: "20px", backgroundColor: "#F3F6F8", width: "500px", marginLeft: "-20px", height: "50px", marginTop: "-20px", paddingTop: "10px", borderRadius: "8px 8px 0px 0px", boxShadow: "0 5px 10px 0 rgba(0, 0, 0, 0.3)" }}>Chọn Số điện thoại</h2>
                            <UpdatePhone currentUser={userData} closePopupPhone={closePopupPhone} setCurPhone={setP} />
                        </div>
                    </div>
                )}
                {isPopupAd && (
                    <div className="popup" onClick={closePopupAd}>
                        <div className="popupContent" onClick={(e) => e.stopPropagation()} style={{ width: "1100px", height: "600px" }}>
                            <h2 style={{ fontWeight: "bold", color: "red", fontSize: "20px", backgroundColor: "#F3F6F8", width: "1100px", marginLeft: "-20px", height: "50px", marginTop: "-20px", paddingTop: "10px", borderRadius: "8px 8px 0px 0px", boxShadow: "0 5px 10px 0 rgba(0, 0, 0, 0.3)" }}>Chọn Voucher</h2>
                            <UpdateAdress currentUser = {userData} closePopupAd={closePopupAd} setCurAddress={setA}/>
                        </div>
                    </div>
                )}
                <div className="w-11/12 m-auto" style={{ marginTop: "90px" }}>
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
                                            value={userData.lname + " " + userData.fname}
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
                                        style={{ width: "190px" }}
                                        value={holdPhone}
                                        onChange={(e) => setP(e.target.value)}
                                    />
                                    <span className={`bg-blue-50 hover:bg-blue-100`} style={{ cursor: "pointer", padding: "9px" }} onClick={openPopupPhone}>&#128221;</span>
                                </div>

                                <div className="mb-4">
                                    <div>Địa chỉ</div>
                                    <input
                                        type="address"
                                        id="address"
                                        name="address"
                                        className={`mt-1 p-2 w-4/5 bg-blue-50 hover:bg-blue-100 `}
                                        style={{ width: "190px" }}
                                        value={holdAddress}
                                        onChange={(e) => setA(e.target.value)}
                                    />
                                    <span className={`bg-blue-50 hover:bg-blue-100`} style={{ cursor: "pointer", padding: "9px" }} onClick={openPopupAd}>&#128221;</span>
                                </div>

                                {/* <div className="mb-4">
                                    <div>Thêm ghi chú</div>
                                    <input
                                        type="note"
                                        id="note"
                                        name="note"
                                        className={`mt-1 p-2 w-4/5 bg-blue-50 hover:bg-blue-100 `}
                                        value={"sdfasdfadsfa"}
                                    //   onChange={(e) => setPass(e.target.value)}
                                    />
                                </div> */}


                            </div>
                        </div>
                        <div className="col-2  w-1/2">
                            <div className="products w-8/12 space-y-4 m-auto">
                                {productList && productList.length > 0 && productList.map((product, index) =>

                                (<div className="flex flex-row items-center mr-20">
                                    <div className=" w-2/5 flex items-center space-x-2">
                                        <span>
                                            <img src={product.image[0]} alt="" width={"100px"} />
                                        </span>
                                        <span>{product.pname}</span>
                                    </div>
                                    {/* <div className=" w-2/5 text-right ">{prodPrice}</div> */}
                                    <div className=" w-1/5 text-right mr-20">x {product.pquantity || location.state.quantity}</div>
                                    <div className=" w-2/5 text-right ">{fixPrice(product.pquantity?(product.pquantity * product.price):(location.state.product.price * location.state.quantity))}</div>
                                </div>)
                                )}
                                <div className="flex justify-between mr-20">
                                    <div>Thành tiền</div>
                                    <div>{fixPrice(location.state.total || location.state.product.price * location.state.quantity)}</div>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>
                                <div className="flex justify-between mr-20">
                                    <div>Phí vận chuyển</div>
                                    <div>Free</div>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>
                                <div className="flex justify-between mr-20">
                                    <div>Giảm giá</div>
                                    <div>{fixPrice(discount || 0)}</div>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>
                                <div className="promotion flex justify-between mr-20">
                                    <input type="text" placeholder="Nhập mã giảm giá" className="border border-black rounded-md p-2 w-3/5" value={voucher.promotion_id || ""} onChange={(e) => setVoucher({ ...voucher, promotion_id: e.target.value })} />
                                    <button className="bg-red-600 text-white p-2 rounded-md" onClick={openPopup}>Áp dụng</button>
                                </div>
                                <div className="border-b border-gray-600 mr-20"></div>
                                <div className="flex justify-between mr-20">
                                    <div className="font-semibold">Tổng tiền</div>
                                    <div>{fixPrice(location.state.total?(location.state.total - discount):(location.state.product.price * location.state.quantity))}</div>
                                </div>

                                <div className="payment-method">
                                    <label htmlFor="method" className="font-bold">Chọn phương thức thanh toán: </label>
                                    <div className="p-2 ml-2">
                                        <div className="space-x-2">
                                            <input type="radio" value="cash" name="payment" className="" onChange={(e) => setPaymentMethod(e.target.value)} />
                                            <span>Trả tiền khi nhận hàng</span>
                                        </div>
                                        <div className="space-x-2">
                                            <input type="radio" value="qr" name="payment" className="" onChange={(e) => setPaymentMethod(e.target.value)} />
                                            <span>Mã QR momo</span>
                                        </div>

                                    </div>
                                </div>

                                <div className="flex justify-center items-center">
                                    <div className="bg-red-600 text-white font-bold p-2 rounded-md" onClick={handleOrder} style={{ cursor: "pointer" }}>Đặt hàng</div>
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