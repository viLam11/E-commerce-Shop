import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import TickerVoucher from "./TicketVoucher"

let data = [
    {
        "promotion_id": "703bb580-5c5c-45f0-88e1-aa7d22d3bb49",
        "name": "SALE 2/9",
        "quantity": 292929,
        "description": "Khuyến mãi Quốc Khánh Việt Nam",
        "starttime": "2024-09-01T17:00:00.000Z",
        "endtime": "2024-09-03T17:00:00.000Z",
        "minspent": 50000,
        "discount_type": "percent",
        "value": null,
        "percentage": 100,
        "max_amount": 20000,
        "apply_id": "c03",
        "apply_range": "category"
    },
    {
        "promotion_id": "f7b970d7-d546-434f-8cfe-60b05b6d3d9c",
        "name": "SALE 5/5",
        "quantity": 505050,
        "description": "Sale 5.5",
        "starttime": "2024-05-04T17:00:00.000Z",
        "endtime": "2024-05-07T17:00:00.000Z",
        "minspent": 50000,
        "discount_type": "percent",
        "value": null,
        "percentage": 20,
        "max_amount": 20000,
        "apply_id": null,
        "apply_range": "all"
    },
    {
        "promotion_id": "1716d76a-a525-401e-90e0-ec8843fdaa0a",
        "name": "SALE 3/3",
        "quantity": 303030,
        "description": "Sale 3.3",
        "starttime": "2024-03-02T17:00:00.000Z",
        "endtime": "2024-03-05T17:00:00.000Z",
        "minspent": 50000,
        "discount_type": "fix price",
        "value": 10000,
        "percentage": null,
        "max_amount": 10000,
        "apply_id": "product6",
        "apply_range": "product"
    },
    {
        "promotion_id": "31cb6d99-be7a-4a67-9d7b-246e0e80a1aa",
        "name": "SALE ",
        "quantity": 123123,
        "description": "Tết nguyên đán, ngàn niểm vui",
        "starttime": "2024-02-08T17:00:00.000Z",
        "endtime": "2024-02-13T17:00:00.000Z",
        "minspent": 50000,
        "discount_type": "fix price",
        "value": 5000,
        "percentage": null,
        "max_amount": 20000,
        "apply_id": "product5\n",
        "apply_range": "product"
    },
    {
        "promotion_id": "9664864f-3dc7-4a38-ae0d-1d279decf026",
        "name": "SALE GIÁNG SINH",
        "quantity": 242512,
        "description": "Giáng sinh rinh quà đỉnh",
        "starttime": "2024-12-23T17:00:00.000Z",
        "endtime": "2024-12-24T17:00:00.000Z",
        "minspent": 100000,
        "discount_type": "fix price",
        "value": 20000,
        "percentage": null,
        "max_amount": 20000,
        "apply_id": "product5",
        "apply_range": "product"
    },
    {
        "promotion_id": "promotion1",
        "name": "SALE 31/12",
        "quantity": 190,
        "description": "hello world2",
        "starttime": "2024-10-31T17:00:00.000Z",
        "endtime": "2024-11-07T17:00:00.000Z",
        "minspent": 100000,
        "discount_type": "percent",
        "value": 2,
        "percentage": 40,
        "max_amount": 15000,
        "apply_id": "p0000001",
        "apply_range": "all"
    },
    {
        "promotion_id": "promotion4",
        "name": "SALE 31/12 a",
        "quantity": 190,
        "description": "hello world2",
        "starttime": "2024-10-31T17:00:00.000Z",
        "endtime": "2024-11-07T17:00:00.000Z",
        "minspent": 100000,
        "discount_type": "percent",
        "value": 0,
        "percentage": 40,
        "max_amount": 15000,
        "apply_id": "p0000001",
        "apply_range": "all"
    },
    {
        "promotion_id": "promotion29",
        "name": "Khuyến mãi 24/12 ",
        "quantity": 2,
        "description": "fasdfa",
        "starttime": "2024-12-24T17:00:00.000Z",
        "endtime": "2024-12-26T17:00:00.000Z",
        "minspent": 20000,
        "discount_type": "percent",
        "value": 0,
        "percentage": 16,
        "max_amount": 200000,
        "apply_id": "",
        "apply_range": "all"
    },
    {
        "promotion_id": "sale11",
        "name": "SALE 1/1",
        "quantity": 101008,
        "description": "Khuyến mãi đầu năm mới, giảm giá các sản phẩm chào năm mới.fasdfa",
        "starttime": "2023-12-31T17:00:00.000Z",
        "endtime": "2024-01-02T17:00:00.000Z",
        "minspent": 50000,
        "discount_type": "fix price",
        "value": 5000,
        "percentage": 0,
        "max_amount": 20000,
        "apply_id": null,
        "apply_range": "all"
    },
    {
        "promotion_id": "promotion30",
        "name": "Khuyến mãi 24/12 ds",
        "quantity": 20,
        "description": "fasdfa",
        "starttime": "2024-12-17T17:00:00.000Z",
        "endtime": "2024-12-24T17:00:00.000Z",
        "minspent": 20000,
        "discount_type": "percent",
        "value": 0,
        "percentage": 10,
        "max_amount": 200000,
        "apply_id": "",
        "apply_range": "all"
    },
    {
        "promotion_id": "1569d129-a21f-4de9-95a4-ddc6f7f3ff18",
        "name": "SALE 4/4 - new",
        "quantity": 3997,
        "description": "Sale 4.4",
        "starttime": "2024-04-03T17:00:00.000Z",
        "endtime": "2024-04-07T17:00:00.000Z",
        "minspent": 50000,
        "discount_type": "percent",
        "value": 0,
        "percentage": 80,
        "max_amount": 20000,
        "apply_id": "c01",
        "apply_range": "category"
    },
    {
        "promotion_id": "promotion7",
        "name": "SALE 31/12 asdfasd",
        "quantity": 190,
        "description": "hello world2",
        "starttime": "2024-10-31T17:00:00.000Z",
        "endtime": "2024-11-07T17:00:00.000Z",
        "minspent": 100000,
        "discount_type": "fix price",
        "value": 20000,
        "percentage": 0,
        "max_amount": 15000,
        "apply_id": "",
        "apply_range": "all"
    },
    {
        "promotion_id": "14b60704-996c-4e2c-a879-f8084e705b4b",
        "name": "SALE 8/3",
        "quantity": 80,
        "description": "Khuyến mãi Quốc tế Phụ nữ",
        "starttime": "2024-03-07T17:00:00.000Z",
        "endtime": "2024-03-08T17:00:00.000Z",
        "minspent": 50000,
        "discount_type": "fix price",
        "value": 10000,
        "percentage": 0,
        "max_amount": 20000,
        "apply_id": "c02",
        "apply_range": "category"
    },
    {
        "promotion_id": "promotion8",
        "name": "Khuyến mãi theo sản phẩm + fix",
        "quantity": 2,
        "description": "fasfdadf",
        "starttime": "2024-12-23T17:00:00.000Z",
        "endtime": "2024-12-23T17:00:00.000Z",
        "minspent": 20000,
        "discount_type": "fix price",
        "value": 0,
        "percentage": 22222,
        "max_amount": 6,
        "apply_id": "",
        "apply_range": "all"
    },
    {
        "promotion_id": "promotion3",
        "name": "SALE 31/12 fsdfsdfsdfsdf",
        "quantity": 190,
        "description": "hello world2",
        "starttime": "2024-10-31T17:00:00.000Z",
        "endtime": "2024-11-07T17:00:00.000Z",
        "minspent": 100000,
        "discount_type": "percent",
        "value": 0,
        "percentage": 40,
        "max_amount": 15000,
        "apply_id": "",
        "apply_range": "all"
    },
    {
        "promotion_id": "promotion2",
        "name": "33/11",
        "quantity": 101008,
        "description": "Khuyến mãi đầu năm mới, giảm giá các sản phẩm chào năm mới.",
        "starttime": "2023-12-31T17:00:00.000Z",
        "endtime": "2024-01-02T17:00:00.000Z",
        "minspent": 50000,
        "discount_type": "fix price",
        "value": 0,
        "percentage": 0,
        "max_amount": 20000,
        "apply_id": "",
        "apply_range": "all"
    },
    {
        "promotion_id": "promotion6",
        "name": "SALE 31/12 d",
        "quantity": 190,
        "description": "hello world2",
        "starttime": "2024-10-31T17:00:00.000Z",
        "endtime": "2024-11-07T17:00:00.000Z",
        "minspent": 100000,
        "discount_type": "fix price",
        "value": 20000,
        "percentage": 0,
        "max_amount": 15000,
        "apply_id": "",
        "apply_range": "all"
    },
    {
        "promotion_id": "promotion9",
        "name": "SALE 31/12 dfsafdadfasdfad",
        "quantity": 190,
        "description": "hello world2",
        "starttime": "2024-10-31T17:00:00.000Z",
        "endtime": "2024-11-07T17:00:00.000Z",
        "minspent": 100000,
        "discount_type": "fix price",
        "value": 20000,
        "percentage": 0,
        "max_amount": 15000,
        "apply_id": "Điện thoại",
        "apply_range": "category"
    },
    {
        "promotion_id": "promotion11",
        "name": "ấdfaqe",
        "quantity": 2,
        "description": "àasfa",
        "starttime": "2024-12-23T17:00:00.000Z",
        "endtime": "2024-12-23T17:00:00.000Z",
        "minspent": 10000,
        "discount_type": "fix price",
        "value": 0,
        "percentage": 20000,
        "max_amount": 9998,
        "apply_id": "",
        "apply_range": "category"
    },
    {
        "promotion_id": "promotion13",
        "name": "ấdfaqedfasfdasdfsadfasd",
        "quantity": 2,
        "description": "àasfa",
        "starttime": "2024-12-23T17:00:00.000Z",
        "endtime": "2024-12-23T17:00:00.000Z",
        "minspent": 10000,
        "discount_type": "percent",
        "value": 0,
        "percentage": 22,
        "max_amount": 9998,
        "apply_id": "product5",
        "apply_range": "product"
    },
    {
        "promotion_id": "9c797517-33ff-4dd4-971d-1b9a368b82a2",
        "name": "SALE 30/4",
        "quantity": 304304,
        "description": "Khuyến mãi chào mừng ngày Giải phóng miền Nam, thống nhât đất nước",
        "starttime": "2024-04-29T17:00:00.000Z",
        "endtime": "2024-05-02T17:00:00.000Z",
        "minspent": 1000000,
        "discount_type": "percent",
        "value": 0,
        "percentage": 90,
        "max_amount": 200000,
        "apply_id": "c05",
        "apply_range": "all"
    },
    {
        "promotion_id": "cfa8449b-3d62-49bc-9258-d4ead2a2c97e",
        "name": "SALE 20/10",
        "quantity": 201201,
        "description": "Khuyến mãi dành cho Ngày Phụ Nữ Việt Nam",
        "starttime": "2024-10-19T17:00:00.000Z",
        "endtime": "2024-10-22T17:00:00.000Z",
        "minspent": 50000,
        "discount_type": "percent",
        "value": 0,
        "percentage": 10,
        "max_amount": 20000,
        "apply_id": null,
        "apply_range": "all"
    },
    {
        "promotion_id": "promotion19",
        "name": "Khuyến mãi 24/12 sd",
        "quantity": 2,
        "description": "fasdfa",
        "starttime": "2024-12-24T17:00:00.000Z",
        "endtime": "2024-12-26T17:00:00.000Z",
        "minspent": 20000,
        "discount_type": "percent",
        "value": 0,
        "percentage": 16,
        "max_amount": 19999,
        "apply_id": "",
        "apply_range": "all"
    },
    {
        "promotion_id": "promotion27",
        "name": "Khuyến mãi 24/12 sdfsda",
        "quantity": 2,
        "description": "fasdfa",
        "starttime": "2024-12-24T17:00:00.000Z",
        "endtime": "2024-12-26T17:00:00.000Z",
        "minspent": 20000,
        "discount_type": "percent",
        "value": 0,
        "percentage": 16,
        "max_amount": 200000,
        "apply_id": "",
        "apply_range": "product"
    },
    {
        "promotion_id": "promotion12",
        "name": "MÃ GIẢM GIÁ 1",
        "quantity": 2,
        "description": "àasfa",
        "starttime": "2024-12-23T17:00:00.000Z",
        "endtime": "2024-12-23T17:00:00.000Z",
        "minspent": 10000,
        "discount_type": "fix price",
        "value": 2000,
        "percentage": 0,
        "max_amount": 9998,
        "apply_id": "product6",
        "apply_range": "product"
    },
    {
        "promotion_id": "dbaee8ae-da4e-4213-a573-0f9ba3454f68",
        "name": "SALE 5/9",
        "quantity": 595959,
        "description": "Khuyến mãi mùa tựu trường dd",
        "starttime": "2024-09-04T17:00:00.000Z",
        "endtime": "2024-09-10T17:00:00.000Z",
        "minspent": 1000000,
        "discount_type": "percent",
        "value": 0,
        "percentage": 20,
        "max_amount": 300000,
        "apply_id": null,
        "apply_range": "all"
    }
]

