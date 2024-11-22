import { useState } from "react";
import Header from "../components/Header";

export default function NewProduct() {
    // IMAGE
    const [fileImg, setFileImg] = useState({
        i1: null,
        i2: null,
        i3: null,
        i4: null,
        i5: null,
        i6: null
    })
    const [img1, setImg1] = useState("../../public/img_upload.svg");
    const [img2, setImg2] = useState("../../public/img_upload.svg");
    const [img3, setImg3] = useState("../../public/img_upload.svg");
    
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

    function onChangeImg1(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImg1(base64String);
                localStorage.setItem('img1', base64String);
            };
            setFileImg((prevFile) => ({...prevFile, i1: file}));
            reader.readAsDataURL(file); 
            setImg1(base64String);
        }
    }

    function onChangeImg(e, index) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImg1(base64String);
                localStorage.setItem(`img${index}`, base64String);
            };
            setFileImg((prevFile) => ({...prevFile, i1: file}));
            reader.readAsDataURL(file); 
            if(index == 1 ){
                setImg1(base64String);
            } 
            else if(index == 2) {
                setImg2(base64String);
            }
            else if(index == 3) {
                setImg3(base64String);
            }
        }
    }

    function handleSelectCat(e) {
        setSelectCat(e.target.value != "");
    }

    function handleChangeDescription(e) {
        if(e.target.value.length > 0 ) setDiscription(true)
        else setDiscription(false);
    }
    return (
        <>
            <Header page="product" role="admin" />
            <main>
                <div className="m-4 mb-10">
                    <span className="text-gray-600">Shop /</span><span /> <span className="font-medium">Add Products</span>
                </div>

                <div className="grid grid-cols-2">
                    <div className="mx-auto w-4/5">
                        <h2 className="font-medium text-3xl" >Thêm sản phẩm mới</h2>
                        <div className="my-6">
                            <label>Tên sản phẩm <span className="text-red-600">*</span></label>
                            <input type="text" name="pname" className={`pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md `} />
                        </div>


                        <div className="my-6">
                            <label>Phân loại<span className="text-red-600">*</span></label>
                            <select name="category" className={`block w-4/5 h-8 my-2 rounded-md hover:bg-blue-100 ${selectCat? 'bg-blue-100': 'bg-gray-100'} `} onChange={(e) => handleSelectCat(e)}>
                                <option value="" disabled>Chọn loại sản phẩm</option>
                                <option value="smartphone">Điện thoại</option>
                                <option value="laptop">Laptop</option>
                                <option value="tablet">Máy tính bảng</option>
                            </select>
                        </div>

                        <div className="my-6">
                            <label>Hãng sản xuất<span className="text-red-600">*</span></label>
                            <input type="text" name="brand" className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md hover:bg-blue-100" />
                        </div>

                        <div className="my-6">
                            <label>Giá thành<span className="text-red-600">*</span></label>
                            <input type="number" name="price" className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md" />
                        </div>

                        <div className="my-6">
                            <label>Số lượng trong kho<span className="text-red-600">*</span></label>
                            <input type="number" name="quantity" className="pl-4 bg-gray-100 block w-4/5 h-8 my-2 rounded-md" />
                        </div>

                        <div className="my-6">
                            <label>Mô tả sản phẩm<span className="text-red-600">*</span></label>
                            <textarea name="price" className={`p-4 block w-4/5 h-36 my-2 rounded-md hover:bg-blue-100 ${description ? "bg-blue-100" : "bg-gray-100"}`} onChange={(e) => handleChangeDescription(e)} />
                        </div>
                    </div>

                    <div>
                        <h2 className="font-medium text-3xl" >Thêm hình ảnh mới</h2>
                        <div class="flex items-center space-x-2 my-5">
                            <span class="text-sm font-semibold">Màu</span>
                            <span class="inline-block w-6 h-6 rounded-full bg-yellow-400"></span>
                            <span class="inline-block w-6 h-6 rounded-full bg-indigo-300"></span>
                        </div>

                        <div class="grid grid-cols-3 gap-2 mr-8">
                            <div>
                                <div class="block m-auto w-3/4 h-auto rounded-lg justify-center">
                                    <img src={img1} alt="" name="img1" onClick={handleChangeImg1} className="w-full h-full block rounded-lg" />
                                </div>
                                <input id="img1" type="file" accept="image/*" class="hidden" onChange={onChangeImg1} />
                            </div>
                            <div>
                                <div class="block m-auto w-3/4 h-auto rounded-lg justify-center">
                                    <img src={img1} alt="" name="img2" onClick={handleChangeImg} className="w-full h-full block rounded-lg" />
                                </div>
                            </div>
                            <div>
                                <div class="block m-auto w-3/4 h-auto rounded-lg justify-center">
                                    <img src={img1} alt="" name="img3" onClick={handleChangeImg} className="w-full h-full block rounded-lg" />
                                </div>
                            </div>
                            <div>
                                <div class="block m-auto w-3/4 h-auto rounded-lg justify-center">
                                    <img src={img1} alt="" name="img4" onClick={handleChangeImg} className="w-full h-full block rounded-lg" />
                                </div>
                            </div>
                            <div>
                                <div class="block m-auto w-3/4 h-auto rounded-lg justify-center">
                                    <img src={img1} alt="" name="img5" onClick={handleChangeImg} className="w-full h-full block rounded-lg" />
                                </div>
                            </div>

                            <div>
                                <div class="block m-auto w-3/4 h-auto rounded-lg justify-center">
                                    <img src={img1} alt="" name="img6" onClick={handleChangeImg} className="w-full h-full block rounded-lg" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mr-20">
                            <div className="bg-red-500 text-white mt-20 w-44 p-4 text-center rounded-md ml-8">Tạo sản phẩm mới</div>
                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}