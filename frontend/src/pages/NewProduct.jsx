import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewProduct() {
    const navigate = useNavigate();
    // IMAGE
    const [fileImg, setFileImg] = useState([
        null, null, null, null, null, null
    ])
    const [img1, setImg1] = useState(null);
    const [img2, setImg2] = useState(null);
    const [img3, setImg3] = useState(null);
    const [img4, setImg4] = useState(null);
    const [img5, setImg5] = useState(null);
    const [img6, setImg6] = useState(null);
    
    // PRODUCT VALUE
    const [productName, setProductName] =  useState("");
    const [selectCat, setSelectCat] = useState(false);
    const [brand, setBrand] = useState("");
    const [description, setDiscription] = useState(false);
    const [price, setPrice] = useState(null);
    const [quantity, setQuantity]  = useState(null);

    // FUNCTION
    function handleChangeImg1() {
        document.getElementById('img1').click();
    }
    function handleChangeImg(index) {
        document.getElementById(`img${index}`).click();
    }

        // function onChangeImg1(e) {
        //     const file = e.target.files[0];
        //     if (file) {
        //         const reader = new FileReader();
        //         reader.onloadend = () => {
        //             const base64String = reader.result;
        //             setImg1(base64String);
        //             localStorage.setItem('img1', base64String);
        //         };
        //         setFileImg((prevFile) => ({...prevFile, i1: file}));
        //         reader.readAsDataURL(file); 
        //         setImg1(base64String);
        //     }
        // }


    function onChangeImg(e, index) {
        const file = e.target.files[0];
        let base64String;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                base64String = reader.result;
                // setImg1(base64String);
                setFileImg((prev) => {
                    if (Array.isArray(prev)) {
                      const updatedFileImg = [...prev];
                      updatedFileImg[index-1] = file;
                      return updatedFileImg;
                    }
                    return [file]; 
                  });
                if(index == 1 ){
                    setImg1(base64String);
                } 
                else if(index == 2) {
                    setImg2(base64String);
                }
                else if(index == 3) {
                    setImg3(base64String);
    
                } else if(index == 4) {
                    setImg4(base64String);
                } else if(index == 5) {
                    setImg5(base64String);
                } else if(index ==6 ) {
                    setImg6(base64String);
                }
                localStorage.setItem(`img${index}`, base64String);
            };
            setFileImg((prevFile) => ({...prevFile, i1: file}));
            reader.readAsDataURL(file); 
         
        }
    }

    function handleDeleteImage(index) {
        if(index == 1) {
            setImg1(null);
        } else if(index == 2) {
            setImg2(null);
        } else if(index == 3) {
            setImg3(null);
        } else if(index == 4) {
            setImg4(null);
        } else if(index == 5) {
            setImg5(null);
        } else if(index == 6) {
            setImg6(null);
        }
    }

    function handleSelectCat(e) {
        setSelectCat(e.target.value != "");
    }

    function handleChangeDescription(e) {
        if(e.target.value.length > 0 ) setDiscription(true)
        else setDiscription(false);
    }

    function handleCreateProduct() {
        const formData = new FormData();

        formData.append('pname', productName)
        formData.append('brand', brand)
        formData.append('description', description );
        formData.append('quantity', quantity);
        formData.append('cate_id', selectCat);
        formData.append('price', price);

        fileImg.forEach((image, index) => {
            formData.append('image', image);
          });

        axios.post('http://localhost:8000/api/product/CreateProduct', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
            .then((response) => {
                console.log(response)
                alert("New product is created!");
                navigate("/admin/product-manage")
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                  alert(error.response.data.msg);
                } else {
                  console.error('Error:', error.message);
                }
              })
        
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
                                onChange={(e) => {setProductName(e.target.value)}}
                            />
                        </div>


                        <div className="my-6">
                            <label>Phân loại<span className="text-red-600">*</span></label>
                            <select name="category" className={`block w-4/5 h-8 my-2 rounded-md hover:bg-blue-100 ${selectCat? 'bg-blue-100': 'bg-gray-100'} `} onChange={(e) => handleSelectCat(e)}>
                                <option value="" disabled>Chọn loại sản phẩm</option>
                                <option value="smartphone" onClick={(e) => {setSelectCat("c01")}}>Điện thoại</option>
                                <option value="laptop" onClick={(e) => {setSelectCat("c02")}}>Laptop</option>
                                <option value="tablet" onClick={(e) => {setSelectCat("c03")}}>Máy tính bảng</option>
                                <option value="swatch" onClick={(e) => {setSelectCat("c04")}}>Đồng hồ</option>
                                <option value="other" onClick={(e) => {setSelectCat("c05")}}>Phụ kiện</option>
                            </select>
                        </div>

                        <div className="my-6">
                            <label>Hãng sản xuất<span className="text-red-600">*</span></label>
                            <input type="text" name="brand" className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md hover:bg-blue-100" 
                                onChange={(e) => setBrand(e.target.value) }
                            />
                        </div>

                        <div className="my-6">
                            <label>Giá thành<span className="text-red-600">*</span></label>
                            <input type="number" name="price" className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md" 
                                onChange={(e) => setPrice(e.target.value) }
                            />
                        </div>

                        <div className="my-6">
                            <label>Số lượng trong kho<span className="text-red-600">*</span></label>
                            <input type="number" name="quantity" className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md" 
                                onChange={(e) => setQuantity(e.target.value) }
                            />
                        </div>

                        <div className="my-6">
                            <label>Mô tả sản phẩm<span className="text-red-600">*</span></label>
                            <textarea name="price" className={`p-4 block w-4/5 h-36 my-2 rounded-md hover:bg-blue-100 ${description ? "bg-blue-100" : "bg-gray-100"}`} 
                            onChange={(e) => handleChangeDescription(e)} />
                        </div>
                    </div>

                    <div>
                        <h2 className="font-medium text-3xl pb-4" >Thêm hình ảnh</h2>

                        <div class="grid grid-cols-3 gap-2 mr-8">
                            <div>
                                <div className="relative block m-auto h-auto rounded-lg justify-center">
                                    <img src={img1 ? img1 : "../../public/img_upload.svg"} alt="" name="img1" onClick={() => {document.getElementById('img1').click()}} className="w-72 h-80 block object-contain rounded-lg" />
                                    <button 
                                        onClick={() => { handleDeleteImage(1)}}
                                        className={ `${img1 ? "" : "hidden" }  absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 items-center justify-center hover:bg-red-800 `}
                                    >
                                        X
                                    </button>
                                </div>
                                <input id="img1" type="file" accept="image/*" className="hidden" onChange={(e) => {onChangeImg(e, 1)}} />
                            </div>
                            <div>
                                <div className="relative block m-auto h-auto rounded-lg justify-center">
                                    <img src={img2 ? img2 : "../../public/img_upload.svg"} alt="" name="img2" onClick={() => {document.getElementById('img2').click()}} className="w-72 h-80 block object-contain rounded-lg" />
                                    <button 
                                        onClick={() => { handleDeleteImage(2)}}
                                        className={ `${img2 ? "" : "hidden" }  absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 items-center justify-center hover:bg-red-800 `}
                                    >
                                        X
                                    </button>
                                </div>
                                <input id="img2" type="file" accept="image/*" className="hidden" onChange={(e) => {onChangeImg(e, 2)}} />
                            </div>
                            <div>
                                <div className="relative block m-auto h-auto rounded-lg justify-center">
                                    <img src={img3 ? img3 : "../../public/img_upload.svg"} alt="" name="img3" onClick={() => {document.getElementById('img3').click()}} className="w-72 h-80 block object-contain rounded-lg" />
                                    <button 
                                        onClick={() => { handleDeleteImage(3)}}
                                        className={ `${img3 ? "" : "hidden" }  absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 items-center justify-center hover:bg-red-800 `}
                                    >
                                        X
                                    </button>
                                </div>
                                <input id="img3" type="file" accept="image/*" className="hidden" onChange={(e) => {onChangeImg(e, 3)}} />
                            </div>
                            <div>
                                <div className="relative block m-auto h-auto rounded-lg justify-center">
                                    <img src={img4 ? img4 : "../../public/img_upload.svg"} alt="" name="img4" onClick={() => {document.getElementById('img4').click()}} className="w-72 h-80 block object-contain rounded-lg" />
                                    <button 
                                        onClick={() => { handleDeleteImage(4)}}
                                        className={ `${img4 ? "" : "hidden" }  absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 items-center justify-center hover:bg-red-800 `}
                                    >
                                        X
                                    </button>
                                </div>
                                <input id="img4" type="file" accept="image/*" className="hidden" onChange={(e) => {onChangeImg(e, 4)}} />
                            </div>

                            <div>
                                <div className="relative block m-auto h-auto rounded-lg justify-center">
                                    <img src={img5 ? img5 : "../../public/img_upload.svg"} alt="" name="img5" onClick={() => {document.getElementById('img5').click()}} className="w-72 h-80 block object-contain rounded-lg" />
                                    <button 
                                        onClick={() => { handleDeleteImage(5)}}
                                        className={ `${img5 ? "" : "hidden" }  absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 items-center justify-center hover:bg-red-800 `}
                                    >
                                        X
                                    </button>
                                </div>
                                <input id="img5" type="file" accept="image/*" className="hidden" onChange={(e) => {onChangeImg(e, 5)}} />
                            </div>

                            <div>
                                <div className="relative block m-auto h-auto rounded-lg justify-center">
                                    <img src={img6 ? img6 : "../../public/img_upload.svg"} alt="" name="img6" onClick={() => {document.getElementById('img6').click()}} className="w-72 h-80 block object-contain rounded-lg" />
                                    <button 
                                        onClick={() => { handleDeleteImage(6)}}
                                        className={ `${img6 ? "" : "hidden" }  absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 items-center justify-center hover:bg-red-800 `}
                                    >
                                        X
                                    </button>
                                </div>
                                <input id="img6" type="file" accept="image/*" className="hidden" onChange={(e) => {onChangeImg(e, 6)}} />
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