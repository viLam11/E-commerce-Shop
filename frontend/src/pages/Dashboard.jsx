
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faArrowTrendDown } from "@fortawesome/free-solid-svg-icons";
export default function Dashboard() {
    return(
        <div className="flex flex-col min-h-screen">
            <Header role="admin" />
            <main className="flex-grow">
                    <div className="my-4 ml-10">
                        <span className="font-medium text-gray-500">Doanh số</span>
                    </div>

                    <div className="w-11/12 m-auto">
                        <div className="static flex space-betweeen space-x-10">
                            <div className="w-1/4 border border-black h-20 rounded-lg flex flex-col justify-center item pl-6">
                                <div className="text-sm " >Doanh thu trong tháng</div>
                                <div className="space-x-1" >
                                    <span className="text-2xl font-bold " >100.000.000 VND</span>
                                    <span>+11.02%</span>
                                    <span><FontAwesomeIcon icon={faArrowTrendUp} /></span>
                                    
                                </div>
                            </div>
                            <div className="w-1/4 border border-black h-20 rounded-lg"></div>
                            <div className="w-1/4 border border-black h-20 rounded-lg"></div>
                            <div className="w-1/4 border border-black h-20 rounded-lg"></div>
                        </div>
                    </div>
            </main>
            <Footer />
        </div>
    )
}