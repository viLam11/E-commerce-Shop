import { useState } from "react";
import DayPick from "../components/DayPick.jsx";


export default function FormContainDayPick() {
    const [selectedDate, setSelectedDate] = useState(null);
    return(
    <>
        <div>FORM HEADER</div>
        <div className="w-44">
            <span>{ selectedDate ? selectedDate.toLocaleDateString() : null}</span>
        </div>
        <div className="w-52">
            <DayPick selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
        
    </>
    )
}