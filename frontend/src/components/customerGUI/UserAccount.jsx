import axios from "axios";
import { useEffect, useState } from "react";
import bcrypt from 'bcryptjs'
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TextField, Button, Box, Container, Typography, MenuItem, Select, InputLabel, FormControl, linkClasses } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ThemeProvider, createTheme } from "@mui/material/styles";
//const bcrypt = require('bcryptjs');

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function formatToDDMMYYYY(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

const fixPrice = (price) =>{
    const format = String(price);
    let token = " VND";
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

const PieChart = () => {
  // Dữ liệu biểu đồ
  const data = {
    labels: ['c01', 'c02', 'c03', 'c04', 'c05'],
    datasets: [
      {
        data: [50, 20, 10, 13, 7], // Tỉ lệ phần trăm
        backgroundColor: ['#1f77b4', '#aec7e8', '#2ca02c', '#ff7f0e', '#ffbb78'],
        borderWidth: 1,
      },
    ],
  };

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 8,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            let value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '250px', margin: '0 auto' }}>
      <Pie data={data} options={options} />
    </div>
  );
};
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
    const [totalQuantity, setTotal] = useState(0)
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
        setPaid(orderList.filter(item => item.status == "success").reduce((sum, current) => sum + current.final_price, 0))
        setTotal(orderList.filter(item => item.status == "success").reduce((sum, current) => sum + current.quantity, 0))
    },[orderList])
    useEffect(()=>{
        setCnt(orderList.length)
    },[orderList])
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
    return(
        <div className="profile-form">
            <div className="statistics" style={{backgroundColor: "#A0C4FF", display:"inline-flex", width:"450px",height:"180px", borderRadius:"8px"}}>
                <div style={{marginRight:"50px", width:"250px", paddingLeft: "30px", paddingTop: "30px"}}>
                    <div style={{fontFamily: "Roboto, san-serif", fontSize: "16px", fontWeight: "bold", marginBottom:"20px", color: "#F9F5F1"}}>Tổng chi tiêu</div>
                    <div style={{fontFamily: "Roboto, san-serif", fontSize: "24px", fontWeight: "bold"}}>{fixPrice(totalPaid)}</div>
                    <div style={{fontFamily: "Roboto, san-serif", fontSize: "14px", color: "#F9F5F1", marginBottom:"20px"}}>{totalQuantity} sản phẩm</div>
                    <div style={{fontFamily: "Roboto, san-serif", fontSize: "14px", color: "#F9F5F1"}}>Thẻ thành viên: {state.currentUser.ranking}</div>
                </div>
                <PieChart />
            </div>
            <div className="statistics" style={{backgroundColor: "#A0C4FF", display:"inline-flex", width:"450px",height:"180px", borderRadius:"8px", marginLeft:"40px"}}>
                <div style={{marginRight:"50px", width:"250px", paddingLeft: "30px", paddingTop: "30px"}}>
                    <div style={{fontFamily: "Roboto, san-serif", fontSize: "16px", fontWeight: "bold", marginBottom:"20px", color: "#F9F5F1"}}>Tổng chi tiêu</div>
                    <div style={{fontFamily: "Roboto, san-serif", fontSize: "24px", fontWeight: "bold"}}>{fixPrice(totalPaid)}</div>
                    <div style={{fontFamily: "Roboto, san-serif", fontSize: "14px", color: "#F9F5F1", marginBottom:"20px"}}>{totalQuantity} sản phẩm</div>
                    <div style={{fontFamily: "Roboto, san-serif", fontSize: "14px", color: "#F9F5F1"}}>Thẻ thành viên: {state.currentUser.ranking}</div>
                </div>
                <PieChart />
            </div>
            <h2>Lịch sử mua hàng của khách hàng {state.currentUser.lname}</h2>
            <div className="overall" style={{backgroundColor: "white", padding: "10px", display: "inline-flex", width: "940px"}}>
                <div style={{textAlign: "center", marginLeft: "200px", marginRight: "-200px"}}>
                    <div style={{fontSize: "30px", fontWeight: "bold"}}>{count}</div>
                    <div>Đơn hàng</div>
                </div>
                <div style={{backgroundColor: "black", width:"2px", marginLeft: "400px"}}></div>
                <div style={{textAlign: "center", marginLeft: "200px"}}>
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
            <div
                    style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 150px 200px 150px 150px",
                    backgroundColor: "#A0C4FF",
                    fontWeight: "bold",
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "8px",
                    width: "100%",
                    marginTop: "20px"
                    }}
                >
                    <div>Mã đơn hàng</div>
                    <div>Ngày mua</div>
                    <div>Tổng tiền</div>
                    <div>Tình trạng</div>
                    <div></div>
                </div>
            {orderList && orderList.length > 0 ? (
                    orderList.slice(start,end).map((item, index) => (
                    <div
                        key={index}
                        style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 150px 150px 150px 150px",
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
                        <div style={{display: "inline-flex", alignItems:"center",marginLeft:"50px", justifyItems:"center"}}>{item.name}</div>
                        <div style={{paddingTop: "10px",alignItems:"center"}}>{fixPrice(item.price)}</div>
                        <div style={{display: "inline-flex", width: "40px", marginLeft: "30px", border: "2px solid #696969", borderRadius: "6px", paddingLeft:"5px", paddingTop: "3px"}}>
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
                        <div style={{paddingTop: "10px"}}>{fixPrice(item.price * item.pquantity)}</div>
                        <div style={{paddingTop: "0px"}}>
                        {/* Lựa chọn button */}
                        <button style={{ padding: "5px 10px" }} onClick={()=> handleDelete(item.product_id)}>Xóa</button>

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
                    <button className="btn-save" onClick={handleSubmit}>Thêm địa chỉ</button>
                </div>
            </div>
            </>
    )
}

function UpdateData({state, active, setActive}){
    const [magnet, setMag] =useState(1)
    const [user, setUser] = useState({
        fname: state.currentUser.fname,
        lname: state.currentUser.lname,
        username: state.currentUser.username,
        email: state.currentUser.email
    })
    const [defPhone, setPhone] = useState("")
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
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email)){
                alert('Định dạng email không hợp lệ vui lòng nhập lại')
                return;
            }
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