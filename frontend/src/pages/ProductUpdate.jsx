import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { useParams } from 'react-router-dom';

export default function ProductUpdate() {
    // IMAGE
    const { id } = useParams();
    // alert("id: ", id);
    const [fileImg, setFileImg] = useState([
        null, null, null, null, null, null
    ])
    const [img1, setImg1] = useState("../../public/img_upload.svg");
    const [img2, setImg2] = useState("../../public/img_upload.svg");
    const [img3, setImg3] = useState("../../public/img_upload.svg");
    const [img4, setImg4] = useState("../../public/img_upload.svg");
    const [img5, setImg5] = useState("../../public/img_upload.svg");
    const [img6, setImg6] = useState("../../public/img_upload.svg");
    
    // PRODUCT VALUE
    const [productName, setProductName] =  useState("");
    const [selectCat, setSelectCat] = useState(false);
    const [brand, setBrand] = useState("");
    const [description, setDiscription] = useState(false);
    const [price, setPrice] = useState(null);
    const [quantity, setQuantity]  = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/product/get-detail/${id}`)
            .then((reponse) => {
                const prodDetail = reponse.data.data;
                setProductName(prodDetail.pname)
                setBrand(prodDetail.brand)
                setPrice(prodDetail.price)
                setDiscription(prodDetail.description);
                setQuantity(prodDetail.quantity);
                setImg1(prodDetail.image[0]);
                setImg2(prodDetail.image[1]);
                setImg3(prodDetail.image[2]);
                setImg4(prodDetail.image[3]);
                setImg5(prodDetail.image[4]);
                setImg6(prodDetail.image[5]);

            })
    }, [])

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

    function handleSelectCat(e) {
        setSelectCat(e.target.value != "");
    }

    function handleChangeDescription(e) {
        
        if(e.target.value.length > 0 ) setDiscription(e.target.value)
        else setDiscription(false);
    }

    function handleUpdate() {
        const formData = new FormData();
        formData.append('brand', brand)
        formData.append('description', description );
        formData.append('quantity', quantity);
        formData.append('price', price);

        fileImg.forEach((image, index) => {
            formData.append('image', image);
          });

        axios.put(`http://localhost:8000/api/product/UpdateProduct/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
            .then((response) => {
                console.log(response)
                alert("New product is created!")
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
                        <h2 className="font-medium text-3xl" >Lưu thay đổi</h2>
                        <div className="my-6">
                            <label>Tên sản phẩm <span className="text-red-600">*</span></label>
                            <input type="text" name="pname" className={`pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md `}  
                                onChange={(e) => {setProductName(e.target.value)}}
                                value={productName}
                            />
                        </div>


                        <div className="my-6">
                            <label>Phân loại<span className="text-red-600">*</span></label>
                            <select name="category" className={`block w-4/5 h-8 my-2 rounded-md hover:bg-blue-100 ${selectCat? 'bg-blue-100': 'bg-gray-100'} `} 
                                onChange={(e) => handleSelectCat(e)}
                                value={selectCat}    
                            >
                                <option value="" disabled>Chọn loại sản phẩm</option>
                                <option value="smartphone" onClick={(e) => {setBrand("c01")}}>Điện thoại</option>
                                <option value="laptop" onClick={(e) => {setBrand("c02")}}>Laptop</option>
                                <option value="tablet" onClick={(e) => {setBrand("c03")}}>Máy tính bảng</option>
                                <option value="swatch" onClick={(e) => {setBrand("c04")}}>Đồng hồ</option>
                                <option value="other" onClick={(e) => {setBrand("c05")}}>Phụ kiện</option>
                            </select>
                        </div>

                        <div className="my-6">
                            <label>Hãng sản xuất<span className="text-red-600">*</span></label>
                            <input type="text" name="brand" className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md hover:bg-blue-100" 
                                onChange={(e) => setBrand(e.target.value) }
                                value={brand}
                            />
                        </div>

                        <div className="my-6">
                            <label>Giá thành<span className="text-red-600">*</span></label>
                            <input type="number" name="price" className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md" 
                                onChange={(e) => setPrice(e.target.value) }
                                value={price}
                            />
                        </div>

                        <div className="my-6">
                            <label>Số lượng trong kho<span className="text-red-600">*</span></label>
                            <input type="number" name="quantity" className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md" 
                                onChange={(e) => setQuantity(e.target.value) }
                                value={quantity}
                            />
                        </div>

                        <div className="my-6">
                            <label>Mô tả sản phẩm<span className="text-red-600">*</span></label>
                            <textarea name="price" className={`p-4 block w-4/5 h-36 my-2 rounded-md hover:bg-blue-100 ${description ? "bg-blue-100" : "bg-gray-100"}`} 
                            onChange={(e) => handleChangeDescription(e)}
                            value={description}
                            />

                        </div>
                    </div>

                    <div>
                        <h2 className="font-medium text-3xl pb-4" >Hình ảnh</h2>
                        {/* <div class="flex items-center space-x-2 my-5">
                            <span class="text-sm font-semibold">Màu</span>
                            <span class="inline-block w-6 h-6 rounded-full bg-yellow-400"></span>
                            <span class="inline-block w-6 h-6 rounded-full bg-indigo-300"></span>
                        </div> */}

                        <div class="grid grid-cols-3 gap-2 mr-8">
                            <div>
                                <div class="block m-auto h-auto rounded-lg justify-center">
                                    <img src={img1} alt="" name="img1" onClick={() => {document.getElementById('img1').click()}} className="w-72 h-80 block object-contain rounded-lg" />
                                </div>
                                <input id="img1" type="file" accept="image/*" class="hidden" onChange={(e) => {onChangeImg(e, 1)}} />
                            </div>
                            <div>
                                <div class="block m-auto h-auto rounded-lg justify-center">
                                    <img src={img2} alt="" name="img2" onClick={() => {document.getElementById('img2').click()}} className="w-72 h-80 block object-contain rounded-lg" />
                                </div>
                                <input id="img2" type="file" accept="image/*" class="hidden" onChange={(e) => {onChangeImg(e, 2)}} />
                            </div>
                            <div>
                                <div class="block m-auto h-auto rounded-lg justify-center">
                                    <img src={img3} alt="" name="img3" onClick={() => {document.getElementById('img3').click()}} className="w-72 h-80 block object-contain rounded-lg" />
                                </div>
                                <input id="img3" type="file" accept="image/*" class="hidden" onChange={(e) => {onChangeImg(e, 3)}} />
                            </div>
                            <div>
                                <div class="block m-auto h-auto rounded-lg justify-center">
                                    <img src={img4} alt="" name="img4" onClick={() => {document.getElementById('img4').click()}} className="w-72 h-80 block object-contain rounded-lg" />
                                </div>
                                <input id="img4" type="file" accept="image/*" class="hidden" onChange={(e) => {onChangeImg(e, 4)}} />
                            </div>
                            <div>
                                <div class="block m-auto h-auto rounded-lg justify-center">
                                    <img src={img5} alt="" name="img5" onClick={() => {document.getElementById('img5').click()}} className="w-72 h-80 block object-contain rounded-lg" />
                                </div>
                                <input id="img5" type="file" accept="image/*" class="hidden" onChange={(e) => {onChangeImg(e, 5)}} />
                            </div>

                            <div>
                                <div class="block m-auto h-auto rounded-lg justify-center">
                                    <img src={img6} alt="" name="img6" onClick={() => {document.getElementById('img6').click()}} className="w-72 h-80 block object-contain rounded-lg" />
                                </div>
                                <input id="img6" type="file" accept="image/*" class="hidden" onChange={(e) => {onChangeImg(e, 6)}} />
                            </div>
                        </div>

                        <div className="flex justify-end mr-20 mb-10 mt-10">
                            <div className="bg-red-500 text-white w-44 p-4 text-center rounded-md ml-8" onClick={handleUpdate} >Chỉnh sửa sản phẩm</div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}


// export default function ProductUpdate({ props, prodID, disableEditMode  }) {
//     const [productData, setProductData] = useState({
//         "product_id": "216d1e84-7674-4d28-bf26-d002c653815a",
//         "pname": "Iphone 15 pro",
//         "brand": "Apple",
//         "description": "Apple iphone...",
//         "price": 25000000,
//         "quantity": 400,
//         "create_time": "2024-11-09T18:34:48.239Z",
//         "cate_id": "cat1",
//         "sold": 0,
//         "rating": 0
//     });
//     const [error, setError] = useState(null);

//     // useEffect(() => {
//     //     fetch(`http://localhost:8000/api/product/get-detail/216d1e84-7674-4d28-bf26-d002c653815a`, {
//     //       method: 'GET',
//     //       headers: {
//     //         'Accept': 'application/json',
//     //         'Content-Type': 'application/json',
//     //       },
//     //     })
//     //       .then((response) => {
//     //         if (!response.ok) {
//     //           return Promise.reject('Network response was not ok');
//     //         }
//     //         return response.json(); 
//     //       })
//     //       .then((data) => {
//     //         setProductData(data.data); 
//     //         console.log(data.data);
//     //         alert("Success get prod detail");
//     //       })
//     //       .catch((error) => {
//     //         console.error('Fetch error: ', error);
//     //         setError(error); // Lưu lỗi vào state
//     //       });
//     //   }, [prodID]);

//     function handleSubmit() {

//     }

//     return (
//         <>
//             <div className="z-20 w-1/2 m-auto border border-solid p-4 rounded-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/3 bg-white ">
//                 <div className="font-bold text-center h-8">PRODUCT DETAILS</div>
//                 <div className="italic"> 
//                     <span className="font-bold inline-block pr-2">Product ID: </span>
//                     <span className="text-gray-600"> {productData.product_id} </span>
//                 </div>
//                 <div className="italic border-b-2"> 
//                     <span className="font-bold inline-block pr-2 ">Created at:</span>
//                     <span className="text-gray-600">{productData.create_time}</span>
//                 </div>
//                 <form onSubmit={handleSubmit} className="mt-8">
//                     <div className="my-2">
//                         <label htmlFor="" className="inline-block font-bold w-1/4">Name: </label>
//                         <input 
//                             type="text" 
//                             name="pname" 
//                             value={productData.pname} 
//                             onChange={(e) => {
//                                 setProductData((prevData) => ({
//                                     ...prevData,
//                                     pname: e.target.value
//                                 }));
//                             }}
//                             className="border rounded-md px-2"
//                         />
//                     </div>
//                     <div className="my-2">
//                         <label htmlFor="brand" className="inline-block font-bold w-1/4">Brand: </label>
//                         <input 
//                             type="text" 
//                             name="brand" 
//                             value={productData.brand} 
//                             onChange={(e) => {
//                                 setProductData((prevData) => ({
//                                     ...prevData,
//                                     brand: e.target.value
//                                 }));
//                             }}
//                             className="border rounded-md px-2"
//                         />
//                     </div>

//                     <div className="my-2">
//                         <label htmlFor="price" className="inline-block font-bold w-1/4">Price: </label>
//                         <input 
//                             type="number" 
//                             name="price" 
//                             value={productData.price} 
//                             onChange={(e) => {
//                                 setProductData((prevData) => ({
//                                     ...prevData,
//                                     price : e.target.value
//                                 }))
//                             }}  
//                             className="border rounded-md px-2"
//                         />
//                     </div>

//                     <div className="my-2">
//                         <label htmlFor="quantity" className="inline-block font-bold w-1/4">Quantity: </label>
//                         <input 
//                             type="number" 
//                             name="quantity" 
//                             value={productData.quantity} 
//                             onChange={(e) => {
//                                 setProductData((prevData) => ({
//                                     ...prevData,
//                                     quantity : e.target.value
//                                 }))
//                             }}    
//                             className="border rounded-md px-2 "
//                         />
//                     </div>

//                     <div className="my-2">
//                         <label htmlFor="category" className="inline-block font-bold w-1/4">Category: </label>
//                         <input 
//                             type="text" 
//                             name="category" 
//                             value={productData.cate_id}
//                             onChange={(e) => {
//                                 setProductData((prevData) => ({
//                                     ...prevData,
//                                     cate_id : e.target.value
//                                 }))
//                             }}
//                             className="border rounded-md px-2"
//                         />
//                     </div>

//                     <div className=" flex">
//                         <label htmlFor="description" className="inline-block font-bold w-1/4">Description: </label>
//                         <textarea  
//                             value={productData.description} 
//                             onChange={(e) => {
//                                 setProductData((prevData) => ({
//                                     ...prevData,
//                                     description : e.target.value
//                                 }))
//                             }}
//                               className="border rounded-md px-2 w-2/3 h-32"
//                         />
//                     </div>

//                     <div className="mt-8 flex items-center justify-center space-x-16">
//                         <button className="border border-black rounded-md px-2 uppercase bg-green-500 w-20">Save</button>
//                         <button className="border border-black rounded-md px-2 uppercase bg-gray-300 w-20 " onClick={disableEditMode}>Discard</button>
//                     </div>

//                 </form>
//             </div>

            
//         </>
//     )
// }