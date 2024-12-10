import axios from "axios";
import { useEffect, useState } from "react";
import bcrypt from 'bcryptjs'
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TextField, Button, Box, Container, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ThemeProvider, createTheme } from "@mui/material/styles";
//const bcrypt = require('bcryptjs');

const theme = createTheme({
    palette: {
      primary: {
        main: "#4caf50", // Màu chính (xanh lá)
      },
      secondary: {
        main: "#ff5722", // Màu phụ (cam)
      },
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
  });
  
function History({state}){
    const [count, setCnt] = useState(0)
    const [totalPaid, setPaid] = useState(0)
    const [orderList, setList] = useState([])
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hook, setHook] = useState(0)
    useEffect(()=>{
        const fetchOrder = async()=>{
            const temp = await axios.get(`http://localhost:8000/api/order/getAllOrder/${state.currentUser.uid}?limit=1000`)
            if (!temp.ok){
                throw new Error("Lỗi khi lấy dữ liệu")
            }
            setList(temp.data.data?temp.data.data:[])
        }
        fetchOrder()
    },[state.currentUser])
    useEffect(()=>{
        setCnt(orderList.length)
    },[orderList])
    return(
        <div className="profile-form">
            <h2>Lịch sử mua hàng của khách hàng {state.currentUser.lname}</h2>
            <div className="overall" style={{backgroundColor: "white", padding: "10px", display: "inline-flex", width: "940px"}}>
                <div style={{textAlign: "center"}}>
                    <div style={{fontSize: "30px", fontWeight: "bold"}}>{count}</div>
                    <div>Đơn hàng</div>
                </div>
                <div style={{backgroundColor: "black", width:"2px"}}></div>
                <div style={{textAlign: "center"}}>
                    <div style={{fontSize: "30px", fontWeight: "bold"}}>{totalPaid}</div>
                    <div>Tổng chi tiêu</div>
                </div>
            </div>
            <div style={{display: "inline-flex", gap: "40px", marginTop: "20px", height: "60px"}}>
            <FormControl fullWidth sx={{ marginBottom: 2 , height: "40px"}}>
                <TextField
                    type="date"
                    label="Từ ngày"
                    variant="outlined"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                </FormControl>

                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <TextField
                    type="date"
                    label="Đến ngày"
                    variant="outlined"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                </FormControl>
            </div>
            <div style={{width: "100%", gap:"20px", display:"inline-flex"}}>
                <div className={`history-hook ${hook == 0?"hooked":""}`} onClick={()=>setHook(0)}>Tất cả</div>
                <div className={`history-hook ${hook == 1?"hooked":""}`} onClick={()=>setHook(1)}>Chờ xác nhận</div>
                <div className={`history-hook ${hook == 2?"hooked":""}`} onClick={()=>setHook(2)}>Đã xác nhận</div>
                <div className={`history-hook ${hook == 3?"hooked":""}`} onClick={()=>setHook(3)}>Đang vận chuyển</div>
                <div className={`history-hook ${hook == 4?"hooked":""}`} onClick={()=>setHook(4)}>Đã giao hàng</div>
                <div className={`history-hook ${hook == 5?"hooked":""}`} onClick={()=>setHook(5)}>Đã hủy</div>
            </div>
            <table className="address-table">
                <thead>
                    <th>STT</th>
                    <th>Mã đơn hàng</th>
                </thead>
            </table>
        </div>
    )
}

function Ranking({state}){
    return(
        <div className="profile-form">Hạng của khách hàng {state.currentUser.lname} là: {state.currentUser.ranking}</div>
    )
}

