export default function ProductInCheckout({img, prodName, prodPrice, quantity, subtotal}) {

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    return (
        <div className="flex flex-row items-center mr-10">
            <div className=" w-full flex items-center space-x-2">
                <span>
                    <img src={img} alt="" width={"160px"} />
                </span>
                <span className="">{prodName}</span>
            </div>
            {/* <div className=" w-2/5 text-right ">{prodPrice}</div> */}
            <div className=" w-1/5 text-right mr-10">x 2</div>
            <div className=" w-2/5 text-right ">{formatNumber(subtotal)} VND</div>
        </div>
    )
}