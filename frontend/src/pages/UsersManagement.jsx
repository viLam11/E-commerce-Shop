import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import Pagination from "../components/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function UsersManagement() {
    const [totalUser, setTotalUser] = useState(null);
    const [userData, setUserData] = useState({});
    const [page, setTotalPage] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [keyword, setKeyword] = useState("");   
    const [count, setCount] = useState(0);  
    const [field, setField] = useState(''); 
    const [order, setOrder] = useState('');
    const [sorted, setSorted] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8000/api/user/users?limit=10")
            .then((response) => {
                const userData = response.data.data;
                console.log(userData);
                setUserData(userData);
                setTotalUser(response.data.totalUser);
                setTotalPage(response.data.totalPage);
                console.log(page, currentPage)
            })
            .catch((err) => {
                alert(err.msg);
            });
    }, [])


    function handlePageClick(pageNum) {
        // alert(pageNum); 
        const index = Number(pageNum);
        if (sorted) {
            axios.get(`http://localhost:8000/api/user/users?}?page=${index}&limit=10&sort=${order}&sort=${field}`,)
            .then((response) => {
                console.log(response.data.data);
                setCurrentPage(pageNum)
                const userData = response.data.data;
                setUserData(userData);
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            })

        } else if (keyword != "") { 
            axios.get(`http://localhost:8000/api/user/users??page=${index}&limit=10&filter=${keyword}`,)
                .then((response) => {
                    console.log(response.data.data);
                    setCurrentPage(pageNum)
                    const userData = response.data.data;
                    setUserData(userData);
                })
                .catch((error) => {
                    if (error.response) {
                        alert(error.response.data.msg);
                    } else {
                        console.error('Error:', error.message);
                    }
                })
        }
        else {
            // alert("HERE");
            axios.get(`http://localhost:8000/api/user/users?page=${index}&limit=10`,)
                .then((response) => {
                    console.log(response.data.data);
                    setCurrentPage(pageNum)
                    const userDetail = response.data.data;
                    setUserData(userDetail);
                })
                .catch((error) => {
                    if (error.response) {
                        alert(error.response.data.msg);
                    } else {
                        console.error('Error:', error.message);
                    }
                })
        }

    }


    function handleSearch() {
        if (keyword == null) {
            alert("Hãy điền từ khóa để tìm kiếm")
        }
        axios.get(`http://localhost:8000/api/user/users?page=0&limit=10c&filter=${keyword}`,)
            .then((response) => {
                console.log(response);
                const products = response.data.data;
                const pageNum = response.data.totalPage;
                setTotalPage(pageNum);
                // console.log(JSON.stringify(products));
                setUserData(products);
            })
            .catch((error) => {
                if (error.response == undefined || "") {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            })
    }

    const handleSortChange = (e) => {
        const value = e.target.value;
        if (value != "-") {
            const [newField, newOrder] = value.split('-');
            setField(newField);
            setOrder(newOrder);

            axios.get(`http://localhost:8000/api/user/users?page=0&limit=10&sort=${newOrder}&sort=${newField}`)
                .then((response) => {
                    const userResponse = response.data.data;
                    console.log(userResponse);
                    console.log("Check total Page: ", response.data.totalPage);
                    setCurrentPage(0);
                    setTotalPage(response.data.totalPage);
                    setSorted(true);
                    setUserData(userResponse);
                })
        } else {
            setField('');
            setOrder('');
            setSorted(false);
        }
    };


    return (
        <div className="flex flex-col min-h-screen w-full">
            <Header />
            <div className="h-10"></div>
            <main className="flex-grow bg-purple-2 w-full">
                <div className="m-4 pl-20">
                    <span className="text-gray-600">Shop / </span>
                    <span className="font-medium">Customer Management</span>
                </div>

                <div className=" h-14 flex justify-center items-center w-full">
                    <div className="w-80 flex flex-row justify-center items-center">
                        <div className="w-1/4 p-0">
                            <img src="/users-gr.png" alt="" className=" object-contain" width={70} />
                        </div>
                        <div className="col-2 p-0 w-2/3 text-xs">
                            <div className="w-ful text-gray-500">Tổng người dùng</div>
                            <div className="w-ful text-xl font-bold">{totalUser}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white w-10/12 min-h-96 m-auto mt-10 rounded-3xl">
                    <div className="font-bold text-lg px-6 pt-6">Tất cả khách hàng</div>
                    <div className="flex justify-end ">
                        <div className="mr-40 flex flex-row">
                            <div className="search rounded-full ">
                                <div className="rounded-full h-full flex items-center my-auto pl-2 border border-black object-cover">
                                    <div className="h-full px-2 py-1 items-center justify-center hover:bg-gray-400"
                                        onClick={() => handleSearch()}    
                                    >
                                        <FontAwesomeIcon icon={faMagnifyingGlass} color="black" />
                                    </div>
                                    <div className="w-4/5 h-full bg-blue-50 rounded-full">
                                        <input type="text" placeholder="Tìm kiếm" className="pl-2 h-full rounded-e-full  bg-blue-50 border-none outline-none" 
                                            onChange={(event) => setKeyword(event.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-11/12 m-auto mt-6" style={{height:"540px"}} >
                        <table className="border-none w-full" >
                            <thead>
                                <tr className="w-full text-gray-500 h-6 text-base">
                                    <td className="pr-4">STT</td>
                                    <td className="w-3/12 pr-0">
                                        Tên khách hàng
                                        <span>
                                        <select name="sortByName" id="sortName" className="bg-white border outline-none text-sm ml-2"
                                            value={field === "lname" || "create_time" ? `${field}-${order}` : ""}
                                            onChange={handleSortChange}
                                        >
                                            <option value="" readOnly></option>
                                            <option value="create_time-desc">Mới nhất</option>
                                            <option value="lname-asc">A-Z</option>
                                            <option value="lname-desc">Z-A</option>
                                        </select>
                                    </span>    
                                    </td>
                                    <td className="w-1/12 mr-4 text-left">
                                        Chi tiêu
                                        <span>
                                            <select name="sortByName" id="sortName" className="bg-white border outline-none ml-1"
                                                value={field === "total_payment" ? `${field}-${order}` : ""}
                                                onChange={handleSortChange}
                                            >
                                                <option value="" readOnly disabled></option>
                                                <option value="total_payment-asc">T</option>
                                                <option value="total_payment-desc">G</option>
                                            </select>
                                        </span>
                                    </td>
                                    <td className="w-2/12 pl-4 ">Email</td>
                                    <td className="w-3/12">Địa chỉ</td>
                                    <td className="w-2/12">SĐT</td>
                                    <td className="w-1/12 text-center">Thông tin</td>
                                    
                                </tr>
                                <tr className="h-2 border-b border-zinc-300 my-10"></tr>

                            </thead>
                            <tbody>
                                
                                {userData.length > 0 ?  userData.map((user, index) => {
                                    const mainAddress = user.address.find((add) => add && add.isdefault === true);
                                    const mainPhone = user.phone[0];   

                                    return( 
                                            <tr className="w-full h-10 border-b border-gray-300" key={(currentPage-1)*10 + index + 1}>
                                                <td >{index + 1}</td>
                                                <td >{user.lname + " " + user.fname}</td>
                                                <td >{user.total_payment}</td>
                                                <td className="pl-4 ">{user.email}</td>
                                                <td >{mainAddress ? mainAddress.address: "Không"}</td>
                                                <td >{mainPhone ? mainPhone: "Không"}</td>
                                                <td >
                                                    <a href={`/admin/history/${user.uid}`}className=" border-2 border-green-500 px-3 rounded-md bg-green-100 font-semibold text-green-700 py-1">Chi tiết</a>
                                                </td>
                                            </tr>
                                        
                                    )
                                }) : null}
                            </tbody>
                        </table>

                        
                    </div>
                    <div className="h-16 flex flex-end justify-end items-end">    
                        <div className="mb-4 mr-10">
                        <div className="flex justify-end mr-20">
                        {/* <Pagination /> */}
                            {Array.from({ length: page }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageClick(i)} // Pass the page number to the handler
                                    className={`px-3 py-1 mx-1 hover:bg-blue-300 ${currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200"
                                        } rounded`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        </div>
                    </div>
                </div>



            
                <div className="h-20">
                    
                </div>
            </main >

            <div className="h-10"></div>
            <Footer />
        </div >
    )

}