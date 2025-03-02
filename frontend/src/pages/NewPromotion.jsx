import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PromotionInput from "../components/PromotionInput";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function NewPromotion() {
    const [category, setCategory] = useState([]);
    // const [promoType, setPromoType] = useState(null);
    const navigate = useNavigate(); 
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [description, setDescription] = useState("");
    const [minSpent, setMinSpent] = useState(0);
    const [value, setValue] = useState(0);
    const [maxAmount, setMaxAmount] = useState(0);
    const [applyRange, setApplyRange] = useState(""); //all, product, category
    const [apply_id, setApply_id] = useState("");
    const [discount_type, setDiscount_type] = useState("");  //percent, fixed
    const [id, setID] = useState("")

    function handleChangePromoType(type) {
        setPromoType(value);
    }

    const formatDate = (date) => {
        return date ? format(date, 'dd/MM/yyyy') : '';
    };

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    useEffect(() => {
        axios.get(`http://localhost:8000/api/category/getAll`)
            .then((response) => {
                console.log("Check category: ", response.data.data);
                setCategory(response.data.data);
            })
            .catch((error) => {
                if (error.response.data) {
                    alert(error.response.data.message);
                } else {
                    console.log(error.message);
                }
            })
    }, [])

    function handleCreatPromo() {
        let newPromo;
        if(name == "" || quantity == 0 || description == "" || minSpent == 0 || value == 0 || maxAmount == 0 || applyRange == "" || discount_type == "") {
            return alert("Vui lòng điền đầy đủ thông tin");
        }
        if (discount_type == "percent") {
            if (value < 1 || value > 100) {
                alert("Giá trị phải nằm trong khoảng 1 - 100");
                return;
            }
            newPromo = {
                "name": name,
                "quantity": quantity,
                "description": description,
                "starttime": formatDate(startDate),
                "endtime": formatDate(endDate),
                "minspent": minSpent,
                "value": 0,
                "percentage": value,
                "max_amount": maxAmount,
                "discount_type": discount_type,
                "apply_range": applyRange,
                "apply_id": apply_id
            }
        } else {
            // newPromo = {
            //     "name": name,
            //     "quantity": quantity,
            //     "description": description,
            //     "starttime": formatDate(startDate),
            //     "endtime": formatDate(endDate),
            //     "minspent": minSpent,
            //     "value": value,
            //     "percentage": 0,
            //     "max_amount": maxAmount,
            //     "discount_type": discount_type,
            //     "apply_range": applyRange,
            //     "apply_id": apply_id
            // }
            newPromo = { 
                "name": name, 
                "quantity": quantity, 
                "description": description, 
                "starttime": formatDate(startDate), 
                "endtime": formatDate(endDate), 
                "minspent": Number(minSpent), 
                "value": 0, 
                "percentage": Number(value), 
                "max_amount": Number(maxAmount), 
                "discount_type": "fix price", 
                "apply_range": applyRange,
                "apply_id": apply_id
            }
        }
        
        console.log("Check promotion: ", newPromo);
        axios.post(`http://localhost:8000/api/promotion/CreatePromotion`, newPromo)
            .then((response) => {
                console.log("Check response: ", response.data);
                if(response.data.status === 200) {
                    alert("Thêm mã khuyến mãi thành công");
                    navigate("/admin/all-promo");
                    // Auto create notification
                    // setContent(`Mã khuyến mãi ${name} đã được tạo`)
                } 
                else if(response.data.status === 404) {
                    alert("Tên mã khuyến mãi bị trùng");
                }
            })
            .catch((error) => {
                console.log(error);
                if(error.response.data) {
                    alert(error.response.data.message);
                } else {
                    console.log(error.messsage);
                }
            })
    }

    // Auto create notification
    // const [content, setContent] = useState("")
    // useEffect(()=>{
    //     const fetchData = async()=>{
    //         if(!orderId) return;
    //         const temp = await axios.post(`http://localhost:8000/api/notification/create?id=${currentUser.uid}`, {content: content, uid: currentUser.uid})
    //         console.log(temp)
    //         if (temp.status != 200){
    //             return;
    //         }
    //         //alert("Tạo thông báo thành công")
    //         setToggle(!toggle)
    //     }
    //     fetchData()
    // },[content])
    //----------------------
    return (
        <div className="flex flex-col min-h-screen">
            <Header role="admin" />
            <main className="flex-grow">
                <div className="m-4 pl-20">
                    <span className="text-gray-600">Shop /</span>
                    <span className="font-medium">Add Promotion</span>
                </div>

                <h2 className="font-medium text-3xl pl-20 pt-10" >Thêm mã khuyến mãi mới </h2>
                <div className="grid grid-cols-2">
                    <div className="mx-auto w-4/5">
                        <div className="my-6">
                            <label>Tên khuyến mãi <span className="text-red-600">*</span></label>
                            <input type="text" name="pname" className={`pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md `}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="my-6">
                            <label>Mô tả <span className="text-red-600">*</span></label>
                            <textarea width={100} name="pname" className={`pl-4 pt-2 bg-gray-100 block w-4/5 h-20 my-2 rounded-md `}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            >
                            </textarea>
                        </div>
                        <div className="my-">
                            <label>Số lượng <span className="text-red-600">*</span></label>
                            <input type="number" name="quanity" className={`pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md required`}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>

                        <div className="my-">
                            <label>Thời gian hiệu lực <span className="text-red-600">*</span></label>
                            <div className="flex space-x-4">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md"
                                    placeholderText="Start Date"
                                    dateFormat="dd/MM/yyyy"
                                />
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md"
                                    placeholderText="End Date"
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                        </div>


                    </div>

                    <div className="mx-auto w-4/5 ">
                        <div className="flex flex-col h-full">
                            <div>
                                <h2 className="font-bold">Mặt hàng áp dụng</h2>

                                <div className="my-6 ml-6 flex space-x-6">
                                    <div>
                                        <label>Áp dụng với <span className="text-red-600">*</span></label>
                                        <select className="border border-black rounded-sm ml-6"
                                            onChange={(e) => setApplyRange(e.target.value)}
                                        >
                                            <option value="">Chọn loại áp dụng</option>
                                            <option value="all">Tất cả</option>
                                            <option value="product">Sản phẩm</option>
                                            <option value="category">Danh mục</option>
                                        </select>
                                    </div>


                                    {applyRange == "category" ?
                                        <div>

                                            <label>Danh mục <span className="text-red-600">*</span></label>
                                            <select className="border border-black rounded-sm ml-6"
                                                onChange={(e) => setApply_id(e.target.value)}
                                            >
                                                {Array.isArray(category) && category.map((item, index) => {
                                                    return <option key={index} value={item.cate_id}>{item.cate_name}</option>
                                                })}
                                            </select>
                                        </div>
                                        : null}
                                </div>

                                <div className="my-6 ml-6">
                                    <label htmlFor="">Loại khuyến mãi</label>
                                    <div className="grid grid-cols-2 ml-6 space-y-1">
                                        <div className="w-full">
                                            <input type="radio" value="percent" className="mr-2" name="promo-type"
                                                onClick={() => setDiscount_type("percent")}
                                            /> Giảm theo %

                                            <div>
                                                {discount_type == "percent" ? <PromotionInput name="percentage" setValue={setValue} value={value} /> : null}
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <input type="radio" value="fixed" className="mr-2" name="promo-type"
                                                onClick={() => setDiscount_type("fix price")}
                                            /> Giảm số tiền cụ thể
                                            <div>
                                                {discount_type == "fix price" ? <PromotionInput name="fixed" setValue={setValue} value={value}  /> : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="mt-6">
                                            <label>Chi tiêu tối thiểu <span className="text-red-600">*</span></label>
                                            <input type="number" name="min-spent" className={`pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md required`}
                                                value={minSpent}
                                                onChange={(e) => setMinSpent(e.target.value)}
                                            />
                                        </div>
                                        <div className="mt-6">
                                            <label>Giảm tối đa <span className="text-red-600">*</span></label>
                                            <input type="number" name="min-spent" className={`pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md required`}
                                                value={maxAmount}
                                                onChange={(e) => setMaxAmount(e.target.value)}
                                            />
                                        </div>
                                    </div>


                                </div>


                                {applyRange == "product" ?  
                                    <div className="my-6 ml-6 ">
                                        <label htmlFor="prodID" className="block mb-2">Mã sản phẩm </label>
                                        <input type="text" className="w-2/3 h-10 bg-gray-100" 
                                            onChange={(e) => setApply_id(e.target.value)}
                                        />
                                    </div> 
                                : null}
                               
                            </div>

                            <div className="flex-grow"></div>

                            <div className="w-full flex justify-center ">
                                <button type="button" className="relative bg-red-600 p-2 font-bold rounded-md text-white block bottom-0"
                                    onClick={() => handleCreatPromo()}
                                >Tạo mã khuyến mãi</button>
                            </div>
                        </div>

                    </div>

                </div>



            </main>
            <div className="h-20"></div>
            <Footer />
        </div>

    )
}