let prodList = [
    {
        "product_id": "product7",
        "pname": "New prod name sfasdfa",
        "brand": "Apple",
        "description": "fasfdadfa",
        "price": 22000,
        "pquantity": 10,
        "create_time": "2024-12-23T14:50:24.337Z",
        "cate_id": "c02",
        "sold": 0,
        "rating": 0,
        "image": [
            "https://res.cloudinary.com/da4spnmln/image/upload/v1735021912/d8fh9le4rzuwi2htsup6.jpg",
            "https://th.bing.com/th/id/OIP.qEMB65xzHrmZXsYfmPCY1wHaHa?w=480&h=480&rs=1&pid=ImgDetMain"
        ]
    },
    {
        "product_id": "product6",
        "pname": "New prod name",
        "brand": "Apple",
        "description": "Đặc điểm nổi bật\nTrang bị chip S9 SiP mạnh mẽ hỗ trợ xử lý mọi tác vụ nhanh chóng với nhiều tiện ích\nDễ dàng kết nối, nghe gọi, trả lời tin nhắn ngay trên cổ tay\nTrang bị nhiều tính năng sức khỏe như: Đo nhịp tim, điện tâm đồ, đo chu kỳ kinh nguyệt,...\nĐộ sáng tối đa lên tới 2000 nit, dễ xem màn hình ngay dưới ánh nắng gắt\nTích hợp nhiều chế độ tập luyện với các môn thể thao như: Bơi lội, chạy bộ, đạp xe,...\nĐồng hồ Apple Watch Series 9 45mm sở hữu on chip S9 SiP - CPU với 5,6 tỷ bóng bán dẫn giúp mang lại hiệu năng cải thiện hơn 60% so với thế hệ S8. Màn hình thiết bị với kích thước 45mm cùng độ sáng tối đa lên 2000 nit mang lại trải nghiệm hiển thị vượt trội. Cùng với đó, đồng hồ Apple Watch s9 này còn được trang bị nhiều tính năng hỗ trợ theo dõi sức khỏe và tập luyện thông minh.\n\nApple Watch Series 9 45mm - Thiết kế sang trọng, tính năng mới mẻ\nApple Watch 9 45mm có chất lượng hiển thị rất sắc nét, độ sáng cao lên tới 2.000 nits. Bên cạnh đó, thiết bị tích hợp cả tính năng Double Tap hiện đại, mở ứng dụng tương ứng nhanh chóng hơn. \n\nThiết kế bo cong, màn hình độ sáng cao\nTổng thể ngoại hình của chiếc đồng hồ này khá nhỏ gọn, đường góc cạnh cong mềm mại, nhìn trông khá bắt mắt. ",
        "price": 20000,
        "pquantity": 10,
        "create_time": "2024-12-23T13:10:28.656Z",
        "cate_id": "c04",
        "sold": 0,
        "rating": 0,
        "image": [
            "https://res.cloudinary.com/da4spnmln/image/upload/v1734974999/rjvricn0ljbwgfim1hca.jpg",
            "https://res.cloudinary.com/da4spnmln/image/upload/v1734975003/cy4gwktgpvwipahclpxe.jpg"
        ]
    }
]

