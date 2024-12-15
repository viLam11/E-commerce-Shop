export default function ProductInCheckout({img, prodName, prodPrice, quantity, subtotal}) {

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    return (
        <div className="flex flex-row items-center mr-20">
            <div className=" w-2/5 flex items-center space-x-2">
                <span>
                    <img src="https://th.bing.com/th/id/R.26fd47d8cd148081597eb4070ec6081f?rik=vKSdFuUdliHwaw&pid=ImgRaw&r=0" alt="" width={"50px"} />
                </span>
                <span>{prodName}</span>
            </div>
            {/* <div className=" w-2/5 text-right ">{prodPrice}</div> */}
            <div className=" w-1/5 text-right mr-20">x 2</div>
            <div className=" w-2/5 text-right ">{formatNumber(subtotal)} VND</div>
        </div>
    )
}