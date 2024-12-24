import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Header({ page }) {
    const navigate = useNavigate();
    const [user_id, setUser_id] = useState(null);   
    const [role, setRole] = useState(null);
    const [displayCat, setDisplayCat] = useState(false);
    const [displayAccount, setDisplayAccount] = useState(false);
    
    function handleLogout() {
        localStorage.removeItem("userID");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        navigate("/");
    }   

    useEffect(() => {
        const userID = localStorage.getItem("userID");
        const accountRole = localStorage.getItem("role");
        setRole(accountRole);
        console.log("userID: ", userID);
        setUser_id(userID);
    }, [])
    
    if(role === "admin") 
        {
        return (
            <header className="h-16 bg-black text-white w-full">
                <div className="w-full h-full flex items-center">
                    <div className={"w-1/6 text-2xl font-bold tex-white flex justify-start pl-20"}>EXCLUSIVE</div>
                    <div className="menu w-4/6 justify-center text-center flex flex-row">
                        <ul className="flex flex-row space-x-9 text-lg items-center">
                            <li className={`${page === "product-manage" ? "border-b" : null} `}>
                                <a href="/admin/product-manage">Quản lý sản phẩm</a>
                            </li>
                            
                            <li className={`${page === "user-manage" ? "border-b" : null} `}>
                                
                                <a href="/admin/user-management">Quản lý người dùng</a>    
                            </li>

                            <li className={`${page === "promo-manage" ? "border-b" : null} `}>
                                
                                <a href="/admin/all-promo">Quản lý mã giảm giá</a>    
                            </li>

                            <li className={`${page === "order-manage" ? "border-b" : null} `}>
                                
                                <a href="/admin/order-management">Quản lý đơn hàng</a>    
                            </li>
                        </ul>
                    </div>
                    {/* <div className="w-1/6 flex justify-end pr-20">
                        <div className="flex flex-row space-x-2">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                </svg>

                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>

                            <span>

                            </span>
                        </div>
                    </div> */}
                      <div className={`w-1/6 pr-20 py-2 ${user_id ? "block" : "hidden"}`}             
                    onMouseEnter={() =>{ setDisplayAccount(true)}} // Hiển thị menu
                    onMouseLeave={() => setDisplayAccount(false)} // Ẩn menu khi ra ngoài
                >
                   
                        <div className="w-full flex justify-end text-right">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-0 w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        
                        <ul className={`absolute z-10 bg-black mt-2 min-w-48 ${displayAccount ? "block" : "hidden"}`}>
                            <li className="p-2 border-b-2 hover:font-semibold"
                                onClick={() => navigate(`/customer/account/${user_id}`)}
                            >Thông tin cá nhân</li>
                            <li className="p-2 border-b-2 hover:font-semibold"
                                onClick={() => navigate(`/customer/history/${user_id}`)}
                            >Lịch sử mua hàng</li>
                            <li className="p-2 border-b-2 hover:font-semibold"
                                onClick={handleLogout}
                            >Đăng xuất</li>
                        </ul>
                  
                </div>
                </div>
            </header>
        )
    }
    else return (
        <header className="h-16 bg-black text-white w-full">
            <div className="w-full h-full flex items-center">
                <div className="w-1/6 text-2xl font-bold tex-white flex justify-start pl-20">EXCLUSIVE</div>
                <div className="menu w-4/6 justify-center text-center flex flex-row">
                    <ul className="grid grid-cols-4 gap-4 text-lg items-center">
                        <li className="p-2" onClick={() => navigate("/customer/homepage")} >Trang chủ</li>
                        <li className="" onClick={() => navigate("/customer/shopping")} >
                            <div className="w-full h-full p-2 relative "
                               
                                onMouseEnter={() =>{ 
                                    setDisplayCat(true)}} // Hiển thị menu
                                onMouseLeave={() => setDisplayCat(false)} // Ẩn menu khi ra ngoài
                            >
                                <div  onClick={() => navigate("/customer/shopping")} >Mua sắm</div>
                                <div className={`absolute mt-2 left-0 z-10 text-sm ${displayCat === true ? "block" : "hidden"}`}>
                                <ul className="bg-black p-2 text-left w-44">
                                    <li className="border-b p-2 hover:font-bold" 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.location.href = (`/customer/category/smartphone`)
                                        }}
                                    >
                                        Điện thoại
                                    </li>
                                    <li className="border-b p-2 hover:font-bold" 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.location.href = (`/customer/category/laptop`)
                                        }}
                                    >Laptop</li>
                                    <li className="border-b p-2 hover:font-bold" 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.location.href = (`/customer/category/tablet`)
                                        }}
                                    >
                                        Máy tính bảng  </li>
                                    <li className="border-b p-2 hover:font-bold" 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.location.href = (`/customer/category/watch`)
                                        }}
                                    >Đồng hồ thông minh  </li>
                                    <li className="p-2 hover:font-bold"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.location.href = (`/customer/category/other`)
                                        }}
                                    >Phụ kiện  </li>
                                </ul>
                            </div>
                            </div>
                            
                        </li>
                        <li className="p-2"
                            onClick={() => navigate("/customer/news")}
                        >Tin tức</li>
                        <li className="p-2"
                            onClick={() => navigate("/customer/about")}
                        >Giới thiệu</li>
                    </ul>
                </div>
                <div className={`w-1/6 pr-20 py-2 ${user_id ? "block" : "hidden"}`}             
                    onMouseEnter={() =>{ setDisplayAccount(true)}} // Hiển thị menu
                    onMouseLeave={() => setDisplayAccount(false)} // Ẩn menu khi ra ngoài
                >
                   
                        <div className="w-full flex justify-end text-right">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        
                        <ul className={`absolute z-10 bg-black mt-2 min-w-48 ${displayAccount ? "block" : "hidden"}`}>
                            <li className="p-2 border-b-2 hover:font-semibold"
                                onClick={() => navigate(`/customer/account/${user_id}`)}
                            >Thông tin cá nhân</li>
                            <li className="p-2 border-b-2 hover:font-semibold"
                                onClick={() => navigate(`/customer/history/${user_id}`)}
                            >Lịch sử mua hàng</li>
                            <li className="p-2 border-b-2 hover:font-semibold"
                                onClick={handleLogout}
                            >Đăng xuất</li>
                        </ul>
                  
                </div>
            </div>
        </header>
    )
}