function UpdatePassword({active,setActive, state}){
    const [pass, setPass] = useState({
        old_pass: "",
        new_pass: "",
        confirm_pass: ""
    })
    
    const handleSubmit = async() => {
        //alert(phone)
        if (!bcrypt.compare(pass.old_pass, state.currentUser.upassword)){
            alert('Mật khẩu hiện tại không đúng. Khac hàng vui lòng nhập lại')
        }
        else if(pass.new_pass.length < 5){
            alert('Vui lòng nhập mật khẩu có từ 5 kí tự')
        }
        else if (pass.new_pass != pass.confirm_pass){
            alert('Mật khẩu mới không trùng khớp')
        }
        else{
            const hashPw = await bcrypt.hash(pass.new_pass, 12);
            const addPhone = await axios.put(`http://localhost:8000/api/user/update-user/${state.currentUser.uid}`,{upassword: hashPw})
            if (addPhone.status != 200){
                alert('Thay đổi mật khẩu thất bại')
            }
            else{
                alert('Thay đổi mật khẩu thành công')
                setPass({
                    old_pass: "",
                    new_pass: "",
                    confirm_pass: ""
                })
            }
        }
    }
    return (
        <div className="profile-form">
            <h2><span style={{color: "gray",fontWeight: "bold", cursor: "pointer"}} onClick={()=>setActive(1)}>&#8592;</span> Thay đổi mật khẩu</h2>
            <div className="form-group">
                <input type="password" className="full-width" placeholder="Mật khẩu hiện tại" value={pass.old_pass} onChange={(e) => setPass((prev) => ({...prev, old_pass: e.target.value}))}/>
            </div>
            <div className="form-group">
                <input type="password" className="full-width" placeholder="Mật khẩu mới" value={pass.new_pass} onChange={(e) => setPass((prev) => ({...prev, new_pass: e.target.value}))}/>
            </div>
            <div className="form-group">
                <input type="password" className="full-width" placeholder="Nhập lại mật khẩu mới"value={pass.confirm_pass} onChange={(e) => setPass((prev) => ({...prev, confirm_pass: e.target.value}))}/>
            </div>        
            <div className="form-actions">
                <button className="btn-cancel">Hủy</button>
                <button className="btn-save" onClick={handleSubmit}>Thay đổi mật khẩu</button>
            </div>    
        </div>
    )
}

function UpdatePhone({active,state,setActive}){
    const [phone, setVal] = useState("")
    const [Pnumber, setPhone] = useState([])
    const [toggle, setToggle] = useState(1)
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
    }, [state.currentUser, toggle]);

    const handleSubmit = async() => {
        //alert(phone)
        if(!phone || phone == ""){
            alert('Vui lòng nhập đầy đủ thông tin')
        }
        else{
            const addPhone = await axios.post(`http://localhost:8000/api/user/CreatePhone/${state.currentUser.uid}`,{phone: [phone]})
            if (addPhone.status != 200){
                alert('Thêm số điện thoại thất bại')
            }
            else{
                alert('Thêm số điện thoại thành công')
                setVal("")
                setToggle(!toggle)
            }
        }
    }

    const handleRemove = async(index) => {
        if(!Pnumber[index] || Pnumber[index] == ""){
            alert('Vui lòng nhập đầy đủ thông tin')
        }
        else{
            const addPhone = await axios.post(`http://localhost:8000/api/user/DeletePhone/${state.currentUser.uid}`,{phone: Pnumber[index]})
            if (addPhone.status != 200){
                alert('Xóa số điện thoại thất bại')
            }
            else{
                alert('Xóa số điện thoại thành công')
                setToggle(!toggle)
            }
        }
    }
    return(
        <div className="profile-form">
                <h2><span style={{color: "gray",fontWeight: "bold", cursor: "pointer"}} onClick={()=>setActive(1)}>&#8592;</span> Thông tin địa chỉ</h2>
                <table className="address-table">
                    <thead>
                        <th>STT</th>
                        <th>Số điện thoại</th>
                        <th style={{width: "40px"}}>Chỉnh sửa</th>
                    </thead>
                    <tbody>
                        {Pnumber&& Pnumber.length>0?
                        Pnumber.map((p, index)=>{
                            //console.log(Pnumber)
                            return(
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{p}</td>
                                    <td style={{display: "inline-flex", width: "60px"}}><button onClick={() => handleRemove(index)} style={{color: "white",backgroundColor: "red"}}>Xóa</button></td> {/* Close button */}
                                </tr>
                            )
                            
                        }):null}
                    </tbody>
                </table>
                {!Pnumber || Pnumber.length <= 0?<div style={{marginBottom: "10px", marginTop: "-14px"}}>Khách hàng hiện chưa cập nhật số điện thoại</div>:null}
                <div className="form-group">
                    <div className="full-width">
                        <label htmlFor="phone">Nhập số điện thoại</label>
                        <input type="text" id="phone" value={phone} onChange={(e) => setVal(e.target.value)}/>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button className="btn-cancel">Hủy</button>
                    <button className="btn-save" onClick={handleSubmit}>Thêm số điện thoại</button>
                </div>
            </div>
    )
}

