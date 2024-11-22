import { useEffect, useState } from "react"

export default function ProductUpdate({ props, prodID, disableEditMode  }) {
    const [productData, setProductData] = useState({
        "product_id": "216d1e84-7674-4d28-bf26-d002c653815a",
        "pname": "Iphone 15 pro",
        "brand": "Apple",
        "description": "Apple iphone...",
        "price": 25000000,
        "quantity": 400,
        "create_time": "2024-11-09T18:34:48.239Z",
        "cate_id": "cat1",
        "sold": 0,
        "rating": 0
    });
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     fetch(`http://localhost:8000/api/product/get-detail/216d1e84-7674-4d28-bf26-d002c653815a`, {
    //       method: 'GET',
    //       headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //       },
    //     })
    //       .then((response) => {
    //         if (!response.ok) {
    //           return Promise.reject('Network response was not ok');
    //         }
    //         return response.json(); 
    //       })
    //       .then((data) => {
    //         setProductData(data.data); 
    //         console.log(data.data);
    //         alert("Success get prod detail");
    //       })
    //       .catch((error) => {
    //         console.error('Fetch error: ', error);
    //         setError(error); // Lưu lỗi vào state
    //       });
    //   }, [prodID]);

    function handleSubmit() {

    }

    return (
        <>
            <div className="z-20 w-1/2 m-auto border border-solid p-4 rounded-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/3 bg-white ">
                <div className="font-bold text-center h-8">PRODUCT DETAILS</div>
                <div className="italic"> 
                    <span className="font-bold inline-block pr-2">Product ID: </span>
                    <span className="text-gray-600"> {productData.product_id} </span>
                </div>
                <div className="italic border-b-2"> 
                    <span className="font-bold inline-block pr-2 ">Created at:</span>
                    <span className="text-gray-600">{productData.create_time}</span>
                </div>
                <form onSubmit={handleSubmit} className="mt-8">
                    <div className="my-2">
                        <label htmlFor="" className="inline-block font-bold w-1/4">Name: </label>
                        <input 
                            type="text" 
                            name="pname" 
                            value={productData.pname} 
                            onChange={(e) => {
                                setProductData((prevData) => ({
                                    ...prevData,
                                    pname: e.target.value
                                }));
                            }}
                            className="border rounded-md px-2"
                        />
                    </div>
                    <div className="my-2">
                        <label htmlFor="brand" className="inline-block font-bold w-1/4">Brand: </label>
                        <input 
                            type="text" 
                            name="brand" 
                            value={productData.brand} 
                            onChange={(e) => {
                                setProductData((prevData) => ({
                                    ...prevData,
                                    brand: e.target.value
                                }));
                            }}
                            className="border rounded-md px-2"
                        />
                    </div>

                    <div className="my-2">
                        <label htmlFor="price" className="inline-block font-bold w-1/4">Price: </label>
                        <input 
                            type="number" 
                            name="price" 
                            value={productData.price} 
                            onChange={(e) => {
                                setProductData((prevData) => ({
                                    ...prevData,
                                    price : e.target.value
                                }))
                            }}  
                            className="border rounded-md px-2"
                        />
                    </div>

                    <div className="my-2">
                        <label htmlFor="quantity" className="inline-block font-bold w-1/4">Quantity: </label>
                        <input 
                            type="number" 
                            name="quantity" 
                            value={productData.quantity} 
                            onChange={(e) => {
                                setProductData((prevData) => ({
                                    ...prevData,
                                    quantity : e.target.value
                                }))
                            }}    
                            className="border rounded-md px-2 "
                        />
                    </div>

                    <div className="my-2">
                        <label htmlFor="category" className="inline-block font-bold w-1/4">Category: </label>
                        <input 
                            type="text" 
                            name="category" 
                            value={productData.cate_id}
                            onChange={(e) => {
                                setProductData((prevData) => ({
                                    ...prevData,
                                    cate_id : e.target.value
                                }))
                            }}
                            className="border rounded-md px-2"
                        />
                    </div>

                    <div className=" flex">
                        <label htmlFor="description" className="inline-block font-bold w-1/4">Description: </label>
                        <textarea  
                            value={productData.description} 
                            onChange={(e) => {
                                setProductData((prevData) => ({
                                    ...prevData,
                                    description : e.target.value
                                }))
                            }}
                              className="border rounded-md px-2 w-2/3 h-32"
                        />
                    </div>

                    <div className="mt-8 flex items-center justify-center space-x-16">
                        <button className="border border-black rounded-md px-2 uppercase bg-green-500 w-20">Save</button>
                        <button className="border border-black rounded-md px-2 uppercase bg-gray-300 w-20 " onClick={disableEditMode}>Discard</button>
                    </div>

                </form>
            </div>

            
        </>
    )
}