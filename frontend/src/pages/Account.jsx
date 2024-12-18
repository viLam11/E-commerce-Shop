import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import axios from "axios";
import { useParams } from "react-router-dom";
import { use } from "react";
export default function Account() {
    const {userID} = useParams();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("")
    const [oldPass, setOldPass] = useState("");
    const [newPass, setPass] = useState("");
    const [confirmedPass, setConfirmedPass] = useState("");
    useEffect(() => {
        axios.get(`http://localhost/Assignment/Backend/api/user/detail/${userID}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data.data[0]);
                    const userData = response.data.data[0];
                    setUsername(userData.name);
                    setEmail(userData.email);
                    setPhone(userData.phone);
                    setAddress(userData.address);
                    // setUserData(response.data.data);
                }
            })
            .catch((error) => {
                if (error.response.data) {
                  alert(error.response.data.msg);
                } else {
                  console.error('Error:', error.message);
                }
              })
        
    })

    function handleUpdateAccount() {
        if (newPass !== confirmedPass) {
            alert("Mật khẩu nhập lại không đúng");
            return;
        }
        const data = {
            name: username,
            email: email,
            phone: phone
        }
        const updateData = async () => {
            try {
                const updateInfo = await axios.post(`http://localhost/Assignment/Backend/api/user/update/${userID}`, data);
                const updatePassword = await axios.post(`http://localhost/Assignment/Backend/api/user/change-pass/${userID}`, {
                        "current_password": oldPass,
                        "new_password": newPass
                });

                const [updateInfoRes, updatePassRes] = await Promise.all([updateInfo, updatePassword]);
                
                if (updateInfoRes.status === 200) {
                    alert("Cập nhật thông tin thành công");
                }

                if(updatePassRes.status === 200) {
                    alert("Cập nhật mật khẩu thành công");
                }
            } catch (error) {
                if (error.response.data) {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            }
        }
        updateData();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <div className="my-4 ml-10">
                    <span className="text-gray-600">Mua sắm / </span>
                    <span className="font-medium">Tài khoản</span>
                </div>
                <div className="w-10/12 mx-auto bg-purple-1 p-6">
                    <div className="w-9/12 mx-auto bg-purple-1 p-6">
                        <h1 className="text-red-700 font-bold text-2xl">Thông tin cá nhân</h1>
                        <div className="grid grid-cols-2">
                            <div>
                                <div className="my-4 space-y-2 flex flex-col min-w-48 w-1/2">

                                    <label htmlFor="name" className="">Tên khách hàng</label>
                                    <input type="text" className="bg-gray-200 p-2 outline-none"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>

                                <div className="my-4 space-y-2 flex flex-col min-w-48 w-1/2 ">
                                    <label htmlFor="email" className="">Email</label>
                                    
                                    <input type="text" className="bg-gray-200 p-2 outline-none"
                                        value={email}
                                        onChange={() => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="h-full w-full ">
                                <div className="w-full flex flex-col space-y-2 ">

                                    <label htmlFor="address" className="">Địa chỉ</label>
                                    <textarea className="bg-gray-200 p-2 block w-full min-h-20 overflow-auto break-words outline-none"
                                        value={address} setAddress={(e) => setAddress(e.target.value)}
                                    >
                                        
                                       
                                    </textarea>

                                </div>
                            </div>
                        </div>

                         {/* Element thay đổi mật khẩu */}
                         <div className="w-full flex flex-col space-y-2">
                            <label htmlFor="newPass" className="text-red-700 font-bold">Thay đổi mật khẩu</label>
                            <div className="flex flex-col space-y-2">
                                <div className="inline-block w-40">Mật khẩu hiện tại</div>
                                <input type="password" className="inline-block outline-none bg-gray-200 p-2 w-full min-w-60"
                                    value={oldPass}
                                    onChange={(e) => setOldPass(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <div className="inline-block w-40">Mật khẩu mới</div>
                                <input type="password" className="inline-block outline-none bg-gray-200 p-2 w-full min-w-60"
                                    value={newPass}
                                    onChange={(e) => setPass(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <div className="inline-block">Nhâp lại mật khẩu mới</div>
                                {newPass !== confirmedPass ? <div className="password-sm italic text-red-600">Mật khẩu nhập lại chưa đúng</div> :  null}
                                <input type="password" className="inline-block outline-none bg-gray-200 p-2 w-full min-w-60" 
                                    value={confirmedPass}
                                    onChange={(e) => setConfirmedPass(e.target.value)}
                                />
                            </div>
                        </div> 
                        <div className=" flex justify-end mt-6">
                            <div className="flex flex-row">
                                <button className="border border-black p-2 px-4 rounded-md">
                                    Hủy
                                </button>

                                <button className="bg-red-700 text-white font-semibold p-2 ml-10 rounded-md"
                                    onClick={handleUpdateAccount}
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="h-40">

            </div>
            <Footer />
        </div>
    )
}