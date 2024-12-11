export default function Banner({ViewCategories}) {
    const [activeIndex, setActiveIndex] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % 5); // Có 5 vòng tròn, nên dùng % 5
        }, 3000);

        return () => clearInterval(interval); // Dọn dẹp khi component unmount
    }, []);
    const images = ['../../../public/img/ads8.jpg',
        '../../../public/img/ads13.jpg',
        '../../../public/img/maxresdefault (1).jpg',
        '../../../public/img/ads10.png',
        '../../../public/img/banner1.jpg']
    const pickAds = (index) => {
        setActiveIndex(index)
    }
    return (
        <div className="banner">
            <div className="side">
                <div className="item">
                    <h2 
                    // onClick={()=>ViewCategories('c01')}
                    >Điện thoại</h2>
                    <div className="underline"></div>
                </div>
                <div className="item">
                    <h2 
                        // onClick={()=>ViewCategories('c02')}
                    >Laptop</h2>
                    <div className="underline"></div>
                </div>
                <div className="item">
                    <h2 
                        // onClick={()=>ViewCategories('c03')}
                    >Máy tính bảng</h2>
                    <div className="underline"></div>
                </div>
                <div className="item">
                    <h2 
                        // onClick={()=>ViewCategories('c04')}
                    >Đồng hồ thông minh</h2>
                    <div className="underline"></div>
                </div>
                <div className="item">
                    <h2 
                        // onClick={()=>ViewCategories('c05')}
                    >Phụ kiện</h2>
                    <div className="underline"></div>
                </div>
            </div>
            <div className="horizon"></div>
            <div className="ads">
                <img src={images[activeIndex]} alt="ADS" />
            </div>
            <div className="pagination">
                {Array.from({ length: 5 }).map((_, index) => (
                    <span
                        key={index}
                        className={`circle ${index === activeIndex ? "active" : ""}`}
                        onClick={() => pickAds(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
}