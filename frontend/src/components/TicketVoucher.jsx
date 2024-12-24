export default function TicketVoucher({ setVoucher, setIsPopupOpen, promoDetail, best}) {    
    let item = {
        value: 10,
        minPrice: 100000,
        maxDiscount: 50000,
        expiredDate: "2022-12-31",  
    }
    let index = 0;
    return (
        <div className="w-[440px]">
            { best ? (
                <div className="text-center rounded-t-lg rounded-br-lg bg-pink-200 h-6 w-30 mb-[-26px] ml-[320px] p-1 text-xs text-red-500 z-20 pt-[2px]">
                    Lựa chọn tốt nhất
                </div>
            ) : null}
            <div
                key={index}
                className="border border-yellow-500 bg-yellow-100 ticket inline-flex shadow-lg mt-5 rounded-lg w-[380px] h-[120px] cursor-pointer z-10"
                onClick={() => {
                    setVoucher(item);
                    setIsPopupOpen(false);
                }}
            >
                <div className="py-2 w-[140px] flex flex-col items-center justify-center border-r-2 border-double border-black">
                    <img
                        src="../../../public/img/vouchersx.png"
                        alt="Vouchers"
                        className="w-[60px] h-[60px] "
                    />
                    <div className="mt-2 w-full text-center font-bold text-red-500">Tên</div>
                </div>
                <div className="divider h-full"></div>
                <div className="right-section p-2 text-left w-[240px] pl-5">
                    {item.value ? (
                        <div className="font-bold">Giảm giá</div>
                    ) : (
                        <>
                            <div className="font-bold">Giảm ..%</div>
                            <div className="font-bold">Giảm tối đa: ...</div>
                        </>
                    )}
                    <div className="text-sm text-black">Đơn tối thiểu: ...</div>
                    <div className="text-xs text-gray-500">
                        Ngày hết hạn: <span className="text-red-500">...</span>
                    </div>
                </div>
            </div>
        </div>
    );
 }