function formatToDDMMYYYY(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}


const fixPrice = (price) => {
    const format = String(price);
    let token = " đ";
    let checkpoint = 0;
    for (let i = format.length - 1; i >= 0; i--) {
        token = format[i] + token;
        checkpoint++;
        if (checkpoint === 3 && i !== 0) {
            token = "." + token;
            checkpoint = 0;
        }
    }
    return token;
}


export default function Voucher({ setVoucher, setIsPopupOpen, buyList }) {   
    // const [buyList, setBuyList] = useState(prodList); 
    const [vouchers, setVouchers] = useState(data); 
    const [fitVoucher, setFit] = useState([]);
    const [unReach, setReach] = useState([]);
    const [unApplied, setApply] = useState([]);

    // Function to calculate the discount value of a voucher
    const discountValue = (voucher) => {
        if (voucher.discount_type === "percent") {
            // Calculate percentage discount based on the total price of applicable items
            const applicableItems = buyList.filter(item => 
                (voucher.apply_range === "product" && item.product_id === voucher.apply_id) ||
                (voucher.apply_range === "category_id" && item.cate_id === voucher.apply_id) ||
                (voucher.apply_range === "all")
            );
            const totalPrice = applicableItems.reduce((sum, item) => sum + item.price * item.pquantity, 0);
            return (voucher.value / 100) * totalPrice;
        } else if (voucher.discount_type === "fixed") {
            // Fixed discount value
            return voucher.value;
        }
        return 0;
    };

    useEffect(() => {
        axios.get(`http://localhost:8000/api/promotion/GetAll`)
            .then((response) => {
                console.log("Check all promo: ", response.data.data);
            })
    }, []);

    useEffect(() => {
        const isProductApplicable = (voucher) => {
            const product = buyList.find(item => item.product_id === voucher.apply_id);
            return product && voucher.apply_range === "product" && voucher.minspent <= product.pquantity * product.price;
        };

        const isCategoryApplicable = (voucher) => {
            const categoryItems = buyList.filter(item => item.cate_id === voucher.apply_id);
            const totalSpent = categoryItems.reduce((sum, item) => sum + item.price * item.pquantity, 0);
            return voucher.apply_range === "category_id" && voucher.minspent <= totalSpent;
        };

        const isProductNotApplicable = (voucher) => {
            const product = buyList.find(item => item.product_id === voucher.apply_id);
            return product && voucher.apply_range === "product" && voucher.minspent > product.pquantity * product.price;
        };

        const isCategoryNotApplicable = (voucher) => {
            const categoryItems = buyList.filter(item => item.cate_id === voucher.apply_id);
            const totalSpent = categoryItems.reduce((sum, item) => sum + item.price * item.pquantity, 0);
            return voucher.apply_range === "category_id" && voucher.minspent > totalSpent;
        };

        const applicableVouchers = vouchers.filter(voucher => 
            voucher.quantity > 0 && (
                isProductApplicable(voucher) || 
                isCategoryApplicable(voucher) || 
                (voucher.apply_range === "all" && voucher.minspent <= buyList.reduce((sum, item) => sum + item.pquantity * item.price, 0))
            )
        ).sort((a, b) => discountValue(b) - discountValue(a));

        const reachableVouchers = vouchers.filter(voucher => 
            voucher.quantity > 0 && (
                isProductNotApplicable(voucher) || 
                isCategoryNotApplicable(voucher) || 
                (voucher.apply_range === "all" && voucher.minspent > buyList.reduce((sum, item) => sum + item.pquantity * item.price, 0))
            )
        ).sort((a, b) => discountValue(b) - discountValue(a));

        const nonApplicableVouchers = vouchers.filter(voucher => 
            !isProductNotApplicable(voucher) && 
            !isCategoryNotApplicable(voucher) && 
            voucher.apply_range !== 'all'
        ).sort((a, b) => discountValue(b) - discountValue(a));

        setFit(applicableVouchers);
        setReach(reachableVouchers);
        setApply(nonApplicableVouchers);
    }, [vouchers, buyList]);


    return(
        <div className="w-full">
            {Array.from({ length: 4 }).map((_, index) => (
                    <TickerVoucher key={index}  />
            ))}
        </div>
    )
}