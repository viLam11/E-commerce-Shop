
export default function Header({ page, role }) {

    if (role == "admin") {
        return (
            <header className="h-16 bg-black text-white w-full">
                <div className="w-full h-full flex items-center">
                    <div className={"w-1/6 text-2xl font-bold tex-white flex justify-start pl-20"}>EXCLUSIVE</div>
                    <div className="menu w-4/6 justify-center text-center flex flex-row">
                        <ul className="flex flex-row space-x-9 text-lg items-center">
                            <li  className={`${page === "homepage" ? "border-b" : ""}`}>Trang chủ</li>
                            <li className={`${page === "revenue" ? "border-b" : null}`} >
                                <a href="/revenue">Doanh thu</a>
                                
                            </li>
                            <li className={`${page === "product-manage" ? "border-b" : null} w-20`}>
                                <a href="/product-manage">Quản lý sản phẩm</a>
                            </li>
                            <li className={`${page === "promotion-manage" ? "border-b" : null} w-24`}>Quản lý khuyến mãi</li>
                            <li className={`${page === "user-manage" ? "border-b" : null} w-24`}>Quản lý người dùng</li>
                        </ul>
                    </div>
                    <div className="w-1/6 flex justify-end pr-20">
                        <div className="flex flex-row space-x-2">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                </svg>

                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>

                            <span>

                            </span>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
    return (
        <header className="h-16 bg-black text-white w-full">
            <div className="w-full h-full flex items-center">
                <div className="w-1/6 text-2xl font-bold tex-white flex justify-start pl-20">EXCLUSIVE</div>
                <div className="menu w-4/6 justify-center text-center flex flex-row">
                    <ul className="flex flex-row space-x-9 text-lg items-center">
                        <li>Trang chủ</li>
                        <li>Mua sắm</li>
                        <li className="w-20">Liên hệ</li>
                        <li className="w-24">Đăng nhập</li>
                    </ul>
                </div>
                <div className="w-1/6 flex justify-end pr-20">
                    <div className="flex flex-row space-x-2">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>

                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>

                        <span>

                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}