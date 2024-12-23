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

    useEffect(() => {
        axios.get("http://localhost:8000/api/user/users?limit=10")
            .then((response) => {
                const userData = response.data.data;
                console.log(userData);
                setUserData(userData);
                setTotalUser(response.data[totalUser]);
                setTotalPage(response.data["totalPage"]);
                console.log(page, currentPage)
            })
            .catch((err) => {
                alert(err.msg);
            });
    }, [])


    function handlePageClick(pageNum) {
        const index = Number(pageNum);
        axios.get(`http://localhost:8000/api/user/users?page=${index}&limit=10`,)
            .then((response) => {
                console.log(response);
                setCurrentPage(pageNum)
                const users = response.data.data;
                // console.log(JSON.stringify(products));
                setUserData(users);
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            })
    }

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
                            <div className="w-ful flex flex-row items-center">
                                <span>
                                    <img src="/arrow-up.png" alt="" width={20} />
                                </span>
                                <span className="mr-1 text-green-600 font-semibold">16% </span>
                                <span>trong tháng</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white w-10/12 min-h-96 m-auto mt-10 rounded-3xl">
                    <div className="font-bold text-lg px-6 pt-6">Tất cả khách hàng</div>
                    <div className="flex justify-end ">
                        <div className="w-5/12 mr-10 flex flex-row">
                            <div className="search w-1/2 ">
                                <div className="bg-blue-50 rounded-xl h-full flex items-center my-auto space-x-2 pl-2 border border-black object-cover">
                                    <div className="w-4">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} color="black" />
                                    </div>
                                    <div className="w-4/5 h-full bg-blue-50">
                                        <input type="text" placeholder="Tìm kiếm" className="h-full bg-blue-50 border-none outline-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="sort w-48 mx-auto">
                                <div className="bg-blue-50 rounded-xl h-full flex items-center my-auto space-x-0 pl-2 object-fill border border-black">
                                    <span>Sắp xếp theo: </span>
                                    <span>
                                        <select name="sort-user" id="sort" className="bg-blue-50 font-semibold rounded-2xl border-none outline-none">
                                            <option value="newest">Mới nhất</option>
                                            {/* <option value="expense">Chi tiêu</option> */}
                                        </select>
                                    </span>
                                </div>
                            </div>



                        </div>
                    </div>

                    <div className="w-11/12 m-auto mt-6" style={{height:"540px"}} >
                        <table className="border-none w-full" >
                            <thead>
                                <tr className="w-full text-gray-500 h-6 text-base">
                                    <td className="w-10 block ">STT</td>
                                    <td className="w-3/12 ">Tên khách hàng</td>
                                    <td className="w-1/6 ">Chi tiêu</td>
                                    <td className="w-1/6 ">Email</td>
                                    <td className="w-2/6 text-center">Địa chỉ</td>
                                    <td className="w-1/12 text-center">Thông tin</td>
                                    
                                </tr>
                                <tr className="h-2 border-b border-zinc-300 my-10"></tr>

                            </thead>
                            <tbody>
                                
                                {userData.length > 0 ?  userData.map((user, index) => {
                                    return( 
                                        <>
                                            <tr className="h-3" ></tr>
                                            <tr className="w-full h-6">
                                                <td className="w-10 block ">{index + 1}</td>
                                                <td className="w-3/12 ">{user.lname + " " + user.fname}</td>
                                                <td className="w-1/6 ">{user.total_payment}</td>
                                                <td className="w-1/6 ">{user.email}</td>
                                                <td className="w-2/6"></td>
                                                <td className="w-1/12 text-center ">
                                                    <a href={`/admin/history/${user.uid}`}className=" border-2 border-green-500 px-3 rounded-md bg-green-100 font-semibold text-green-700 py-1">Chi tiết</a>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-zinc-300 my-10 h-3"></tr>
                                        </>
                                        
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