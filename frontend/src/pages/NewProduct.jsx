import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Cloudinary } from '@cloudinary/url-gen';
import { format } from "@cloudinary/url-gen/actions/delivery";
// import { auto } from '@cloudinary/url-gen/actions/resize';
// import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
// import { AdvancedImage } from '@cloudinary/react';

export default function NewProduct() {
    const navigate = useNavigate();
    // IMAGE
    const [fileImg, setFileImg] = useState([
        null, null, null, null, null, null
    ])
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [file3, setFile3] = useState(null);
    const [urls, setUrls] = useState([]);
    const [img1, setImg1] = useState(null);
    const [img2, setImg2] = useState(null);
    const [img3, setImg3] = useState(null);

    const cld = new Cloudinary({ cloud: { cloudName: 'da4spnmln' } });

    // PRODUCT VALUE
    const [productName, setProductName] = useState("");
    const [selectCat, setSelectCat] = useState("");
    const [brand, setBrand] = useState("");
    const [description, setDiscription] = useState(null);
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(null);
    const [status, setStatus] = useState("Available");

    // FUNCTION
    async function onChangeImg(e, index) {
        const file = e.target.files[0];

        let base64String;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                base64String = reader.result;
                setFileImg((prev) => {
                    if (Array.isArray(prev)) {
                        const updatedFileImg = [...prev];
                        updatedFileImg[index - 1] = file;
                        return updatedFileImg;
                    }
                    return [file];
                });
                if (index == 1) {
                    setImg1(base64String);
                    setFile1(file);
                    await uploadFile(file, 0);
                }
                else if (index == 2) {
                    setImg2(base64String);
                    setFile2(file);
                    await uploadFile(file, 1);
                }
                else if (index == 3) {
                    setImg3(base64String);
                    setFile3(file);
                    await uploadFile(file, 2);

                }
                localStorage.setItem(`img${index}`, base64String);
            };
            setFileImg((prevFile) => ({ ...prevFile, i1: file }));
            reader.readAsDataURL(file);
        }
    }

    function handleDeleteImage(index) {
        if (index == 1) {
            setImg1(null);
        } else if (index == 2) {
            setImg2(null);
        } else if (index == 3) {
            setImg3(null);
        }
    }

    function handleSelectCat(e) {
        setSelectCat(e.target.value != "");
    }

    function handleChangeDescription(e) {
        if (e.target.value.length > 0) setDiscription(true)
        else setDiscription(false);
    }

    function handlePriceChange(e) {
        const value = e.target.value.replace(/\./g, ''); // Remove existing dots
        const numberValue = parseInt(value, 10);
        if (!isNaN(numberValue)) {
            setPrice(numberValue);
        } else {
            setPrice(0);
        }
    };

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    function handleCreateProduct() {
        const newProduct = {
            "pname": productName,
            "price": price,
            "quantity": Number(quantity),
            "description": description,
            "cate_id": selectCat,
            "brand": brand,
            "img": urls,
            "ismain": 0
        }

        console.log("Check: ", newProduct);

        axios.post(`http://localhost:8000/api/product/CreateProduct`, newProduct)
            .then((response) => {
                if (response.status === 200) {
                    alert("Tạo sản phẩm thành công");
                    navigate("/admin/product-manage");
                }
            })
            .catch((error) => {
                if (error.response.data) {
                    alert(error.response.data.msg);
                } else {
                    console.error('Error:', error.message);
                }
            })
    }

    async function uploadFile(file, index) {
        // alert("I'm here");
        const url = 'https://api.cloudinary.com/v1_1/da4spnmln/image/upload';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'LTWPrismora');
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            // setUrls((prev) => [...prev, data.secure_url]);
            setUrls((prev) => {
                if (Array.isArray(prev)) {
                    let updatedImgs = [...prev];
                    updatedImgs[index] = data.secure_url;
                    return updatedImgs;
                }
                return [data.secure_url];
            })
            console.log(data);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }


    return (
        <>
            <Header page="product-manage" role="admin" />
            <main>
                <div className="m-4 mb-10">
                    <span className="text-gray-600">Shop /</span><span /> <span className="font-medium">Add Products</span>
                </div>

                <div className="grid grid-cols-2">
                    <div className="mx-auto w-4/5">
                        <h2 className="font-medium text-3xl" >Thêm sản phẩm mới</h2>
                        <div className="my-6">
                            <label>Tên sản phẩm <span className="text-red-600">*</span></label>
                            <input type="text" name="pname" className={`pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md `}
                                onChange={(e) => { setProductName(e.target.value) }}
                            />
                        </div>


                        <div className="my-6">
                            <label>Phân loại<span className="text-red-600">*</span></label>
                            <select name="category" className={`block w-4/5 h-8 my-2 rounded-md hover:bg-blue-100 ${selectCat ? 'bg-blue-100' : 'bg-gray-100'} `}
                                onChange={(e) => setSelectCat(e.target.value)}
                                value={selectCat}
                            >
                                <option value="">Chọn loại sản phẩm</option>
                                <option value="c01">Điện thoại</option>
                                <option value="c02">Laptop</option>
                                <option value="c03">Máy tính bảng</option>
                                <option value="c04">Đồng hồ</option>
                                <option value="c05">Phụ kiện</option>
                            </select>
                        </div>

                        <div className="my-6">
                            <label>Hãng sản xuất<span className="text-red-600">*</span></label>
                            <input type="text" name="brand" className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md hover:bg-blue-100"
                                onChange={(e) => setBrand(e.target.value)}
                            />
                        </div>

                        <div className="my-6">
                            <label>Giá thành<span className="text-red-600">*</span></label>
                            <input
                                type="text"
                                name="price"
                                className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md"
                                onChange={handlePriceChange}
                                value={formatNumber(price)}
                            />
                        </div>

                        <div className="my-6">
                            <label>Số lượng trong kho<span className="text-red-600">*</span></label>
                            <input type="number" name="quantity" className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md"
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>

                        <div className="my-6">
                            <label>Mô tả sản phẩm<span className="text-red-600">*</span></label>
                            <textarea name="price" className={`p-4 block w-4/5 h-36 my-2 rounded-md hover:bg-blue-100 ${description ? "bg-blue-100" : "bg-gray-100"}`}
                                onChange={(e) => setDiscription(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <h2 className="font-medium text-3xl pb-4" >Thêm hình ảnh</h2>

                        <div class="grid grid-cols-3 gap-2 mr-8">
                            <div>
                                <div className="relative block m-auto h-auto rounded-lg justify-center">
                                    <img src={img1 ? img1 : "../../public/img_upload.svg"} alt="" name="img1" onClick={() => { document.getElementById('img1').click() }} className="w-72 h-80 block object-contain rounded-lg" />
                                    <button
                                        onClick={() => { handleDeleteImage(1) }}
                                        className={`${img1 ? "" : "hidden"}  absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 items-center justify-center hover:bg-red-800 `}
                                    >
                                        X
                                    </button>
                                </div>
                                <input id="img1" type="file" accept="image/*" className="hidden" onChange={(e) => { onChangeImg(e, 1) }} />
                            </div>
                            <div>
                                <div className="relative block m-auto h-auto rounded-lg justify-center">
                                    <img src={img2 ? img2 : "../../public/img_upload.svg"} alt="" name="img2" onClick={() => { document.getElementById('img2').click() }} className="w-72 h-80 block object-contain rounded-lg" />
                                    <button
                                        onClick={() => { handleDeleteImage(2) }}
                                        className={`${img2 ? "" : "hidden"}  absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 items-center justify-center hover:bg-red-800 `}
                                    >
                                        X
                                    </button>
                                </div>
                                <input id="img2" type="file" accept="image/*" className="hidden" onChange={(e) => { onChangeImg(e, 2) }} />
                            </div>
                            <div>
                                <div className="relative block m-auto h-auto rounded-lg justify-center">
                                    <img src={img3 ? img3 : "../../public/img_upload.svg"} alt="" name="img3" onClick={() => { document.getElementById('img3').click() }} className="w-72 h-80 block object-contain rounded-lg" />
                                    <button
                                        onClick={() => { handleDeleteImage(3) }}
                                        className={`${img3 ? "" : "hidden"}  absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 items-center justify-center hover:bg-red-800 `}
                                    >
                                        X
                                    </button>
                                </div>
                                <input id="img3" type="file" accept="image/*" className="hidden" onChange={(e) => { onChangeImg(e, 3) }} />
                            </div>
                        </div>

                        <div className="flex justify-end mr-20 mb-10">
                            <div className="bg-red-500 text-white w-44 p-4 text-center rounded-md ml-8" onClick={handleCreateProduct} >Tạo sản phẩm  mới</div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}