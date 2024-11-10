
export default function Header() {
    return( 
        <header className="h-20 bg-black text-white w-full flex justify-between items-center">
           <span className="px-6 text-2xl" >EXCLUSIVE</span>

            <span className="absolute left-1/2 transform -translate-x-1/2 space-x-4 text-xl ">
                <a>Homepage</a>
                <a className="underline decoration-solid">Product</a>
            </span>
        </header>
    )
}