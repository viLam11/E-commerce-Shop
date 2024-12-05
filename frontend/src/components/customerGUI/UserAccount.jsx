import axios from "axios";
import { useEffect, useState } from "react";

function History({state}){
    return(
        <div>Lịch sử mua hàng của khách hàng {state.currentUser.lname}</div>
    )
}

function Ranking({state}){
    return(
        <div>Hạng của khách hàng {state.currentUser.lname} là: {state.currentUser.ranking}</div>
    )
}

function UpdatePhone({active,state,setActive}){
    const [phone, setVal] = useState("")
    return(
        <div className="profile-form">
                <h2><span style={{color: "gray",fontWeight: "bold", cursor: "pointer"}} onClick={()=>setActive(1)}>&#8592;</span> Thông tin địa chỉ</h2>
                <div className="form-group">
                    <div className="full-width">
                        <label htmlFor="phone">Nhập số điện thoại</label>
                        <input type="text" id="phone" value={phone} onChange={(e) => setVal(e.target.value)}/>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button className="btn-cancel">Hủy</button>
                    <button className="btn-save" >Lưu thay đổi</button>
                </div>
            </div>
    )
}

function UpdateAdress({active,state,setActive}){
    const [address, setVal] = useState({
        province: "",
        city: "",
        ward: "",
        street: "",
        isdefault: false
    })
    const [defAdress, setAddress] = useState([])
    useEffect(() => {
        const fetchAdress = async () => {
            let adress = [];
            const res = await fetch(`http://localhost:8000/api/user/GetAll/${state.currentUser.uid}`)
            if (!res.ok) throw new Error("Error while fetching address")
            adress = res.data?res.data.address: []
            setAddress(adress); // Update images state once all images are fetched
        };

        fetchAdress();
    }, [state.currentUser]);
    const sample = ['57 A Street C, District 1, City DN','58 A Street D, District 3, City HN','98 A Street C, District 3, City HN']
    const partitionedAddresses = sample.map(addr => {
        const [street, district, city] = addr.split(',').map(item => item.trim());
        return { street, district, city };
      });
    return(
        <>
        
        <div className="profile-form">
                <h2><span style={{color: "gray",fontWeight: "bold", cursor: "pointer"}} onClick={()=>setActive(1)}>&#8592;</span> Thông tin địa chỉ</h2>
                <table className="address-table">
                    <thead>
                        <tr>
                        <th>STT</th>
                        <th>Số nhà</th>
                        <th>Quận/Huyện</th>
                        <th>Tỉnh/Thành phố</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        partitionedAddresses && partitionedAddresses.length > 0 ? partitionedAddresses.map((item, index) => {
                            return (
                            <tr key={index}>
                                <td>{index + 1}</td> {/* Display the index + 1 for STT */}
                                <td>{item.street}</td>
                                <td>{item.district}</td>
                                <td>{item.city}</td>
                                <td><button onClick={() => handleRemove(index)}>&#x00D7;</button></td> {/* Close button */}
                            </tr>
                            )
                        }) : null
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
                        <label htmlFor="ward">Nhập Phường/Xã</label>
                        <input type="text" id="ward" value={address.ward}  onChange={(e) => setVal((prev)=>({...prev,ward:e.target.value}))}/>
                    </div>
                    <div className="full-width">
                        <label htmlFor="street">Nhập số nhà/tên đường</label>
                        <input type="text" id="street" value={address.street}  onChange={(e) => setVal((prev)=>({...prev,street:e.target.value}))}/>
                    </div>
                </div> 
                <label>
                    <input type="checkbox" name="subscribe" value={address.isdefault} onChange={(e) => setVal(e.target.value)}/>
                     Địa chỉ mặc định
                </label>
                <div className="form-actions">
                    <button className="btn-cancel">Hủy</button>
                    <button className="btn-save" >Lưu thay đổi</button>
                </div>
            </div>
            </>
    )
}

function UpdateData({state, active, setActive}){
    const [magnet, setMag] =useState(1)
    const [defAdress, setAddress] = useState("")
    const [defPhone, setPhone] = useState("")
    const [user, setUser] = useState({
        fname: state.currentUser.fname,
        lname: state.currentUser.lname,
        username: state.currentUser.username,
        email: state.currentUser.email
    })
    useEffect(() => {
        const fetchAdress = async () => {
            let adress = "";
            const res = await fetch(`http://localhost:8000/api/user/GetAll/${state.currentUser.uid}`)
            if (!res.ok) throw new Error("Error while fetching address")
            adress = res.data?res.data.find(item => item.isdefault == true).address: ""
            setAddress(adress); // Update images state once all images are fetched
        };

        fetchAdress();
    }, [state.currentUser]);
    useEffect(() => {
        const fetchPhone = async () => {
            let phone = "";
            const res = await fetch(`http://localhost:8000/api/user/GetPhone/${state.currentUser.uid}`)
            if (!res.ok) throw new Error("Error while fetching address")
            phone = res.data?res.data[0].phone: ""
            setAddress(phone); // Update images state once all images are fetched
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
            alert(response.status)
            //alert('Cập nhật thông tin thành công')
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
                                <span>{defAdress!=""?defAdress:"Chưa có địa chỉ mặc định"}</span>
                                <button id="address" onClick={()=>setActive(5)}>Chỉnh sửa</button>
                            </div>
                        </div>
                        <div className="full-width">
                            <label htmlFor="phone">Số điện thoại</label>
                            <div className="item-item">
                                <span>{defPhone!=""?defPhone:"Chưa có số điện thoại mặc định"}</span>
                                <button id="phone" onClick={() => setActive(6)}>Chỉnh sửa</button>
                            </div>
                        </div>
                    </div>
                    <h3>Thay đổi mật khẩu</h3>
                    <div className="form-group">
                        <input type="password" className="full-width" placeholder="Mật khẩu hiện tại"/>
                    </div>
                    <div className="form-group">
                        <input type="password" className="full-width" placeholder="Mật khẩu mới"/>
                    </div>
                    <div className="form-group">
                        <input type="password" className="full-width" placeholder="Nhập lại mật khẩu mới"/>
                    </div>
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
        default:
            return <UpdateData state={state}/>
    }
}

export function UserAccountManagement({state,NavigateTo}) {
    console.log("users: " + state.currentUser)
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
                    <div className={`item ${active == 1 || active == 5 || active == 6?"active":""}`} onClick={()=>curPage(1)}>Tài khoản của bạn</div>
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