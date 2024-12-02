import Header from "../components/Header";
import Footer from "../components/Footer";
import Promotion from "../components/Promotion";
import Pagination from "../components/Pagination";

export default function AllPromotion() {
    
    return(
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <div className="m-4 pl-12">
                    <spane className="text-grey-500">User / </spane>
                    <span className=" font-medium">All Promotion</span>
                </div>

                    <div className="w-11/12 m-auto text-sm">
                        <div className="grid grid-cols-3 gap-4 m-auto ">
                            <Promotion />
                            <Promotion />
                            <Promotion />
                            <Promotion />
                            <Promotion />
                            <Promotion />
                        </div>
                    </div>
                  
                    
                    <div className="h-24 flex justify-end items-end">
                        <div className="mb-10 mr-20 text-sm">  
                            <Pagination />
                        </div>
                    </div>
            </main>
            <Footer />
        </div>
    )
}