function UpdateAdress({active,state,setActive}){
    const [address, setVal] = useState({
        province: "",
        city: "",
        district: "",
        street: "",
        isdefault: false
    })
    const [toggle, setToggle] = useState(1)
    const [defAdress, setAddress] = useState([])
    useEffect(() => {
        const fetchAdress = async () => {
            console.log(state.currentUser.uid)
            let adress = [];
            const res = await axios.get(`http://localhost:8000/api/user/GetAll/${state.currentUser.uid}`)
            //console.log(res)
            if (res.status != 200) throw new Error("Error while fetching address")
            adress = res.data.data?res.data.data: []
            setAddress(adress); // Update images state once all images are fetched
        };

        fetchAdress();
        console.log(defAdress)
    }, [state.currentUser, toggle]);
    const sample = ['57 A Street C, District 1, City DN','58 A Street D, District 3, City HN','98 A Street C, District 3, City HN']
    const [partitionedAddresses, setPar] = useState(defAdress.map((addr) => {
        const parts = addr.address.split(',').map((item) => item.trim());
        return {
          street: parts[0] || "", // Nếu thiếu thì trả về chuỗi rỗng
          district: parts[1] || "",
          city: parts[2] || "",
          province: parts[3] || "",
        };
      }));
    const [prevState, setPrev] = useState(partitionedAddresses)
    useEffect(()=>{
        setPar(defAdress.map((addr) => {
            const parts = addr.address.split(',').map((item) => item.trim());
            return {
              street: parts[0] || "", // Nếu thiếu thì trả về chuỗi rỗng
              district: parts[1] || "",
              city: parts[2] || "",
              province: parts[3] || "",
              isdefault: addr.isdefault || false
            };
          }))
          
    },[defAdress])
    // useEffect(()=>{
    //     setPrev([...partitionedAddresses])
    // },[defAdress])
    const handleSubmit = async() =>{
        //alert(address.isdefault)
        let resAddress = address.street + ", " + address.district + ", " + address.city +", " +address.province
        if (address.province == "" || address.street == "" || address.city == "" || address.district == "" || !address.province || !address.street || !address.city || !address.district){
            alert('Vui lòng nhập đầy đủ thông tin')
        }
        else if (defAdress.map(item => item.address).includes(resAddress)){
            alert('Địa chỉ đã tồn tại')
            setToggle(!toggle)
                setVal({
                    province: "",
                    city: "",
                    district: "",
                    street: "",
                    isdefault: false
                })
        }
        else{
            const addAddress = await axios.post(`http://localhost:8000/api/user/CreateAddress/${state.currentUser.uid}`,
                {
                    address: resAddress,
                    isdefault: address.isdefault
                }
            )
            console.log(addAddress)
            if(addAddress.status !== 200){
                alert(addAddress.msg || "Thêm địa chỉ thất bại")
            }
            else{
                setToggle(!toggle)
                alert('Thêm địa chỉ thành công')
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
    }

    const handleUpdate = async(index) => {
        console.log(partitionedAddresses[index])
        // console.warn(prevState[index])
        if (partitionedAddresses[index].province == "" || partitionedAddresses[index].street == "" || partitionedAddresses[index].city == "" || partitionedAddresses[index].district == ""){
            alert('Vui lòng nhập đầy đủ thông tin')
        }
        else{
            const updateAddress = await axios.put(`http://localhost:8000/api/user/UpdateAddress/${state.currentUser.uid}`,
                {
                    old_address: defAdress[index].address,
                    new_address: partitionedAddresses[index].street + ", " + partitionedAddresses[index].district + ", " + partitionedAddresses[index].city +", " + partitionedAddresses[index].province,
                    isdefault: partitionedAddresses[index].isdefault
                }
            )
            if(updateAddress.status !== 200){
                alert(updateAddress.msg || "Thêm địa chỉ thất bại")
            }
            else{
                setToggle(!toggle)
                alert('Cập nhật địa chỉ thành công')
                //defAdress.push(item.street + ", " + item.district + ", " + item.city +", " +item.province)
            }
        }
    }

    const handleRemove = async(index) =>{
        console.log(defAdress[index].address)
        const item = partitionedAddresses[index]
        if (!defAdress[index].address){
            alert('Vui lòng nhập đầy đủ thông tin')
        }
        else{
            const updateAddress = await axios.post(`http://localhost:8000/api/user/DeleteAddress/${state.currentUser.uid}`,
                {
                    address: defAdress[index].address
                }
            )
            if(updateAddress.status !== 200){
                alert(updateAddress.msg || "Xóa địa chỉ thất bại")
            }
            else{
                // if (defAdress && defAdress.length > 1 && defAdress[index].isdefault){
                //     let temp = defAdress.map(adrr => adrr.address)
                //     temp = temp.filter(item => item != defAdress[index].address)
                //     const resAddress = await axios.put(`http://localhost:8000/api/user/UpdateAddress/${state.currentUser.uid}`,
                //         {
                //             old_address: temp[0],
                //             new_address: temp[0],
                //             isdefault: true
                //         }
                //     )
                // }
                setToggle(!toggle)
                //defAdress.push(item.street + ", " + item.district + ", " + item.city +", " +item.province)
            }
        }
    }
    return(
        <>
        
        <div className="profile-form">
                <h2><span style={{color: "gray",fontWeight: "bold", cursor: "pointer"}} onClick={()=>setActive(1)}>&#8592;</span> Thông tin địa chỉ</h2>
                <table className="address-table">
                    <thead>
                        <tr>
                        <th>STT</th>
                        <th>Số nhà</th>
                        <th>Phường/Xã</th>
                        <th>Quận/Huyện</th>
                        <th>Tỉnh/Thành phố</th>
                        <th>Mặc định</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        partitionedAddresses && partitionedAddresses.length > 0 ? partitionedAddresses.map((item, index) => {
                            return (
                            <tr key={index}>
                                <td>{index + 1}</td> {/* Display the index + 1 for STT */}
                                <td><input type="text" id={`province${index}`} value={item.street} onChange={(e)=> {
                                    const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                    tempArr[index] = {
                                      ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                      street: e.target.value, // Cập nhật trường `street`
                                    };
                                    setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                }}/></td>
                                <td><input type="text" id={`province${index}`} value={item.district} onChange={(e)=> {
                                    const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                    tempArr[index] = {
                                      ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                      district: e.target.value, // Cập nhật trường `street`
                                    };
                                    setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                }}/></td>
                                <td><input type="text" id={`province${index}`} value={item.city}onChange={(e)=> {
                                    const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                    tempArr[index] = {
                                      ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                      city: e.target.value, // Cập nhật trường `street`
                                    };
                                    setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                }}/></td>
                                <td><input type="text" id={`province${index}`} value={item.province}onChange={(e)=> {
                                    const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                    tempArr[index] = {
                                      ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                      province: e.target.value, // Cập nhật trường `street`
                                    };
                                    setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                }}/></td>
                                <td><input type="checkbox" name="subscribe" checked={item.isdefault}onChange={(e)=> {
                                    const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                    tempArr[index] = {
                                      ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                      isdefault: e.target.checked, // Cập nhật trường `street`
                                    };
                                    setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                }}/></td>
                                <td style={{display: "inline-flex"}}><button style={{width: "75px", backgroundColor: "greenyellow", color: "gray"}} onClick={()=> handleUpdate(index)}>Cập nhật</button><button onClick={() => handleRemove(index)} style={{color: "white",backgroundColor: "red"}}>Xóa</button></td> {/* Close button */}
                            </tr>
                            )
                        }) : <span style={{paddingTop: "5px", textAlign: "center"}}>Người dùng không có thông tin địa chỉ</span>
                        }
                    </tbody>
                </table>
                <div className="form-group">
                    <div className="full-width">
                        <label htmlFor="province">Nhập Tỉnh/thành phố</label>
                        <input type="text" id="province" value={address.province} onChange={(e) => setVal((prev)=>({...prev,province:e.target.value}))}/>
                    </div>
                    <div className="full-width">
                        <label htmlFor="city">Nhập Quận/Huyện</label>
                        <input type="text" id="city" value={address.city}  onChange={(e) => setVal((prev)=>({...prev,city:e.target.value}))}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="full-width">
                        <label htmlFor="district">Nhập Phường/Xã</label>
                        <input type="text" id="district" value={address.district}  onChange={(e) => setVal((prev)=>({...prev,district:e.target.value}))}/>
                    </div>
                    <div className="full-width">
                        <label htmlFor="street">Nhập số nhà/tên đường</label>
                        <input type="text" id="street" value={address.street}  onChange={(e) => setVal((prev)=>({...prev,street:e.target.value}))}/>
                    </div>
                </div> 
                <label>
                    <input type="checkbox" name="subscribe" checked={address.isdefault} onChange={(e) => setVal((prev)=>({...prev,isdefault:e.target.checked}))}/>
                     Địa chỉ mặc định
                </label>
                <div className="form-actions">
                    <button className="btn-cancel">Hủy</button>
                    <button className="btn-save" onClick={handleSubmit}>Lưu thay đổi</button>
                </div>
            </div>
            </>
    )
}

function UpdateData({state, active, setActive}){
    const [magnet, setMag] =useState(1)
    const [defPhone, setPhone] = useState("")
    const [user, setUser] = useState({
        fname: state.currentUser.fname,
        lname: state.currentUser.lname,
        username: state.currentUser.username,
        email: state.currentUser.email
    })
    const [defAdress, setAddress] = useState("")
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
    const handleUpdate = async() =>{
        try{
            const { fname, lname, email, username } = user;  // Object destructuring for clarity
        const { uid } = state.currentUser;  // Destructure currentUser to get uid
            const response = await axios.put(`http://localhost:8000/api/user/update-user/${uid}`,{
                fname,
                lname,
                username,
                email
            })
            if (response.status != 200) throw new Error("Update fail!")
            
            alert('Cập nhật thông tin thành công')
        }
        catch(e){
            throw new Error(e)
        } 
    }
        return(
            <div className="profile-form">
                    <h2>Chỉnh sửa hồ sơ</h2>
                    <div className="form-group">
                        <div className="full-width">
                            <label htmlFor="firstName">Tên</label>
                            <input type="text" id="firstName" value={user.lname} onChange={(e) => setUser((prev)=>({...prev,lname:e.target.value}))}/>
                        </div>
                        <div className="full-width">
                            <label htmlFor="lastName">Họ và tên lót</label>
                            <input type="text" id="lastName" value={user.fname}  onChange={(e) => setUser((prev)=>({...prev,fname:e.target.value}))}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="full-width">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" value={user.username}  onChange={(e) => setUser((prev)=>({...prev,username:e.target.value}))}/>
                        </div>
                        <div className="full-width">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" value={user.email}  onChange={(e) => setUser((prev)=>({...prev,email:e.target.value}))}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="full-width">
                            <label htmlFor="adress">Địa chỉ</label>
                            <div className="item-item">
                                <div>{defAdress!=""?defAdress:"Chưa có địa chỉ mặc định"}</div>
                                <button id="address" onClick={()=>setActive(5)}>Chỉnh sửa</button>
                            </div>
                        </div>
                        <div className="full-width">
                            <label htmlFor="phone">Số điện thoại</label>
                            <div className="item-item">
                                <div>{defPhone&& defPhone.length > 0?defPhone[0]:"Chưa có số điện thoại mặc định"}</div>
                                <button id="phone" onClick={() => setActive(6)}>Chỉnh sửa</button>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setActive(7)} style={{borderRadius: "8px", width: "120px", height:"40px", cursor: "pointer"}}>Đổi mật khẩu</button>
                    <div className="form-actions">
                        <button className="btn-cancel">Hủy</button>
                        <button className="btn-save" onClick={handleUpdate}>Lưu thay đổi</button>
                    </div>
                </div>
        )
}

