import { useEffect, useState } from "react"

export default function ProductUpdate({props, prodID}) {   
    const [product, setProduct] = useState(null);
    useEffect((prodID) => {
        const retrieveProduct = fetch("")
    })  


    return(
        <>
            <div>
                <div className="text-bold">PRODUCT: {} </div>
            </div>
        </>
    )
}