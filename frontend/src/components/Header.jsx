
export default function Header({page}) {
    return( 
        <header className="h-20 bg-black text-white w-full flex justify-between items-center">
           <span className="px-6 text-2xl" >EXCLUSIVE</span>

            <span className="absolute left-1/2 transform -translate-x-1/2 space-x-4 text-xl ">
                <a className={page == "homepage" ? "underline decoration-solid" : null} href="http://localhost:5173/product-manage" >Homepage</a>
                <a className={page == "product" ? "underline decoration-solid" : null} href="http://localhost:5173/product-new">Product</a>
            </span>
        </header>
    )
}