const ControlRender = ({active,state, setActive}) =>{
    switch (active){
        case 1:
            return <UpdateData state={state} active={active} setActive={setActive}/>
        case 2:
            return <History state={state}/>
        case 3:
            return <Ranking state={state}/>
        case 5:
            return <UpdateAdress state={state} active={active} setActive={setActive}/>
        case 6:
            return <UpdatePhone state={state} active={active} setActive={setActive}/>
        case 7:
            return <UpdatePassword state={state} active={active} setActive={setActive}/>
        default:
            return <UpdateData state={state}/>
    }
}

export function UserAccountManagement({state,NavigateTo}) {
    //console.log("users: " + state.currentUser)
    const [active,setActive] = useState(1)
    const curPage = (number)=>{
        setActive(number)
    }

    return (
        <div className="acc-container">
            <div className="acc-breadcrumb">
                <a onClick={() => NavigateTo('HomePage')}>Home</a>/<a><b>Account</b></a>
            </div>
            <div className="update">
                <div className="side-bar" style={{color:"black"}}>
                    <div className={`item ${active == 1 || active == 5 || active == 6 || active == 7?"active":""}`} onClick={()=>curPage(1)}>Tài khoản của bạn</div>
                    <div className={`item ${active == 2?"active":""}`} onClick={()=>curPage(2)}>Lịch sử mua hàng</div>
                    <div className={`item ${active == 3?"active":""}`} onClick={()=>curPage(3)}>Hạng thành viên</div>
                    <div className={`item ${active == 4?"active":""}`} onClick={()=>curPage(4)}>Đăng xuất</div>
                </div>
                <ControlRender active={active} state={state} setActive={setActive}/>
            </div>
            
        </div>
    );
}

export default UserAccountManagement;