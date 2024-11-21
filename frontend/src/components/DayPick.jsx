import { useState } from "react";
import {DayPicker} from "react-day-picker";
import "react-day-picker/style.css";

export default function DatePick({selectedDate, setSelectedDate}) {
    
    
    return(
        <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            // footer={
            //     selectedDate ? `Selected: ${selectedDate.toLocaleDateString()}` : "Pick a day."
            // }
        
        />
    )
}