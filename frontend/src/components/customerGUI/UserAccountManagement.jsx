import axios from "axios";
import bcrypt from 'bcryptjs'
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import "react-datepicker/dist/react-datepicker.css";
import { TextField, FormControl} from '@mui/material';
//import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import React, { createContext, useContext, useState, useEffect } from "react";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "../Footer";
import '../../design/users/acc.css'
//import { use } from "react";
//import { set } from "react-datepicker/dist/date_utils";
//import { set } from "react-datepicker/dist/date_utils";
// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);
const UserContext = createContext()
function formatToDDMMYYYY(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

const fixPrice = (price) =>{
    const format = String(price);
    let token = " VND";
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

const PieChart = ({chartData, total}) => {
  // Dữ liệu biểu đồ
  const rdata = chartData?chartData.map(i => i*100/total):[0,0,0,0,0]
  const data = {
    labels: ['Điện thoại', 'Laptop', 'Máy tính bảng', 'Đồng hồ thông minh', 'Phụ kiện'],
    datasets: [
      {
        data: rdata, // Tỉ lệ phần trăm
        backgroundColor: ['#1f77b4', '#aec7e8', '#2ca02c', '#ff7f0e', '#ffbb78'],
        borderWidth: 1,
      },
    ],
  };

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 8,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            let value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '250px'}}>
      <Pie data={data} options={options} />
    </div>
  );
};
// const theme = createTheme({
//     palette: {
//       primary: {
//         main: "#4caf50", // Màu chính (xanh lá)
//       },
//       secondary: {
//         main: "#ff5722", // Màu phụ (cam)
//       },
//     },
//     typography: {
//       fontFamily: "Roboto, Arial, sans-serif",
//     },
//   });
function Review({currentUser, product, closePopup}){
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [count, setCount] = useState(0);
    const [onColor, setOn] = useState([0,0,0,0,0])
    const [battery, setBattery] = useState("")
    const [speed, setSpeed] = useState("")
    const [tool, setTool] = useState("")
    const [service, setService] = useState("")
    const [myReview, setMine] = useState(null)
    const [isView, setView] = useState(true)
    useEffect(()=>{
        const fetchMyReview = async()=>{
            console.log(product.product_id + " " + currentUser.uid)
            try{
                const rreview = await axios.get(`http://localhost:8000/api/product/GetReview?product_id=${product.product_id}&limit=1000&page=0`)
                console.log(rreview)
                if (rreview.data.status != 200){
                    alert('Error')
                    throw new Error(rreview.data.msg)
                }
                else {
                    setMine(rreview.data.data.find(i => i.uid == currentUser.uid))
                    Coloring(rreview.data.data.find(i => i.uid == currentUser.uid).rating)
                }
            }
            catch(e){
                console.error(e.message)
            }
        }
        fetchMyReview()
    },[])

    const Coloring = (idx) => {
        const temp = onColor.map((_, index) => (index < idx ? 1 : 0));
        setOn(temp);
    };

    const [onColor1, setOn1] = useState([0,0,0,0,0])
    const Coloring1 = (idx) => {
      const temp = onColor1.map((_, index) => (index < idx ? 1 : 0));
      setOn1(temp);
    };

    const [onColor2, setOn2] = useState([0,0,0,0,0])
    const Coloring2 = (idx) => {
      const temp = onColor2.map((_, index) => (index < idx ? 1 : 0));
      setOn2(temp);
    };

    const [onColor3, setOn3] = useState([0,0,0,0,0])
    const Coloring3 = (idx) => {
      const temp = onColor3.map((_, index) => (index < idx ? 1 : 0));
      setOn3(temp);
    };
    const [onColor4, setOn4] = useState([0,0,0,0,0])
    const Coloring4 = (idx) => {
      const temp = onColor4.map((_, index) => (index < idx ? 1 : 0));
      setOn4(temp);
    };
    function hanldePostReview() {
        console.log("Rating: ", rating),
        console.log("Comment: ", (battery != ""?"Thời lượng pin: " + battery + '\n':"") + (speed != ""?"Tốc độ phản hồi: "+speed+'\n':"") + (tool != ""?"Tiện ích thông minh: "+tool+'\n':"") + (service != ""?"Dịch vụ đính kèm: "+service+'\n':"") + comment),
        axios.post(`http://localhost:8000/api/product/CreateReview/${product.product_id}`, {
            "uid": currentUser.uid,
            "rating": rating,
            "comment": (battery != ""?"Thời lượng pin: " + battery + '\n':"") + (speed != ""?"Tốc độ phản hồi: "+speed+'\n':"") + (tool != ""?"Tiện ích thông minh: "+tool+'\n':"") + (service != ""?"Dịch vụ đính kèm: "+service+'\n':"") + comment
        })
        .then((response) => {
            console.log("CHECK RESPONSE: " , response);

            if(response.status === 200) {
                alert("Đã thêm nhận xét");
                setCount(count + 1);        
            }
        })
        .catch((error) => {
            if (error.response.data) {
              //alert(error.response.data.msg);
              console.error(error.response.data)
            } else {
              console.error('Error:', error.message);
            }
          })
    
    }
    const handleChangeReview = async() => {
        console.log("Rating: ", rating),
        console.log("Comment: ", (battery != ""?"Thời lượng pin: " + battery + '\n':"") + (speed != ""?"Tốc độ phản hồi: "+speed+'\n':"") + (tool != ""?"Tiện ích thông minh: "+tool+'\n':"") + (service != ""?"Dịch vụ đính kèm: "+service+'\n':"") + comment),
        axios.put(`http://localhost:8000/api/product/UpdateReview/${product.product_id}`, {
            "uid": currentUser.uid,
            "rating": rating || 5,
            "comment": (battery != ""?"Thời lượng pin: " + battery + '\n':"") + (speed != ""?"Tốc độ phản hồi: "+speed+'\n':"") + (tool != ""?"Tiện ích thông minh: "+tool+'\n':"") + (service != ""?"Dịch vụ đính kèm: "+service+'\n':"") + comment
        })
        .then((response) => {
            console.log("CHECK RESPONSE: " , response);
            alert("Đã cập nhật nhận xét");
            //setIsPopupOpen(false);
            setView(true);
        })
        .catch((error) => {
            if (error.response.data) {
                //alert(error.response.data.msg);
                console.error(error.response.data)
            } else {
                console.error('Error:', error.message);
            }

        })
    }

    const switchToModify = (str) =>{
        let scrumb = str.split('\n')
        console.log("Scrumble: " + scrumb)
        for (const i of scrumb){
            let indexing = i.slice(i.indexOf(':')+1)
            if (i.includes("Thời lượng pin")) 
                Coloring1(indexing.includes("Rất mạnh")?5:
                (indexing.includes(" Mạnh")?4:
                (indexing.includes("Vừa đủ")?3:
                (indexing.includes(" Yếu")?2:1))))
            else if (i.includes("Tốc độ phản hồi")) 
                Coloring2(indexing.includes("Rất nhanh")?5:
                (indexing.includes("Nhanh")?4:
                (indexing.includes("Vừa đủ")?3:
                (indexing.includes("Chậm")?2:1))))
            else if (i.includes("Tiện ích thông minh")) 
                Coloring3(indexing.includes("Rất hiệu quả")?5:
                (indexing.includes("Tiện lợi")?4:
                (indexing.includes("Vừa đủ")?3:
                (indexing.includes("Tệ")?2:1))))
            else if (i.includes("Dịch vụ đính kèm")) 
                Coloring4(indexing.includes("Rất tốt")?5:
                (indexing.includes("Tốt")?4:
                (indexing.includes("Bình thường")?3:
                (indexing.includes("Kém")?2:1))))
            else setComment(i)
        }
    }
    if (isView)
    return(
        <>
       <div style={{
        overflowY: "scroll",
        height: "450px",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE & Edge
      }}>
        <style>
            {`
            div::-webkit-scrollbar {
                display: none; /* Chrome, Safari */
            }
                .closePopup {
                            padding: 10px 20px;
                            background-color: #ff4d4d;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                            margin-top: -10px;
                        }

                        .closePopup:hover {
                            background-color: #cc0000;
                        }
            `}
        </style>
            <div style={{display: "inline-flex"}}>
                <div><img style={{width: "100px"}} src={product.image[0]} alt="" /></div>
                <div style={{fontWeight: "bold", marginTop:"10px"}}>{product.pname}</div>
            </div>
            {myReview?
            <>
            <div style={{ display: "inline-flex", marginTop: "20px", gap: "70px", marginBottom: "20px" }}>
            {Array.from({ length: 5 }).map((_, idx) => (
                <div style={{alignItems: "center", justifyContent:"center", justifyItems:"center"}}>
                    <div
                        key={idx}
                        style={onColor[idx] === 1 ? { color: "yellow" } : { color: "gray" }}
                        >
                        <svg
                            height="20"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            fill="currentColor"
                        >
                            <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                        </svg>
                    </div>
                    <div style={{fontSize: "12px", width: "70px", marginTop:"10px"}}>{idx == 0?"Rất tệ":(idx==1?"Tệ":(idx==2?"Bình thường":(idx==3?"Tốt":"Tuyệt vời")))}</div>
                </div>
            ))}
            </div>
            <textarea className="comment border border-black w-full p-1"
                    value={myReview.comment}
                    style={{height: "100px", borderRadius:"8px", padding:"4px 8px 8px 8px", marginTop:"20px"}}
                >
                    
                </textarea>
            </>:
            <>
            <div style={{ display: "inline-flex", marginTop: "20px", gap: "70px", marginBottom: "20px" }}>
            {Array.from({ length: 5 }).map((_, idx) => (
                <div style={{alignItems: "center", justifyContent:"center", justifyItems:"center"}}>
                    <div
                        key={idx}
                        onMouseOver={() => {
                            Coloring(idx + 1);
                            setRating(idx + 1)
                        }}
                        style={onColor[idx] === 1 ? { color: "yellow" } : { color: "gray" }}
                        >
                        <svg
                            height="20"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            fill="currentColor"
                        >
                            <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                        </svg>
                    </div>
                    <div style={{fontSize: "12px", width: "70px", marginTop:"10px"}}>{idx == 0?"Rất tệ":(idx==1?"Tệ":(idx==2?"Bình thường":(idx==3?"Tốt":"Tuyệt vời")))}</div>
                </div>
            ))}
            </div>
            <div style={{height: "1px", backgroundColor:"#E5E5E5", border: "1px solid #E5E5E5", marginBottom:"30px", alignItems:"left"}}></div>
            <div>
                <div style={{textAlign:"left", fontSize:"16px", fontWeight:"bold", marginBottom: "20px"}}>Theo trải nghiệm</div>
                <div style={{display: "inline-flex", textAlign: "left", marginLeft:"-40px", marginBottom: "15px"}}>
                    <div style={{marginLeft: "-65px", marginRight:"285px", fontSize:"14px"}}>Thời lượng pin</div>
                    <div style={{ display: "inline-flex", gap: "20px" }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div style={{alignItems: "center", justifyContent:"center", justifyItems:"center"}}>
                            <div
                                key={idx}
                                onMouseOver={() => {
                                    Coloring1(idx + 1);
                                    setBattery(onColor1[4] == 1?"Rất mạnh":
                                        (onColor1[3]==1?"Mạnh":
                                        (onColor1[2]==1?"Vừa đủ":
                                        (onColor1[1]==1?"Yếu":
                                        (onColor1[0]==1?"Rất yếu":"")))))
                                    }}
                                style={onColor1[idx] === 1 ? { color: "yellow" } : { color: "gray" }}
                                >
                                <svg
                                    height="15"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                    fill="currentColor"
                                >
                                    <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                </svg>
                            </div>
                        </div>
                    ))}
                    </div>
                    <div style={onColor1[4] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-52px"}:
                        onColor1[3] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-29px"}:
                        onColor1[2] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-38px"}:
                        onColor1[1] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-19px"}:
                        onColor1[0] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-41px"}:
                        {textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"2px"}}>
                            {onColor1[4] == 1?"Rất mạnh":(onColor1[3]==1?"Mạnh":(onColor1[2]==1?"Vừa đủ":(onColor1[1]==1?"Yếu":(onColor1[0]==1?"Rất yếu":""))))}
                    </div>
                </div>
                <div style={{display: "inline-flex", textAlign: "left", marginLeft:"-20px"}}>
                    <div style={{marginLeft: "-132px", marginRight:"278px", fontSize:"14px"}}>Tốc độ phản hồi</div>
                    <div style={{ display: "inline-flex", gap: "20px", marginBottom: "20px" }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div style={{alignItems: "center", justifyContent:"center", justifyItems:"center"}}>
                            <div
                                key={idx}
                                onMouseOver={() =>{ 
                                    Coloring2(idx + 1);
                                    setSpeed(
                                        onColor2[4] == 1?"Rất nhanh":
                                        (onColor2[3]==1?"Nhanh":
                                        (onColor2[2]==1?"Vừa đủ":
                                        (onColor2[1]==1?"Chậm":
                                        (onColor2[0]==1?"Rất chậm":""))))
                                    )
                                }}
                                style={onColor2[idx] === 1 ? { color: "yellow" } : { color: "gray" }}
                                >
                                <svg
                                    height="15"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                    fill="currentColor"
                                >
                                    <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                </svg>
                            </div>
                        </div>
                    ))}
                    </div>
                    <div style={onColor2[4] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-102px"}:
                        onColor2[3] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-81px"}:
                        onColor2[2] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-86px"}:
                        onColor2[1] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-79px"}:
                        onColor2[0] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-101px"}:
                        {textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-42px"}}>
                            {onColor2[4] == 1?"Rất nhanh":(onColor2[3]==1?"Nhanh":(onColor2[2]==1?"Vừa đủ":(onColor2[1]==1?"Chậm":(onColor2[0]==1?"Rất chậm":""))))}
                    </div>
                </div>
                <div style={{display: "inline-flex", textAlign: "left", marginLeft:"-20px"}}>
                    <div style={{marginLeft: "-36px", marginRight:"253px", fontSize:"14px"}}>Tiện ích thông minh</div>
                    <div style={{ display: "inline-flex", gap: "20px", marginBottom: "20px" }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div style={{alignItems: "center", justifyContent:"center", justifyItems:"center"}}>
                            <div
                                key={idx}
                                onMouseOver={() => {
                                    Coloring3(idx + 1);
                                    setTool(onColor3[4] == 1?"Rất hữu ích":
                                        (onColor3[3]==1?"Tiện lợi":
                                        (onColor3[2]==1?"Vừa đủ":
                                        (onColor3[1]==1?"Tệ":
                                        (onColor3[0]==1?"Rất tệ":"")))))
                                }}
                                style={onColor3[idx] === 1 ? { color: "yellow" } : { color: "gray" }}
                                >
                                <svg
                                    height="15"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                    fill="currentColor"
                                >
                                    <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                </svg>
                            </div>
                        </div>
                    ))}
                    </div>
                    <div style={onColor3[4] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-15px"}:
                        onColor3[3] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"9px"}:
                        onColor3[2] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"10px"}:
                        onColor3[1] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"37px"}:
                        onColor3[0] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"19px"}:
                        {textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"52px"}}>
                            {onColor3[4] == 1?"Rất hữu ích":(onColor3[3]==1?"Tiện lợi":(onColor3[2]==1?"Vừa đủ":(onColor3[1]==1?"Tệ":(onColor3[0]==1?"Rất tệ":""))))}
                    </div>
                </div>
                <div style={{display: "inline-flex", textAlign: "left", marginLeft:"-20px"}}>
                    <div style={{marginLeft: "-36px", marginRight:"273px", fontSize:"14px"}}>Dịch vụ đính kèm</div>
                    <div style={{ display: "inline-flex", gap: "20px", marginBottom: "20px" }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div style={{alignItems: "center", justifyContent:"center", justifyItems:"center"}}>
                            <div
                                key={idx}
                                onMouseOver={() => {
                                    Coloring4(idx + 1);
                                    setService(
                                        onColor4[4] == 1?"Rất tốt":
                                        (onColor4[3]==1?"Tốt":
                                        (onColor4[2]==1?"Bình thường":
                                        (onColor4[1]==1?"Kém":
                                        (onColor4[0]==1?"Rất kém":""))))
                                    )
                                }}
                                style={onColor4[idx] === 1 ? { color: "yellow" } : { color: "gray" }}
                                >
                                <svg
                                    height="15"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                    fill="currentColor"
                                >
                                    <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                </svg>
                            </div>
                        </div>
                    ))}
                    </div>
                    <div style={onColor4[4] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"12px"}:
                        onColor4[3] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"31px"}:
                        onColor4[2] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-21px"}:
                        onColor4[1] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"25px"}:
                        onColor4[0] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"3px"}:
                        {textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"52px"}}>
                            {onColor4[4] == 1?"Rất tốt":(onColor4[3]==1?"Tốt":(onColor4[2]==1?"Bình thường":(onColor4[1]==1?"Kém":(onColor4[0]==1?"Rất kém":""))))}
                    </div>
                </div>
            </div>
            <textarea className="comment border border-black w-full p-1"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm"
                    style={{height: "100px", borderRadius:"8px", padding:"4px 8px 8px 8px", marginTop:"20px"}}
                >
                    
                </textarea>
            </>}
            
       </div>
       {myReview?
        <button style={{marginTop:"10px"}} className="closePopup" onClick={()=>{setView(false); switchToModify(myReview.comment)}}>
        Chỉnh sửa đánh giá
        </button>
       :
        <button style={{marginTop:"10px"}} className="closePopup" onClick={()=>{hanldePostReview();closePopup()}}>
        Thêm đánh giá
        </button>}
       </>
    )
    else{
        return (
            <>
            <div style={{
                overflowY: "scroll",
                height: "450px",
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE & Edge
            }}>
                <style>
                    {`
                    div::-webkit-scrollbar {
                        display: none; /* Chrome, Safari */
                    }
                        .closePopup {
                                    padding: 10px 20px;
                                    background-color: #ff4d4d;
                                    color: white;
                                    border: none;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    font-size: 16px;
                                    margin-top: -10px;
                                }

                                .closePopup:hover {
                                    background-color: #cc0000;
                                }
                    `}
                </style>
                    <div style={{display: "inline-flex"}}>
                        <div><img style={{width: "100px"}} src={product.image[0]} alt="" /></div>
                        <div style={{fontWeight: "bold", marginTop:"10px"}}>{product.pname}</div>
                    </div>
                    <div style={{ display: "inline-flex", marginTop: "20px", gap: "70px", marginBottom: "20px" }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div style={{alignItems: "center", justifyContent:"center", justifyItems:"center"}}>
                            <div
                                key={idx}
                                onMouseOver={() => {
                                    Coloring(idx + 1);
                                    setRating(idx + 1)
                                }}
                                style={onColor[idx] === 1 ? { color: "yellow" } : { color: "gray" }}
                                >
                                <svg
                                    height="20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                    fill="currentColor"
                                >
                                    <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                </svg>
                            </div>
                            <div style={{fontSize: "12px", width: "70px", marginTop:"10px"}}>{idx == 0?"Rất tệ":(idx==1?"Tệ":(idx==2?"Bình thường":(idx==3?"Tốt":"Tuyệt vời")))}</div>
                        </div>
                    ))}
                    </div>
                    <div style={{height: "1px", backgroundColor:"#E5E5E5", border: "1px solid #E5E5E5", marginBottom:"30px", alignItems:"left"}}></div>
                    <div>
                        <div style={{textAlign:"left", fontSize:"16px", fontWeight:"bold", marginBottom: "20px"}}>Theo trải nghiệm</div>
                        <div style={{display: "inline-flex", textAlign: "left", marginLeft:"-40px", marginBottom: "15px"}}>
                            <div style={{marginLeft: "-65px", marginRight:"285px", fontSize:"14px"}}>Thời lượng pin</div>
                            <div style={{ display: "inline-flex", gap: "20px" }}>
                            {Array.from({ length: 5 }).map((_, idx) => (
                                <div style={{alignItems: "center", justifyContent:"center", justifyItems:"center"}}>
                                    <div
                                        key={idx}
                                        onMouseOver={() => {
                                            Coloring1(idx + 1);
                                            setBattery(onColor1[4] == 1?"Rất mạnh":
                                                (onColor1[3]==1?"Mạnh":
                                                (onColor1[2]==1?"Vừa đủ":
                                                (onColor1[1]==1?"Yếu":
                                                (onColor1[0]==1?"Rất yếu":"")))))
                                            }}
                                        style={onColor1[idx] === 1 ? { color: "yellow" } : { color: "gray" }}
                                        >
                                        <svg
                                            height="15"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 576 512"
                                            fill="currentColor"
                                        >
                                            <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                        </svg>
                                    </div>
                                </div>
                            ))}
                            </div>
                            <div style={onColor1[4] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-52px"}:
                                onColor1[3] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-29px"}:
                                onColor1[2] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-38px"}:
                                onColor1[1] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-19px"}:
                                onColor1[0] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-41px"}:
                                {textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"2px"}}>
                                    {onColor1[4] == 1?"Rất mạnh":(onColor1[3]==1?"Mạnh":(onColor1[2]==1?"Vừa đủ":(onColor1[1]==1?"Yếu":(onColor1[0]==1?"Rất yếu":""))))}
                            </div>
                        </div>
                        <div style={{display: "inline-flex", textAlign: "left", marginLeft:"-20px"}}>
                            <div style={{marginLeft: "-132px", marginRight:"278px", fontSize:"14px"}}>Tốc độ phản hồi</div>
                            <div style={{ display: "inline-flex", gap: "20px", marginBottom: "20px" }}>
                            {Array.from({ length: 5 }).map((_, idx) => (
                                <div style={{alignItems: "center", justifyContent:"center", justifyItems:"center"}}>
                                    <div
                                        key={idx}
                                        onMouseOver={() =>{ 
                                            Coloring2(idx + 1);
                                            setSpeed(
                                                onColor2[4] == 1?"Rất nhanh":
                                                (onColor2[3]==1?"Nhanh":
                                                (onColor2[2]==1?"Vừa đủ":
                                                (onColor2[1]==1?"Chậm":
                                                (onColor2[0]==1?"Rất chậm":""))))
                                            )
                                        }}
                                        style={onColor2[idx] === 1 ? { color: "yellow" } : { color: "gray" }}
                                        >
                                        <svg
                                            height="15"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 576 512"
                                            fill="currentColor"
                                        >
                                            <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                        </svg>
                                    </div>
                                </div>
                            ))}
                            </div>
                            <div style={onColor2[4] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-102px"}:
                                onColor2[3] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-81px"}:
                                onColor2[2] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-86px"}:
                                onColor2[1] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-79px"}:
                                onColor2[0] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-101px"}:
                                {textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-42px"}}>
                                    {onColor2[4] == 1?"Rất nhanh":(onColor2[3]==1?"Nhanh":(onColor2[2]==1?"Vừa đủ":(onColor2[1]==1?"Chậm":(onColor2[0]==1?"Rất chậm":""))))}
                            </div>
                        </div>
                        <div style={{display: "inline-flex", textAlign: "left", marginLeft:"-20px"}}>
                            <div style={{marginLeft: "-36px", marginRight:"253px", fontSize:"14px"}}>Tiện ích thông minh</div>
                            <div style={{ display: "inline-flex", gap: "20px", marginBottom: "20px" }}>
                            {Array.from({ length: 5 }).map((_, idx) => (
                                <div style={{alignItems: "center", justifyContent:"center", justifyItems:"center"}}>
                                    <div
                                        key={idx}
                                        onMouseOver={() => {
                                            Coloring3(idx + 1);
                                            setTool(onColor3[4] == 1?"Rất hữu ích":
                                                (onColor3[3]==1?"Tiện lợi":
                                                (onColor3[2]==1?"Vừa đủ":
                                                (onColor3[1]==1?"Tệ":
                                                (onColor3[0]==1?"Rất tệ":"")))))
                                        }}
                                        style={onColor3[idx] === 1 ? { color: "yellow" } : { color: "gray" }}
                                        >
                                        <svg
                                            height="15"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 576 512"
                                            fill="currentColor"
                                        >
                                            <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                        </svg>
                                    </div>
                                </div>
                            ))}
                            </div>
                            <div style={onColor3[4] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-15px"}:
                                onColor3[3] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"9px"}:
                                onColor3[2] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"10px"}:
                                onColor3[1] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"37px"}:
                                onColor3[0] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"19px"}:
                                {textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"52px"}}>
                                    {onColor3[4] == 1?"Rất hữu ích":(onColor3[3]==1?"Tiện lợi":(onColor3[2]==1?"Vừa đủ":(onColor3[1]==1?"Tệ":(onColor3[0]==1?"Rất tệ":""))))}
                            </div>
                        </div>
                        <div style={{display: "inline-flex", textAlign: "left", marginLeft:"-20px"}}>
                            <div style={{marginLeft: "-36px", marginRight:"273px", fontSize:"14px"}}>Dịch vụ đính kèm</div>
                            <div style={{ display: "inline-flex", gap: "20px", marginBottom: "20px" }}>
                            {Array.from({ length: 5 }).map((_, idx) => (
                                <div style={{alignItems: "center", justifyContent:"center", justifyItems:"center"}}>
                                    <div
                                        key={idx}
                                        onMouseOver={() => {
                                            Coloring4(idx + 1);
                                            setService(
                                                onColor4[4] == 1?"Rất tốt":
                                                (onColor4[3]==1?"Tốt":
                                                (onColor4[2]==1?"Bình thường":
                                                (onColor4[1]==1?"Kém":
                                                (onColor4[0]==1?"Rất kém":""))))
                                            )
                                        }}
                                        style={onColor4[idx] === 1 ? { color: "yellow" } : { color: "gray" }}
                                        >
                                        <svg
                                            height="15"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 576 512"
                                            fill="currentColor"
                                        >
                                            <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                        </svg>
                                    </div>
                                </div>
                            ))}
                            </div>
                            <div style={onColor4[4] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"12px"}:
                                onColor4[3] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"31px"}:
                                onColor4[2] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"-21px"}:
                                onColor4[1] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"25px"}:
                                onColor4[0] == 1?{textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"3px"}:
                                {textAlign:"left", fontSize:"13px", marginTop: "-1px", marginLeft:"10px", marginRight:"52px"}}>
                                    {onColor4[4] == 1?"Rất tốt":(onColor4[3]==1?"Tốt":(onColor4[2]==1?"Bình thường":(onColor4[1]==1?"Kém":(onColor4[0]==1?"Rất kém":""))))}
                            </div>
                        </div>
                    </div>
                    <textarea className="comment border border-black w-full p-1"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm"
                            style={{height: "100px", borderRadius:"8px", padding:"4px 8px 8px 8px", marginTop:"20px"}}
                        >
                            
                        </textarea>
                    </div>
                    <button style={{marginTop:"10px"}} className="closePopup" onClick={handleChangeReview}>
                    Chỉnh sửa đánh giá
                    </button>
            </>
        )
    }
}

export function Notification(){
    const { active, setActive, currentUser, totalPaid, setPaid } = useContext(UserContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    // http://localhost:5173/user/info/notification?partnerCode=MOMO&orderId=order501&requestId=order501&amount=18560000&orderInfo=pay+with+MoMo&orderType=momo_wallet&transId=4276129825&resultCode=0&message=Th%C3%A0nh+c%C3%B4ng.&payType=credit&responseTime=1735010036989&extraData=&signature=3c83d0893f373caeaff7cf1a396a4b02abab589e57aa227a2de6a8bcf00cec5a
    const orderId = queryParams.get("orderId")
    const [currentOrder, setCurrent] = useState(null)
    const [toggle, setToggle] = useState(0)
    const [oid, setOid] = useState("")
    const [totalQuantity, setTotal] = useState(0)
    const [orderList, setList] = useState([])
    const [content, setContent] = useState("")
    const [notices, setNotices] = useState([])
    
    useEffect(()=>{
        try{
            const fetchOrder = async()=>{
                if (!orderId) return;
                try{
                    // const temp = await axios.get(`http://localhost:8000/api/order/getDetailOrder/${orderId}`)
                    // if (temp.status != 200){
                    //     return;
                    // }
                    // setCurrent(temp.data.data)
                    const doneTime = new Date().toISOString()
                    const updateState = await axios.put(`http://localhost:8000/api/order/UpdateOrder/${orderId}`, {done_time: doneTime})
                    console.log(orderId)
                    if (updateState.status != 200){
                        return;
                    }
                    //alert("Cập nhật trạng thái đơn hàng thành công")
                    setContent(`Đơn hàng ${orderId} đã được thanh toán thành công vào lúc ${formatToDDMMYYYY(doneTime)}`)
                }
                catch(err){
                    console.error("Error: ", err.message)
                }
            }
            
            fetchOrder()
            
        }
        catch(err){
            console.error("Error: ", err.message)
        }
    },[orderId])
    useEffect(()=>{
        const fetchData = async()=>{
            if(!orderId) return;
            const temp = await axios.post(`http://localhost:8000/api/notification/create?id=${currentUser.uid}`, {content: content, uid: currentUser.uid})
            console.log(temp)
            if (temp.status != 200){
                return;
            }
            //alert("Tạo thông báo thành công")
            setToggle(!toggle)
        }
        fetchData()
    },[content])
    
    useEffect(()=>{
        const fetchNoti = async()=>{
            try{
                const temp = await axios.get(`http://localhost:8000/api/notification/get?id=${currentUser.uid}`)
                if (temp.status != 200){
                    throw new Error("Lỗi khi lấy dữ liệu")
                }
                console.log(temp.data.data)
                setContent(temp.data.data.find(item => item.uid == currentUser.uid).content)   
                setOid(temp.data.data.find(item => item.uid == currentUser.uid).content.split(" ")[2]) 
                setNotices(temp.data.data.reverse()
                    .sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
            }
            catch(err){
                console.error("Error: ", err.message)
            }
        }
        fetchNoti()
    },[toggle])

    const hashOrderContent = (content) => {
        if (!content) return;
        return content.split("\n").map((item, idx) => <div key={idx} style={{color:"gray", fontSize:"14px"}}>{item}</div>)
    }


    return(<>
    <div className="profile-form" style={{boxShadow:"none", marginTop: "-30px", height:"500px"}}>
            <h2>Thông báo</h2>
            <div style={{overflowY: "scroll", height: "400px", scrollbarWidth: "none", msOverflowStyle: "none"}}>
            {notices.map((item, idx) =>{
                if (item.content.split(" ")[0] == "Đơn" && item.content.split(" ")[1] == "hàng"){
                    return (<>
                        <div key={idx} style={{display: "inline-flex", gap: "20px", marginTop: "20px", backgroundColor: "#F4F6E0", padding: "10px 20px 10px 10px", borderRadius: "10px", width:"600px"}}>
                            <div>
                            <img src="../../../public/img/EX (2).png" alt="" style={{width: "50px"}}/>
                            </div>
                            <div style={{marginTop: "5px"}}>
                            <div><span style={{fontSize: "16px", fontWeight:"bold", color: "red"}}>Đơn hàng:</span> {item.content.split(" ")[2]}</div>
                            {hashOrderContent(item.content)}
                            </div>
                            
                        </div>
                        <br/>
                        </>
                    )
                }
                else if(item.content.split(" ")[0] == "Mã"){
                    return (<>
                        <div key={idx} style={{display: "inline-flex", gap: "20px", marginTop: "20px", backgroundColor: "#F4F6E0", padding: "10px 20px 10px 10px", borderRadius: "10px", width:"600px"}}>
                            <div>
                            <img src="../../../public/img/vouchersx.png" alt="" style={{width: "60px", marginTop:"10px"}}/>
                            </div>
                            <div style={{marginTop: "5px"}}>
                            <div><span style={{fontSize: "16px", fontWeight:"bold", color: "red"}}>Mã giảm giá:</span> {item.content.split(" ")[0] + ' ' + item.content.split(" ")[1] +' ' +item.content.split(" ")[2]}</div>
                            {hashOrderContent(item.content)}
                            </div>
                        <div>
                        </div>
                        </div>
                        <br/>
                        </>
                    )
                }
                else{
                    return (<>
                        <div key={idx} style={{display: "inline-flex", gap: "20px", marginTop: "20px", backgroundColor: "#F4F6E0", padding: "10px 20px 10px 10px", borderRadius: "10px", width:"600px"}}>
                            <div>
                            <img src="../../../public/img/sys.png" alt="" style={{width: "50px"}}/>
                            </div>
                            <div style={{marginTop: "5px"}}>
                            <div><span style={{fontSize: "16px", fontWeight:"bold", color: "red"}}>Thông báo:</span> {item.content}</div>
                            </div>
                            
                        </div>
                        <br/>
                        </>
                    )
                }
            })}
            </div>
            
        </div>
    </>
        
    )
}

export function History(){
    const { active, setActive, currentUser, totalPaid, setPaid } = useContext(UserContext);
    const [count, setCnt] = useState(0)
    const [totalQuantity, setTotal] = useState(0)
    const [orderList, setList] = useState([])
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hook, setHook] = useState(0)
    const [curOrder, setCurrent] = useState(null)
    const [isdetail, setIsDetail] = useState(false)
    const [productData, setDataSet] = useState([])
    const [alertNote, setAlert] = useState("")
    const [isErr, setIsErr] = useState(false)
    const [isPopupAlert, setIsPopupAlert] = useState(false);
    const [content, setContent] = useState("")
        const openPopupAlert = () => {
            setIsPopupAlert(true);
        };
    
        const closePopupAlert = () => {
            setIsPopupAlert(false);
        };   
        useEffect(() => {
            let timer;
            if (isPopupAlert) {
              timer = setTimeout(() => {
                setIsPopupAlert(false);
              }, 3000); // Tự tắt sau 3 giây
            }
            return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount hoặc khi popup tắt
          }, [isPopupAlert]);
    useEffect(()=>{
        const fetchData = async() => {
            try{
                //console.log(localStorage.getItem('Squery') || "")
                const rdata = await axios.get(`http://localhost:8000/api/product/getAll?limit=1000`)
                //console.log(rdata)
                if (rdata.status != 200) throw new Error("Feth data fail")
                setDataSet(rdata.data.data)
            }
            catch(err){
                console.error("Error: ", err.message)
            }
        }
        fetchData()
    },[])
    useEffect(()=>{
        const fetchOrder = async()=>{
            const temp = await axios.get(`http://localhost:8000/api/order/getAllOrderByUser/${currentUser.uid}?limit=1000`)
            console.warn("Order: " + temp.data.data)
            if (temp.status != 200){
                throw new Error("Lỗi khi lấy dữ liệu")
            }
            setList(temp.data.data?temp.data.data:[])
        }
        fetchOrder()
    },[currentUser,content])
    useEffect(()=>{
        setPaid(orderList.reduce((sum, current) => sum + current.final_price, 0))
        setTotal(orderList.reduce((sum, current) => sum + current.quantity, 0))
    },[orderList])
    useEffect(()=>{
        setCnt(orderList.length)
    },[orderList])
    const [start, setStart] = useState(0); // Quản lý điểm bắt đầu
    const [end, setEnd] = useState(5); // Quản lý điểm kết thúc
    const handleNext = () => {
        //console.log("Next")
        setStart((prev) => Math.min(prev + 5, orderList.length - 1));
        setEnd((prev) => Math.min(prev + 5, orderList.length));
    };
    
    const handlePrevious = () => {
        //console.log("Prev")
        setStart((prev) => Math.max(prev - 5, 0));
        setEnd((prev) => Math.max(prev - 5, 5));
    };

    const [type, setType] =useState("")
    const [sortOrder, setSort] = useState(orderList)
    useEffect(()=>{
        setSort(orderList)
        let temp = [...orderList]
        if (type !== ''){
            temp = temp.filter(item => item.status == type)
            setSort(temp)
        }
        if (startDate && startDate !== ''){
            temp = temp.filter(item => item.create_time >= startDate)
            setSort(temp)
        }
        if (endDate && endDate !== ''){
            temp = temp.filter(item => item.done_time <= endDate)
            setSort(temp)
        }
    },[type, startDate, endDate, orderList])

    const [chartData, setData] = useState([0,0,0,0,0])
    useEffect(() => {
        const fetchOrderDetails = async () => {
            const tempChartData = [0, 0, 0, 0, 0];

            for (const order of orderList) {
                try {
                    const response = await axios.get(`http://localhost:8000/api/order/getDetailOrder/${order.oid}`);
                    if (response.data.status !== 200) {
                        console.error("Error fetching order details");
                        continue;
                    }

                    for (const item of response.data.data) {
                        switch (item.cate_id) {
                            case 'c01':
                                tempChartData[0] += item.quantity;
                                break;
                            case 'c02':
                                tempChartData[1] += item.quantity;
                                break;
                            case 'c03':
                                tempChartData[2] += item.quantity;
                                break;
                            case 'c04':
                                tempChartData[3] += item.quantity;
                                break;
                            case 'c05':
                                tempChartData[4] += item.quantity;
                                break;
                            default:
                                console.warn("Unknown category ID:", item.cate_id);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching order detail:", error.message);
                }
            }

            setData(tempChartData);
        };

        if (orderList.length > 0) {
            fetchOrderDetails();
        }
    }, [orderList]);
    const [orderDetail, setOrderDetail] = useState([])
    useEffect(()=>{
        const fetchDetail = async() =>{
            try{
                const response = await axios.get(`http://localhost:8000/api/order/getDetailOrder/${curOrder.oid}`)
                if (response.status !== 200){
                    throw new Error("Bug Data")
                }
                setOrderDetail(response.data.data)
            }
            catch(err){
                console.error("Error: " + err.message)
            }
        }
        fetchDetail()
    },[curOrder,active, content]) 
    const [isPopupOpen, setIsPopupOpen] = useState(false);
        const openPopup = () => {
            setIsPopupOpen(true);
        };
    
        const closePopup = () => {
            setIsPopupOpen(false);
        };   
    const [curProduct, setCur] = useState({})
    const [sortType, setSortType] = useState("none")
    const [sortDate, setSortDate] = useState("none")
    const [sortOrderz, setSortOrder] = useState("none")
    const handleSortDate = (type) => {
        let temp = [...sortOrder]
        if (type == "asc"){
            setSortDate("asc")
            temp.sort((a, b) => new Date(a.create_time) - new Date(b.create_time))
        }
        else{
            setSortDate("desc")
            temp.sort((a, b) => new Date(b.create_time) - new Date(a.create_time))
        }
        setSort(temp)
    }
    const handleSortOrder = (type) => {
        let temp = [...sortOrder]
        if (type == "asc"){
            setSortOrder("asc")
            temp.sort((a, b) => parseInt(a.oid.match(/\d+/)[0], 10) - parseInt(b.oid.match(/\d+/)[0], 10))
        }
        else{
            setSortOrder("desc")
            temp.sort((a, b) => parseInt(b.oid.match(/\d+/)[0], 10) - parseInt(a.oid.match(/\d+/)[0], 10))
        }

        setSort(temp)
    }

    useEffect(()=>{
        const fetchData = async()=>{
            if(!curOrder || !curOrder.oid) return;
            const temp = await axios.post(`http://localhost:8000/api/notification/create?id=${currentUser.uid}`, {content: content, uid: currentUser.uid})
            console.log(temp)
            if (temp.status != 200){
                return;
            }
            //alert("Tạo thông báo thành công")
            setToggle(!toggle)
        }
        fetchData()
    },[content])

    const handleSort = (type, field) => {
        let temp = [...sortOrder]
        if (type == "asc"){
            setSortType("asc")
            temp.sort((a, b) => a[field] - b[field])
        }
        else{
            setSortType("desc")
            temp.sort((a, b) => b[field] - a[field])
        }
        setSort(temp)
    }

    const handleCancel = async() =>{
        try{
            console.warn("Delete order: " + curOrder.oid)
            const onDelete = await axios.put(`http://localhost:8000/api/order/UpdateOrder/${curOrder.oid}`,{status: "Cancelled"})
            if (onDelete.data.status === 200) {
                setContent(`Đơn hàng ${curOrder.oid} đã hủy`)
                setAlert("Đã hủy đơn hàng")
                setIsErr(false)
                setIsPopupAlert(true)
            }
            else throw new Error("Failure")
        }
        catch(e){
            setAlert("Hủy đơn hàng thất bại")
            setIsErr(true)
            console.error(e.message)
            setIsPopupAlert(true)
        }
    }
    
    const handleComplete = async() =>{
        try{
            console.warn("Complete order: " + curOrder.oid)
            const onComplete = await axios.put(`http://localhost:8000/api/order/UpdateOrder/${curOrder.oid}`,{status: "Completed", done_time: new Date().toISOString()})
            if (onComplete.data.status === 200) {
                setContent(`Đơn hàng ${curOrder.oid} đã hoàn tất`)
                setAlert("Đã hoàn tất đơn hàng")
                setIsErr(false)
                setIsPopupAlert(true)
            }
            else throw new Error("Failure")
        }
        catch(e){
            console.error(e.message)
            setAlert("Hoàn tất đơn hàng thất bại")
            setIsErr(true)
            setIsPopupAlert(true)
        }
    }
    if (!isdetail){
        return(
            <div className="profile-form">
                <h2>Lịch sử mua hàng của khách hàng {currentUser.lname}</h2>
                <div className="statistics" style={{backgroundColor: "#A0C4FF", display:"inline-flex", width:"450px",height:"180px", borderRadius:"8px"}}>
                    <div style={{marginLeft:"-10px", width:"250px", paddingLeft: "30px", paddingTop: "30px"}}>
                        <div style={{fontFamily: "Roboto, san-serif", fontSize: "16px", fontWeight: "bold", marginBottom:"20px", color: "#F9F5F1", marginTop: "-10px"}}>Tổng chi tiêu</div>
                        <div style={{fontFamily: "Roboto, san-serif", fontSize: "24px", fontWeight: "bold"}}>{fixPrice(totalPaid)}</div>
                        <div style={{fontFamily: "Roboto, san-serif", fontSize: "14px", color: "#F9F5F1", marginBottom:"20px"}}>{totalQuantity} sản phẩm</div>
                        <div style={{fontFamily: "Roboto, san-serif", fontSize: "14px", color: "#F9F5F1"}}>Thẻ thành viên: {currentUser.ranking}</div>
                    </div>
                    <PieChart chartData={chartData} total={totalQuantity}/>
                </div>
                <br />
                <div style={{display: "inline-flex", gap: "40px", marginTop: "20px", height: "60px"}}>
                <FormControl fullWidth sx={{ marginBottom: 2 , height: "40px"}}>
                    <TextField
                        type="date"
                        label="Từ ngày"
                        variant="outlined"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                    </FormControl>
    
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <TextField
                        type="date"
                        label="Đến ngày"
                        variant="outlined"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                    </FormControl>
                </div>
                <div style={{width: "100%", gap:"20px", display:"inline-flex"}}>
                    <div className={`history-hook ${hook == 0?"hooked":""}`} onClick={()=>{setHook(0); setType("")}}>Tất cả</div>
                    <div className={`history-hook ${hook == 1?"hooked":""}`} onClick={()=>{setHook(1); setType("Pending")}}>Chờ xác nhận</div>
                    <div className={`history-hook ${hook == 2?"hooked":""}`} onClick={()=>{setHook(2); setType("Paid")}}>Đã xác nhận</div>
                    <div className={`history-hook ${hook == 3?"hooked":""}`} onClick={()=>{setHook(3); setType("Shipped")}}>Đang vận chuyển</div>
                    <div className={`history-hook ${hook == 4?"hooked":""}`} onClick={()=>{setHook(4); setType("Completed")}}>Đã giao hàng</div>
                    <div className={`history-hook ${hook == 5?"hooked":""}`} onClick={()=>{setHook(5);setType("Cancelled")}}>Đã hủy</div>
                </div>
                <div
                        style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 200px 250px 200px 250px",
                        backgroundColor: "#A0C4FF",
                        fontWeight: "bold",
                        padding: "10px",
                        textAlign: "center",
                        borderRadius: "8px",
                        width: "100%",
                        marginTop: "20px"
                        }}
                    >
                        <div onClick={() => handleSortOrder(sortOrderz == 'none'?'asc':(sortOrderz == 'asc'?'desc':'asc'))}>Mã đơn hàng <span>{sortOrderz == 'none'?' ═':(sortOrderz == 'asc'?' 🔼':' 🔽')}</span></div>
                        <div onClick={() => handleSortDate(sortDate == 'none'?'asc':(sortDate == 'asc'?'desc':'asc'))}>Thời gian đặt <span>{sortDate == 'none'?' ═':(sortDate == 'asc'?' 🔼':' 🔽')}</span></div>
                        <div onClick={() => handleSort(sortType == 'none'?'asc':(sortType == 'asc'?'desc':'asc'),'final_price')}>Tổng tiền <span>{sortType == 'none'?' ═':(sortType == 'asc'?' 🔼':' 🔽')}</span></div>
                        <div>Tình trạng</div>
                        <div></div>
                    </div>
                {sortOrder && sortOrder.length > 0 ? (
                        sortOrder.slice(start,end).map((item, index) => (
                        <div
                            key={index}
                            style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 200px 250px 200px 250px",
                            backgroundColor: index % 2 === 0 ? "#A0C4FF" : "#A0C4FF",
                            padding: "10px",
                            textAlign: "center",
                            marginTop: "20px",
                            borderRadius: "8px",
                            width: "100%",
                            height: "55px",
                            justifyContent: "center"
                            }}
                        >
                            <div style={{display: "inline-flex", alignItems:"center",marginLeft:"80px", justifyItems:"center", textAlign:"center"}}>{item.oid}</div>
                            <div style={{paddingTop: "5px",alignItems:"center"}}>{formatToDDMMYYYY(item.create_time)}</div>
                            <div style={{paddingTop: "5px",alignItems:"center"}}>{fixPrice(item.final_price)}</div>
                            <div style={{paddingTop: "5px"}}>{item.status}</div>
                            <div style={{paddingTop: "0px"}}>
                            {/* Lựa chọn button */}
                            <button style={{ padding: "5px 10px", border: "1px solid black", backgroundColor: "white", borderRadius:"6px" }} onClick={()=> {setIsDetail(!isdetail); setCurrent(item)}}>Chi tiết đơn hàng</button>
                            </div>
                        </div>
                        ))
                    ) : (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                        Không có đơn hàng nào.
                        </div>
                    )}
                    <style>
                        {
                            `.page-button {
                                display: flex;
                                justify-content: center;
                                margin-bottom: 40px;
                                margin-top: -20px;
                                align-items: center;
                            }
                            .page-button button {
                                width: 50px;
                                height: 50px;
                                align-items: center;
                                justify-content: center;
                                text-align: center;
                                background-color: white;
                                border: 1px solid gray;   
                                color: black;   
                                padding: 10px 20px;
                                text-align: center;
                                text-decoration: none;
                                display: inline-block;
                                font-size: 16px;
                                margin: 4px 2px;
                                cursor: pointer;
                                border-radius: 16px;
                                transition: background-color 0.3s ease, transform 0.3s ease;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            }
                            .page-button button:hover {
                                background-color: red;
                                color: white;
                                transform: translateY(-2px);
                            }
                            .page-button button:disabled {
                                background-color: #ccc;
                                cursor: not-allowed;
                            }
                            .page-button button svg {
                                vertical-align: middle;
                                width: 10px;
                                fill: currentColor;
                            }`
                        }
                    </style>
                    <div className="page-button" style={{marginTop: "20px", marginLeft: "820px"}}>
                        <button className="left" onClick={handlePrevious} disabled={start === 0}>
                        <svg enable-background="new 0 0 13 20" viewBox="0 0 13 20" x="0" y="0" class="shopee-svg-icon icon-arrow-left-bold"><polygon points="4.2 10 12.1 2.1 10 -.1 1 8.9 -.1 10 1 11 10 20 12.1 17.9"></polygon></svg>
                        </button>
                        <button className="right" onClick={handleNext} disabled={end === orderList.length}>
                        <svg enable-background="new 0 0 13 21" viewBox="0 0 13 21" x="0" y="0" class="shopee-svg-icon icon-arrow-right-bold"
                        fill="color"><polygon points="11.1 9.9 2.1 .9 -.1 3.1 7.9 11 -.1 18.9 2.1 21 11.1 12 12.1 11"></polygon></svg>
                        </button>
                    </div>
            </div>
        )
    }
    else{
        return (
            <div className="profile-form">
                {isPopupAlert && (
                        <div className="popup" onClick={closePopupAlert}>
                            <div className="popupContent" onClick={(e) => e.stopPropagation()} style={isErr == false?{width: "200px", height:"80px", backgroundColor:"rgba(0, 255, 0, 0.3)", color:"green"}:{width: "200px", height:"80px", backgroundColor:"rgba(255, 0, 0, 0.3)", color:"red"}}>
                                {isErr == false?
                                <>
                                    <div>&#9989;</div>
                                    <div>{alertNote}</div>
                                </>:
                                <>
                                    <div style={{marginTop: "-15px"}}>&#10060;</div>
                                    <div>{alertNote}</div>
                                </>}
                            </div>
                        </div>
                    )}
                <h2><span style={{color: "gray",fontWeight: "bold", cursor: "pointer"}} onClick={()=>setIsDetail(!isdetail)}>&#8592;</span>Chi tiết đơn hàng</h2>
                <div style={{marginLeft: "30px"}}>
                    <div style={{display: "inline-flex", marginBottom:"10px"}}>
                        <div style={{marginRight: "200px"}}>Mã đơn hàng: <strong>{curOrder?curOrder.oid:""}</strong></div>
                    {curOrder?(
                        curOrder.status == "Completed"?<div style={{backgroundColor: "rgba(0, 128, 0, 0.2)",color: "#FFC312" ,padding: "4px 4px 4px 4px", fontSize:"10px", borderRadius: "4px"}}>Đã giao hàng</div>:
                        curOrder.status == "Pending"?<div style={{backgroundColor:"rgba(255, 255, 0, 0.2)",color: "yellow" ,padding: "4px 4px 4px 4px",fontSize:"10px", borderRadius: "4px"}}>Đang chờ duyệt đơn</div>:
                        curOrder.status == "Cancelled"?<div style={{backgroundColor: "rgba(255, 0, 0, 0.2)",color: "red", padding: "4px 4px 4px 4px", fontSize:"10px", borderRadius: "4px" }}>Đã hủy</div>:""):<div style={{backgroundColor:"rgba(255, 255, 0, 0.2)",color: "yellow" ,padding: "4px 4px 4px 4px",fontSize:"10px", borderRadius: "4px"}}>Đang đang được giao</div>}
                    </div>
                    <div style={{marginBottom: "10px"}}>{formatToDDMMYYYY(curOrder.create_time)}</div>
                    <div>
                        {orderDetail?orderDetail.map((item, index)=>{
                            const product_ = productData.find(i => i.product_id == item.product_id)
                            return(
                                <div style={{display: "inline-flex", backgroundColor:"white", padding:"20px 30px 20px 30px", width: "80%", borderRadius: "8px", marginBottom: "10px", boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)"}}>
                                    <img src={product_.image[0]} style={{height: "100px"}}/>
                                    <div style={{marginLeft: "120px"}}>
                                        <div style={{marginBottom:"30px", color:"#448AFF"}}>{product_.pname}</div>
                                        {/* <div style={{marginLeft: "360px", marginBottom: "10px", color: "#FF005A"}}>Số lượng: {item.quantity}</div> */}
                                        {curOrder.status == "Completed"?<div style={{marginLeft: "460px",border: "1px solid red", textAlign: "center", padding: "4px 4px 4px 4px", borderRadius: "6px",color: "#FF005A", cursor:"pointer", marginTop:"60px"}} onClick={()=>{setCur(product_); openPopup()}}>Đánh giá</div>:null}
                                    </div>
                                </div>
                            )
                        }):null}
                    </div>
                    <style>{`
                        .btn-css{
                            padding: 5px;
                            border: 1px solid #C0C0C0;
                            background-color: #F7FFF7;
                            border-radius: 8px;
                            cursor: pointer;
                        }
                        .btn-css:hover{
                            background-color: #D32F2F;
                            color: #F7FFF7;
                        }
                        .openPopup {
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                        }

                        .openPopup:hover {
                            background-color: #0056b3;
                        }

                        .popup {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.5);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 9999;
                        }

                        .popupContent {
                            background: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            text-align: center;
                            width: 300px;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        }

                        .closePopup {
                            padding: 10px 20px;
                            background-color: #ff4d4d;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                            margin-top: -10px;
                        }

                        .closePopup:hover {
                            background-color: #cc0000;
                        }
                        .cancel-order{
                            background-color: white;
                            color: red;
                            border: 1px solid red;
                            border-radius: 8px;
                            width: 160px;
                            text-align: center;
                            padding: 6px;
                            margin-left: 750px;
                            margin-top: 40px;
                            cursor: pointer
                        }
                         .cancel-order:hover{
                            background-color: red;
                            color: white;
                            border: 1px solid red;
                            border-radius: 8px
                        }   
                    `}
                    </style>
                    {isPopupOpen && (
                        <div className="popup" onClick={closePopup}>
                            <div className="popupContent" onClick={(e) => e.stopPropagation()} style={{width: "700px", height:"600px"}}>
                                <h2 style={{backgroundColor: "#E5E5E5", marginLeft: "-20px", padding: "10px 0px 10px 0px", width:"700px", marginTop:"-20px", borderRadius: "8px 8px 0px 0px"}}>Đánh giá và nhận xét</h2>
                                <Review currentUser={currentUser} product={curProduct} closePopup={closePopup} />
                            </div>
                        </div>
                    )}
                    <div style={{marginBottom:"40px"}}></div>
                    <div style={{backgroundColor:"white", padding:"20px 30px 20px 30px", width: "80%", borderRadius: "8px", marginBottom: "10px", boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)"}}>
                        <div style={{fontFamily: "Roboto, san-serif", fontSize:"20px", fontWeight:"bold", marginBottom: "20px"}}><span style={{fontSize: "24px"}}>&#128179;</span> Thông tin thanh toán</div>
                        <div style={{marginBottom: "10px"}}>Tổng tiền sản phẩm: <span style={{textAlign: "right", marginLeft: "400px", width: "200px"}}>{fixPrice(curOrder.total_price)}</span></div>
                        <div style={{marginBottom: "10px"}}>Giảm giá: <span style={{textAlign: "right", marginLeft: "485px", width: "200px"}}>{fixPrice(curOrder.total_price - curOrder.final_price +curOrder.shipping_fee)}</span></div>
                        <div style={{marginBottom: "10px"}}>Phí vận chuyển: <span style={{textAlign: "right", marginLeft: "440px", width: "200px"}}>{curOrder.shipping_fee != 0? fixPrice(curOrder.shipping_fee):"Free"}</span></div>
                        <div style={{height: "1px", backgroundColor:"gray", border: "1px solid gray", marginBottom: "10px", width: "640px"}}></div>
                        <div style={{marginBottom: "10px"}}>Phải thanh toán: <span style={{textAlign: "right", marginLeft: "429px", width: "200px", fontWeight:"bold"}}>{fixPrice(curOrder.total_price)}</span></div>
                        <div style={{marginBottom: "10px"}}>Đã thanh toán: <span style={{ color: "yellowgreen", textAlign: "right", marginLeft: "440px", width: "200px", fontWeight: "bold"}}>{curOrder.done_time || curOrder.status =='Completed'?fixPrice(curOrder.total_price): '0 VND'}</span></div>
                    </div>
                </div>
                <div style={{display: "inline-flex"}}>
                    {curOrder.status == "Completed"?null:<>
                        <div className="cancel-order" onClick={handleCancel}>Hủy đơn hàng</div>
                        <div className="cancel-order" onClick={handleComplete} style={{marginLeft:"-850px"}}>Xác nhận nhận hàng</div>
                    </>}
                </div>
            </div>
        )
    }
}

export function Ranking(){
    const { active, setActive, currentUser, totalPaid, phone1, setPaid } = useContext(UserContext);
    const [isEncode, setEncode] = useState(false)
    const [progress, setProgress] = useState(totalPaid < 5000000?(totalPaid)/50000:(totalPaid < 20000000?(totalPaid)/200000:100));
    const [Pnumber, setPhone] = useState([])
    const [orderList, setList] = useState([])
    useEffect(()=>{
        const fetchOrder = async()=>{
            const temp = await axios.get(`http://localhost:8000/api/order/getAllOrderByUser/${currentUser.uid}?limit=1000`)
            console.warn("Order: " + temp.data.data)
            if (temp.status != 200){
                throw new Error("Lỗi khi lấy dữ liệu")
            }
            setList(temp.data.data?temp.data.data.filter(i => i.status == 'Completed'):[])
        }
        fetchOrder()
    },[currentUser])
    useEffect(()=>{
        setPaid(orderList.reduce((sum, current) => sum + current.final_price, 0))
    },[orderList])
    useEffect(() => {
        const fetchPhone = async () => {
            console.log(currentUser.uid)
            let rphone = [];
            const res = await axios.get(`http://localhost:8000/api/user/GetPhone/${currentUser.uid}`)
            //console.log(res)
            if (res.status != 200) throw new Error("Error while fetching phone number")
            rphone = res.data.data?res.data.data: []
            setPhone(rphone&& rphone.length>0?rphone.map(item => item.phone):[]); // Update images state once all images are fetched
        };

        fetchPhone();
    }, [currentUser]);
    const Encode = (item) =>{
        if(isEncode){
            let encode = item.slice(0,2)
            for (let i = 2; i < item.length - 2; i++)
                encode += '*'
            return encode + item.slice(item.length - 2)
        }
        return item
    }
    return(
        <div className="profile-form" style={{boxShadow:"none", marginTop: "-30px"}}>
            <h2>Hạng của khách hàng</h2>
            <style>
                {`
                /* Container chứa thanh tiến trình */
                .progress-container {
                position: relative;
                width: 100%;
                height: 20px;
                display: flex;
                align-items: center;
                }

                /* Đường track xám */
                .progress-track {
                position: absolute;
                width: 100%;
                height: 10px;
                background-color: #aaa;
                border-radius: 5px;
                z-index: 1;
                }

                /* Phần đã hoàn thành màu đỏ */
                .progress-bar {
                position: absolute;
                height: 10px;
                background-color: red;
                border-radius: 5px;
                z-index: 2;
                }

                /* Hình tròn trượt trên thanh */
                .progress-circle {
                position: absolute;
                width: 20px;
                height: 20px;
                background-color: red;
                border-radius: 50%;
                top: -5px; /* Đẩy hình tròn lên giữa thanh */
                z-index: 3;
                }

                /* Lá cờ ở cuối thanh */
                .progress-flag {
                position: absolute;
                right: 0;
                top: -15px;
                width: 20px;
                height: 20px;
                background: red;
                clip-path: polygon(0 0, 100% 50%, 0 100%, 10% 50%);
                z-index: 3;
                }
                `}
            </style>
            <div style={{display: "inline-flex"}}>
                <div style={{marginRight: "20px"}}><img style={{width: "100px", borderRadius:"50px"}} src="../../../public/img/EX.png" alt="" /></div>
                <div>
                    <div style={{fontSize: "18px", fontWeight:"bold",marginBottom:"5px"}}>{currentUser.username.toUpperCase()}</div>
                    <div style={{fontSize: "14px",marginBottom:"10px"}}>{Encode(Pnumber[0])} {!isEncode?<span onClick={()=>setEncode(!isEncode)}>&#128065;</span>:<span onClick={()=>setEncode(!isEncode)}>&#128065;&#65039;&#8205;&#128488;</span>}</div>
                    <div style={{
                    fontSize: "14px",
                    marginBottom: "5px",
                    border: `1px solid ${
                        totalPaid < 5000000 ? "silver" : totalPaid < 20000000 ? "gold" : "blue"
                    }`,
                    textAlign: "center",
                    width: "80px",
                    backgroundColor: `${
                        totalPaid < 5000000 ? "rgba(192, 192, 192, 0.5)" : totalPaid < 20000000 ? "rgba(255, 215, 0, 0.5)" : "rgba(135, 206, 235, 0.5)"
                    }`,
                    borderRadius: "6px"
                    }}>{totalPaid < 5000000?"silver":(totalPaid < 20000000?"gold":"diamond")}</div>
                </div>
            </div>
            <div style={{width: "80%", marginBottom: "20px"}}><img style={{borderRadius: "10px"}} src={totalPaid < 5000000?"../../../public/img/silver.png":(totalPaid < 20000000?"../../../public/img/gold.png":"../../../public/img/diamond.png")} alt="" /></div>
            <div style={{width: "75%",boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.3)", padding: "8px 8px 8px 8px", borderRadius: "10px"}}>
                <div style={{display: "inline-flex", marginBottom: "30px"}}>
                    <div>
                        <div style={{fontSize: "16px", fontWeight:"bold",marginBottom:"1px"}}>{currentUser.username}</div>
                        <div style={{fontSize: "20px", fontWeight:"bold", color: "red",marginBottom:"0px"}}>{fixPrice(totalPaid)}</div>
                        <div style={{fontSize: "12px", fontWeight:"bold", color: "red"}}>(Tích lũy mua sắm)</div>
                    </div>
                    <div style={{ marginLeft:"600px"}}>
                        <img style={{width:"50px", marginBottom:"2px"}} src={totalPaid < 5000000?"../../../public/img/2.png":(totalPaid < 20000000?"../../../public/img/1.png":"../../../public/img/3.png")} alt="" />
                        <div style={{fontSize: "16px", fontWeight:"bold", color: "red",marginBottom:"0px", textAlign:"center"}}>{totalPaid < 5000000?"silver":(totalPaid < 20000000?"gold":"diamond")}</div>
                    </div>
                </div>
                <div className="progress-container" style={{width: "90%", alignItems:"center", alignContent:"center", justifyItems:"center", marginLeft:"40px"}}>
                <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                ></div>
                <div
                    className="progress-circle"
                    style={{ left: `calc(${totalPaid < 5000000?totalPaid/50000:(totalPaid < 20000000?totalPaid/200000:100)}% - 10px)` , marginTop:"5px"}} // Điều chỉnh hình tròn theo tiến trình
                >
                    <img src="../../../public/img/chibi.png" alt="" style={{ left: `calc(${progress}% - 10px)` , marginTop:"-25px", width:"50px"}}/>
                </div>
                
                
                {/* <div className="progress-flag">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADnSURBVHgB7dQ7CsJAFIXhMyGDBEUsLC1S2OgG3IVgLRYuwY34ALW2DhauwMcKxE5sAiJYJCIBQ5Q8xmhrBpKQBIT8zcDc4oPhMkBAk7mijmfKBgkn8gYVQ5OfjeoAMSIuUwun2yo0VnzcZcIwRBxMwNQ/fjABKURAlkH3aWBnetR3yAZja94kcUwAWfBm3AWxXy60q4moaYZ1QFTM8xgs00bUSqLYh+OMgmZpLEibN0gcI0Br7/8JyAJjgFSmtIMssC/IWDfonrsger25lSjtIW6OEx77VLOsCxIslWfMsRzLsRz7c+wNLD45oCEwMZoAAAAASUVORK5CYII=" alt="cps-flag"/>
                </div> */}
                <div className="progress-track"></div>
                <img style={{marginLeft:"745px", marginTop:"-20px"}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADnSURBVHgB7dQ7CsJAFIXhMyGDBEUsLC1S2OgG3IVgLRYuwY34ALW2DhauwMcKxE5sAiJYJCIBQ5Q8xmhrBpKQBIT8zcDc4oPhMkBAk7mijmfKBgkn8gYVQ5OfjeoAMSIuUwun2yo0VnzcZcIwRBxMwNQ/fjABKURAlkH3aWBnetR3yAZja94kcUwAWfBm3AWxXy60q4moaYZ1QFTM8xgs00bUSqLYh+OMgmZpLEibN0gcI0Br7/8JyAJjgFSmtIMssC/IWDfonrsger25lSjtIW6OEx77VLOsCxIslWfMsRzLsRz7c+wNLD45oCEwMZoAAAAASUVORK5CYII=" alt="cps-flag"/>
                
                </div>
                {totalPaid < 5000000?<div style={{textAlign:"center", marginTop:"20px"}}>Bạn cần mua thêm <span style={{fontWeight: "bold"}}>{fixPrice(5000000 - totalPaid)}</span> để lên hạng Gold</div>:
                (totalPaid < 20000000?<div style={{textAlign:"center", marginTop:"20px"}}>Bạn cần mua thêm <span style={{fontWeight: "bold"}}>{fixPrice(20000000 - totalPaid)}</span> để lên hạng Diamond</div>:
                <div style={{textAlign:"center", marginTop:"20px"}}>Chúc mừng bạn đã đạt hạng <span style={{fontWeight: "bold"}}>Diamond</span> - hạng cao nhất của sàn</div>)}
            </div>
        </div>
    )
}

export function UpdatePassword(){
    const { active, setActive, currentUser } = useContext(UserContext);
    const [pass, setPass] = useState({
        old_pass: "",
        new_pass: "",
        confirm_pass: ""
    })

    const navigate = useNavigate()
    const [Err, setErr] = useState("")
    const [isPopupOpen, setIsPopupOpen] = useState(false);
        const openPopup = () => {
            setIsPopupOpen(true);
        };
    
        const closePopup = () => {
            setIsPopupOpen(false);
        };   
        useEffect(() => {
            let timer;
            if (isPopupOpen) {
              timer = setTimeout(() => {
                setIsPopupOpen(false);
              }, 3000); // Tự tắt sau 3 giây
            }
            return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount hoặc khi popup tắt
          }, [isPopupOpen]);

    const handleSubmit = async() => {
        const isMatch = await bcrypt.compare(pass.old_pass, currentUser.upassword);
        if (!isMatch) {
            //alert('Mật khẩu hiện tại không đúng. Khách hàng vui lòng nhập lại');
            setErr('Mật khẩu hiện tại đã sai.\nVui lòng nhập lại')
        } else {
            //alert('Mật khẩu hợp lệ');
            if(pass.new_pass.length < 5){
                //alert('Vui lòng nhập mật khẩu có từ 5 kí tự')
                setErr('Vui lòng nhập mật khẩu có từ 5 kí tự')
            }
            else if (pass.new_pass != pass.confirm_pass){
                setErr('Mật khẩu mới không trùng khớp')
            }
            else{
                const hashPw = await bcrypt.hash(pass.new_pass, 12);
                const addPhone = await axios.put(`http://localhost:8000/api/user/update-user/${currentUser.uid}`,{upassword: hashPw})
                if (addPhone.status != 200){
                    setErr('Thay đổi mật khẩu thất bại')
                }
                else{
                    setErr("")
                    setPass({
                        old_pass: "",
                        new_pass: "",
                        confirm_pass: ""
                    })
                }
            }
        }
        setIsPopupOpen(true)
    }
    return (
        <div className="profile-form">
            <style>{`
                        .btn-css{
                            padding: 5px;
                            border: 1px solid #C0C0C0;
                            background-color: #F7FFF7;
                            border-radius: 8px;
                            cursor: pointer;
                        }
                        .btn-css:hover{
                            background-color: #D32F2F;
                            color: #F7FFF7;
                        }
                        .openPopup {
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                        }

                        .openPopup:hover {
                            background-color: #0056b3;
                        }

                        .popup {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 9999;
                        }

                        .popupContent {
                            background: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            text-align: center;
                            width: 300px;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        }

                        .closePopup {
                            padding: 10px 20px;
                            background-color: #ff4d4d;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                            margin-top: -10px;
                        }

                        .closePopup:hover {
                            background-color: #cc0000;
                        }
                    `}
                    </style>
                {isPopupOpen && (
                        <div className="popup" onClick={closePopup}>
                            <div className="popupContent" onClick={(e) => e.stopPropagation()} style={Err == ""?{width: "200px", height:"80px", backgroundColor:"rgba(0, 255, 0, 0.3)", color:"green"}:{width: "200px", height:"80px", backgroundColor:"rgba(255, 0, 0, 0.3)", color:"red"}}>
                                {Err == ""?
                                <>
                                    <div>&#9989;</div>
                                    <div>Cập nhật thành công</div>
                                </>:
                                <>
                                    <div style={{marginTop: "-15px"}}>&#10060;</div>
                                    <div>{Err}</div>
                                </>}
                            </div>
                        </div>
                    )}
            <h2><span style={{color: "gray",fontWeight: "bold", cursor: "pointer"}} onClick={()=>{setActive(1); navigate('/user/info')}}>&#8592;</span> Thay đổi mật khẩu</h2>
            <div className="form-group">
                <input type="password" className="full-width" placeholder="Mật khẩu hiện tại" value={pass.old_pass} onChange={(e) => setPass((prev) => ({...prev, old_pass: e.target.value}))}/>
            </div>
            <div className="form-group">
                <input type="password" className="full-width" placeholder="Mật khẩu mới" value={pass.new_pass} onChange={(e) => setPass((prev) => ({...prev, new_pass: e.target.value}))}/>
            </div>
            <div className="form-group">
                <input type="password" className="full-width" placeholder="Nhập lại mật khẩu mới"value={pass.confirm_pass} onChange={(e) => setPass((prev) => ({...prev, confirm_pass: e.target.value}))}/>
            </div>        
            <div className="form-actions">
                <button className="btn-cancel">Hủy</button>
                <button className="btn-save" onClick={handleSubmit}>Thay đổi mật khẩu</button>
            </div>    
        </div>
    )
}

export function UpdatePhone(){
    const { active, setActive, currentUser, setPhone1 } = useContext(UserContext);
    const [phone, setVal] = useState("")
    const navigate = useNavigate()
    const [Pnumber, setPhone] = useState([])
    const [toggle, setToggle] = useState(1)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [Err, setErr] = useState("")
        const openPopup = () => {
            setIsPopupOpen(true);
        };
    
        const closePopup = () => {
            setIsPopupOpen(false);
        };   
        useEffect(() => {
            let timer;
            if (isPopupOpen) {
              timer = setTimeout(() => {
                setIsPopupOpen(false);
              }, 3000); // Tự tắt sau 3 giây
            }
            return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount hoặc khi popup tắt
          }, [isPopupOpen]);
    useEffect(() => {
        const fetchPhone = async () => {
            console.log(currentUser.uid)
            let rphone = [];
            const res = await axios.get(`http://localhost:8000/api/user/GetPhone/${currentUser.uid}`)
            //console.log(res)
            if (res.status != 200) throw new Error("Error while fetching phone number")
            rphone = res.data.data?res.data.data: []
            setPhone(rphone&& rphone.length>0?rphone.map(item => item.phone):[]); // Update images state once all images are fetched
        };

        fetchPhone();
    }, [currentUser, toggle]);

    useEffect(()=>{
        setPhone1(Pnumber[0] || "")
    },[Pnumber])

    const handleSubmit = async() => {
        //alert(phone)
        if(!phone || phone == ""){
            setErr('Vui lòng nhập đầy đủ thông tin')
        }
        else{
            const addPhone = await axios.post(`http://localhost:8000/api/user/CreatePhone/${currentUser.uid}`,{phone: [phone]})
            if (addPhone.status != 200){
                setErr('Thêm số điện thoại thất bại')
            }
            else{
                //set('Thêm số điện thoại thành công')
                setVal("")
                setToggle(!toggle)
                setErr("")
            }
        }
        setIsPopupOpen(true)
    }

    const handleRemove = async(index) => {
        if(!Pnumber[index] || Pnumber[index] == ""){
            setErr('Vui lòng nhập đầy đủ thông tin')
        }
        else{
            const addPhone = await axios.post(`http://localhost:8000/api/user/DeletePhone/${currentUser.uid}`,{phone: Pnumber[index]})
            if (addPhone.status != 200){
                setErr('Xóa số điện thoại thất bại')
            }
            else{
                //alert('Xóa số điện thoại thành công')
                setToggle(!toggle)
                setErr("")
            }
        }
        setIsPopupOpen(true)
    }
    return(
        <div className="profile-form">
            <style>{`
                        .btn-css{
                            padding: 5px;
                            border: 1px solid #C0C0C0;
                            background-color: #F7FFF7;
                            border-radius: 8px;
                            cursor: pointer;
                        }
                        .btn-css:hover{
                            background-color: #D32F2F;
                            color: #F7FFF7;
                        }
                        .openPopup {
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                        }

                        .openPopup:hover {
                            background-color: #0056b3;
                        }

                        .popup {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 9999;
                        }

                        .popupContent {
                            background: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            text-align: center;
                            width: 300px;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        }

                        .closePopup {
                            padding: 10px 20px;
                            background-color: #ff4d4d;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                            margin-top: -10px;
                        }

                        .closePopup:hover {
                            background-color: #cc0000;
                        }
                    `}
                    </style>
                {isPopupOpen && (
                        <div className="popup" onClick={closePopup}>
                            <div className="popupContent" onClick={(e) => e.stopPropagation()} style={Err == ""?{width: "200px", height:"80px", backgroundColor:"rgba(0, 255, 0, 0.3)", color:"green"}:{width: "200px", height:"80px", backgroundColor:"rgba(255, 0, 0, 0.3)", color:"red"}}>
                                {Err == ""?
                                <>
                                    <div>&#9989;</div>
                                    <div>Cập nhật thành công</div>
                                </>:
                                <>
                                    <div style={{marginTop: "-15px"}}>&#10060;</div>
                                    <div>{Err}</div>
                                </>}
                            </div>
                        </div>
                    )}
                <h2><span style={{color: "gray",fontWeight: "bold", cursor: "pointer"}} onClick={()=>{setActive(1); navigate('/user/info')}}>&#8592;</span> Thông tin địa chỉ</h2>
                <table className="address-table">
                    <thead>
                        <th>STT</th>
                        <th>Số điện thoại</th>
                        <th style={{width: "40px"}}>Chỉnh sửa</th>
                    </thead>
                    <tbody>
                        {Pnumber&& Pnumber.length>0?
                        Pnumber.map((p, index)=>{
                            //console.log(Pnumber)
                            return(
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{p}</td>
                                    <td style={{display: "inline-flex", width: "60px"}}><button onClick={() => handleRemove(index)} style={{color: "white",backgroundColor: "red"}}>Xóa</button></td> {/* Close button */}
                                </tr>
                            )
                            
                        }):null}
                    </tbody>
                </table>
                {!Pnumber || Pnumber.length <= 0?<div style={{marginBottom: "10px", marginTop: "-14px"}}>Khách hàng hiện chưa cập nhật số điện thoại</div>:null}
                <div className="form-group">
                    <div className="full-width">
                        <label htmlFor="phone">Nhập số điện thoại</label>
                        <input type="text" id="phone" value={phone} onChange={(e) => setVal(e.target.value)}/>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button className="btn-cancel">Hủy</button>
                    <button className="btn-save" onClick={handleSubmit}>Thêm số điện thoại</button>
                </div>
            </div>
    )
}

export function UpdateAdress(){
    const { active, setActive, currentUser } = useContext(UserContext);
    const [address, setVal] = useState({
        province: "",
        city: "",
        district: "",
        street: "",
        isdefault: false
    })
    const navigate = useNavigate()
    const [toggle, setToggle] = useState(1)
    const [defAdress, setAddress] = useState([])
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [Err, setErr] = useState("")
        const openPopup = () => {
            setIsPopupOpen(true);
        };
    
        const closePopup = () => {
            setIsPopupOpen(false);
        };   
        useEffect(() => {
            let timer;
            if (isPopupOpen) {
              timer = setTimeout(() => {
                setIsPopupOpen(false);
              }, 3000); // Tự tắt sau 3 giây
            }
            return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount hoặc khi popup tắt
          }, [isPopupOpen]);
    useEffect(() => {
        const fetchAdress = async () => {
            console.log(currentUser.uid)
            let adress = [];
            const res = await axios.get(`http://localhost:8000/api/user/GetAll/${currentUser.uid}`)
            //console.log(res)
            if (res.status != 200) throw new Error("Error while fetching address")
            adress = res.data.data?res.data.data: []
            setAddress(adress); // Update images state once all images are fetched
        };

        fetchAdress();
        console.log(defAdress)
    }, [currentUser, toggle]);
    const sample = ['57 A Street C, District 1, City DN','58 A Street D, District 3, City HN','98 A Street C, District 3, City HN']
    const [partitionedAddresses, setPar] = useState(defAdress
        .map((addr) => {
            const parts = addr.address.split(',').map((item) => item.trim());
            return {
                street: parts[0] || "", // Nếu thiếu thì trả về chuỗi rỗng
                district: parts[1] || "",
                city: parts[2] || "",
                province: parts[3] || "",
                isdefault: addr.isdefault || false
            };
        })
        .sort((a, b) => b.isdefault - a.isdefault));
    const [prevState, setPrev] = useState(partitionedAddresses)
    useEffect(()=>{
        setPar(
            defAdress
                .map((addr) => {
                    const parts = addr.address.split(',').map((item) => item.trim());
                    return {
                        street: parts[0] || "", // Nếu thiếu thì trả về chuỗi rỗng
                        district: parts[1] || "",
                        city: parts[2] || "",
                        province: parts[3] || "",
                        isdefault: addr.isdefault || false
                    };
                })
                .sort((a, b) => b.isdefault - a.isdefault) // Đưa các phần tử có isdefault: true lên đầu
        );
          
    },[defAdress])
    // useEffect(()=>{
    //     setPrev([...partitionedAddresses])
    // },[defAdress])
    const handleSubmit = async() =>{
        //alert(address.isdefault)
        let resAddress = address.street + ", " + address.district + ", " + address.city +", " +address.province
        if (address.province == "" || address.street == "" || address.city == "" || address.district == "" || !address.province || !address.street || !address.city || !address.district){
            setErr('Vui lòng nhập đầy đủ thông tin')
        }
        else if (defAdress.map(item => item.address).includes(resAddress)){
            setErr('Địa chỉ đã tồn tại')
            setToggle(!toggle)
                setVal({
                    province: "",
                    city: "",
                    district: "",
                    street: "",
                    isdefault: false
                })
        }
        else{
            const addAddress = await axios.post(`http://localhost:8000/api/user/CreateAddress/${currentUser.uid}`,
                {
                    address: resAddress,
                    isdefault: address.isdefault
                }
            )
            //console.log("add",addAddress)
            if(addAddress.data.status !== 200){
                setErr(addAddress.msg || "Thêm địa chỉ thất bại")
            }
            else{
                setErr("")
                setToggle(!toggle)
                //alert('Thêm địa chỉ thành công')
                setVal({
                    province: "",
                    city: "",
                    district: "",
                    street: "",
                    isdefault: false
                })
                //defAdress.push(address.street + ", " + address.district + ", " + address.city +", " +address.province)
            }
        }
        setIsPopupOpen(true)
    }

    const handleUpdate = async(index) => {
        console.log(partitionedAddresses[index])
        // console.warn(prevState[index])
        if (partitionedAddresses[index].province == "" || partitionedAddresses[index].street == "" || partitionedAddresses[index].city == "" || partitionedAddresses[index].district == ""){
            setErr('Vui lòng nhập đầy đủ thông tin')
        }
        else{
            const updateAddress = await axios.put(`http://localhost:8000/api/user/UpdateAddress/${currentUser.uid}`,
                {
                    old_address: defAdress[index].address,
                    new_address: partitionedAddresses[index].street + ", " + partitionedAddresses[index].district + ", " + partitionedAddresses[index].city +", " + partitionedAddresses[index].province,
                    isdefault: partitionedAddresses[index].isdefault
                }
            )
            if(updateAddress.status !== 200){
                setErr(updateAddress.msg || "Thêm địa chỉ thất bại")
            }
            else{
                setErr("")
                setToggle(!toggle)
                //alert('Cập nhật địa chỉ thành công')
                //defAdress.push(item.street + ", " + item.district + ", " + item.city +", " +item.province)
            }
        }
        setIsPopupOpen(true)
    }

    const handleRemove = async(index) =>{
        console.log(defAdress[index].address)
        const item = partitionedAddresses[index]
        if (!defAdress[index].address){
            setErr('Vui lòng nhập đầy đủ thông tin')
        }
        else{
            const updateAddress = await axios.post(`http://localhost:8000/api/user/DeleteAddress/${localStorage.getItem('uid')}`,
                {
                    address: defAdress[index].address
                }
            )
            if(updateAddress.data.status !== 200){
                setErr(updateAddress.msg || "Xóa địa chỉ thất bại")
            }
            else{
                if (defAdress && defAdress.length > 1 && defAdress[index].isdefault){
                    let temp = defAdress.map(adrr => adrr.address)
                    temp = temp.filter(item => item != defAdress[index].address)
                    const resAddress = await axios.put(`http://localhost:8000/api/user/UpdateAddress/${localStorage.getItem('uid')}`,
                        {
                            old_address: temp[0],
                            new_address: temp[0],
                            isdefault: true
                        }
                    )
                }
                setErr("")
                setToggle(!toggle)
                //defAdress.push(item.street + ", " + item.district + ", " + item.city +", " +item.province)
            }
        }
        setIsPopupOpen(true)
    }
    return(
        <>
        <style>{`
                        .btn-css{
                            padding: 5px;
                            border: 1px solid #C0C0C0;
                            background-color: #F7FFF7;
                            border-radius: 8px;
                            cursor: pointer;
                        }
                        .btn-css:hover{
                            background-color: #D32F2F;
                            color: #F7FFF7;
                        }
                        .openPopup {
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                        }

                        .openPopup:hover {
                            background-color: #0056b3;
                        }

                        .popup {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 9999;
                        }

                        .popupContent {
                            background: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            text-align: center;
                            width: 300px;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        }

                        .closePopup {
                            padding: 10px 20px;
                            background-color: #ff4d4d;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                            margin-top: -10px;
                        }

                        .closePopup:hover {
                            background-color: #cc0000;
                        }
                    `}
                    </style>
                {isPopupOpen && (
                        <div className="popup" onClick={closePopup}>
                            <div className="popupContent" onClick={(e) => e.stopPropagation()} style={Err == ""?{width: "200px", height:"80px", backgroundColor:"rgba(0, 255, 0, 0.3)", color:"green"}:{width: "200px", height:"80px", backgroundColor:"rgba(255, 0, 0, 0.3)", color:"red"}}>
                                {Err == ""?
                                <>
                                    <div>&#9989;</div>
                                    <div>Cập nhật thành công</div>
                                </>:
                                <>
                                    <div style={{marginTop: "-15px"}}>&#10060;</div>
                                    <div>{Err}</div>
                                </>}
                            </div>
                        </div>
                    )}
        <div className="profile-form" style={{backgroundColor:"white"}}>
                <h2><span style={{color: "gray",fontWeight: "bold", cursor: "pointer"}} onClick={()=>{setActive(1);navigate('/user/info')}}>&#8592;</span> Thông tin địa chỉ</h2>
                <table className="address-table">
                    <thead>
                        <tr>
                        <th>STT</th>
                        <th>Số nhà</th>
                        <th>Phường/Xã</th>
                        <th>Quận/Huyện</th>
                        <th>Tỉnh/Thành phố</th>
                        <th>Mặc định</th>
                        <th style={{width: "95px"}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        partitionedAddresses && partitionedAddresses.length > 0 ? partitionedAddresses.map((item, index) => {
                            return (
                            <tr key={index}>
                                <td>{index + 1}</td> {/* Display the index + 1 for STT */}
                                <td><input type="text" id={`province${index}`} value={item.street} onChange={(e)=> {
                                    const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                    tempArr[index] = {
                                      ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                      street: e.target.value, // Cập nhật trường `street`
                                    };
                                    setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                }}/></td>
                                <td><input type="text" id={`province${index}`} value={item.district} onChange={(e)=> {
                                    const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                    tempArr[index] = {
                                      ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                      district: e.target.value, // Cập nhật trường `street`
                                    };
                                    setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                }}/></td>
                                <td><input type="text" id={`province${index}`} value={item.city}onChange={(e)=> {
                                    const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                    tempArr[index] = {
                                      ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                      city: e.target.value, // Cập nhật trường `street`
                                    };
                                    setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                }}/></td>
                                <td><input type="text" id={`province${index}`} value={item.province}onChange={(e)=> {
                                    const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                    tempArr[index] = {
                                      ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                      province: e.target.value, // Cập nhật trường `street`
                                    };
                                    setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                }}/></td>
                                <td><input type="checkbox" name="subscribe" checked={item.isdefault}onChange={(e)=> {
                                    const tempArr = [...partitionedAddresses]; // Tạo bản sao mới của mảng
                                    tempArr[index] = {
                                      ...tempArr[index], // Sao chép đối tượng hiện tại để giữ các trường khác
                                      isdefault: e.target.checked, // Cập nhật trường `street`
                                    };
                                    setPar(tempArr); // Cập nhật trạng thái với bản sao mới
                                }}/></td>
                                <td style={{display: "inline-flex", alignItems: "center"}}><button style={{width: "75px", backgroundColor: "greenyellow", color: "gray", marginRight: "30px", alignItems: "center"}} onClick={()=> handleUpdate(index)}>Cập nhật</button><button onClick={() => handleRemove(index)} style={{color: "white",backgroundColor: "red", marginLeft: "10px", alignItems: "center"}}>Xóa</button></td> {/* Close button */}
                            </tr>
                            )
                        }) : <span style={{paddingTop: "5px", textAlign: "center"}}>Người dùng không có thông tin địa chỉ</span>
                        }
                    </tbody>
                </table>
                <div className="form-group">
                    <div className="full-width">
                        <label htmlFor="province">Nhập Tỉnh/thành phố</label>
                        <input type="text" id="province" value={address.province} onChange={(e) => setVal((prev)=>({...prev,province:e.target.value}))}/>
                    </div>
                    <div className="full-width">
                        <label htmlFor="city">Nhập Quận/Huyện</label>
                        <input type="text" id="city" value={address.city}  onChange={(e) => setVal((prev)=>({...prev,city:e.target.value}))}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="full-width">
                        <label htmlFor="district">Nhập Phường/Xã</label>
                        <input type="text" id="district" value={address.district}  onChange={(e) => setVal((prev)=>({...prev,district:e.target.value}))}/>
                    </div>
                    <div className="full-width">
                        <label htmlFor="street">Nhập số nhà/tên đường</label>
                        <input type="text" id="street" value={address.street}  onChange={(e) => setVal((prev)=>({...prev,street:e.target.value}))}/>
                    </div>
                </div> 
                <label style={{display: "inline-flex", width:"200px"}}>
                    <input style={{width: "10px"}} type="checkbox" name="subscribe" checked={address.isdefault} onChange={(e) => setVal((prev)=>({...prev,isdefault:e.target.checked}))} />
                     <span style={{marginTop: "5px", marginLeft: "10px"}}>Địa chỉ mặc định</span>
                </label>
                <div className="form-actions">
                    <button className="btn-cancel">Hủy</button>
                    <button className="btn-save" onClick={handleSubmit}>Thêm địa chỉ</button>
                </div>
            </div>
            </>
    )
}

export function UpdateData(){
    const [magnet, setMag] =useState(1)
    const { active, setActive, currentUser } = useContext(UserContext);
    const navigate = useNavigate()
    const [isPopupOpen, setIsPopupOpen] = useState(false);
        const openPopup = () => {
            setIsPopupOpen(true);
        };
    
        const closePopup = () => {
            setIsPopupOpen(false);
        };   
        useEffect(() => {
            let timer;
            if (isPopupOpen) {
              timer = setTimeout(() => {
                setIsPopupOpen(false);
              }, 3000); // Tự tắt sau 3 giây
            }
            return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount hoặc khi popup tắt
          }, [isPopupOpen]);
    //console.log(currentUser)
    const [user, setUser] = useState({
        fname: currentUser.fname,
        lname: currentUser.lname,
        username: currentUser.username,
        email: currentUser.email
    })
    const [defPhone, setPhone] = useState("")
    const [defAdress, setAddress] = useState("")
    useEffect(() => {
        const fetchAdress = async () => {
            //console.log(currentUser.uid)
            let adress = [];
            const res = await axios.get(`http://localhost:8000/api/user/GetAll/${currentUser.uid}`)
            console.log(res)
            if (res.status != 200) throw new Error("Error while fetching address")
            adress = res.data.data?res.data.data: []
            setAddress(adress&&adress.length > 0?adress.find(item => item.isdefault == true).address:""); // Update images state once all images are fetched
        };

        fetchAdress();
    }, [currentUser]);
    useEffect(() => {
        const fetchPhone = async () => {
            //console.log(currentUser.uid)
            let rphone = [];
            const res = await axios.get(`http://localhost:8000/api/user/GetPhone/${currentUser.uid}`)
            //console.log(res)
            if (res.status != 200) throw new Error("Error while fetching phone number")
            rphone = res.data.data?res.data.data: []
            setPhone(rphone&& rphone.length>0?rphone.map(item => item.phone):[]); // Update images state once all images are fetched
        };

        fetchPhone();
    }, [currentUser]);

    //handle update error
    const [emailErr, setEErr] = useState("")
    const [unameErr, setUNErr] = useState("")
    const [lErr, setLErr] = useState("")
    const [fErr, setFErr] = useState("")
    const [unexpectErr, setUErr] = useState("")

    const handleUpdate = async() =>{
        try{
            const { fname, lname, email, username } = user;  // Object destructuring for clarity
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const usernamePattern = /^[a-zA-Z0-9]+$/;
            const vietnameseNamePattern = /^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỹửữựỳỵýỷỹ\s]+$/;

            if (!emailPattern.test(email)){
                setEErr('Định dạng email không hợp lệ vui lòng nhập lại')
                return;
            }
            if (!usernamePattern.test(username)){
                setUNErr('Định dạng tên không hợp lệ')
                return;
            }
            if (!vietnameseNamePattern.test(fname)){
                setFErr('Định dạng tên không hợp lệ')
                return;
            }
            if (!vietnameseNamePattern.test(lname)){
                setLErr('Định dạng tên không hợp lệ')
                return;
            }
            const uid = localStorage.getItem('uid');  // Destructure currentUser to get uid
            //console.log("Break id: ",uid)
            const response = await axios.put(`http://localhost:8000/api/user/update-user/${uid}`,{
                username: username,
                lname: lname,
                fname: fname,
                email: email
            })
            //console.warn("Res Update: " + response.data.msg)
            // username: username,
            //     lname: lname,
            //     fname: fname,
            //     email: email
            // username: username!=currentUser.username?username:null,
            //     lname: lname!=currentUser.lname?lname:null,
            //     fname: fname!=currentUser.fname?fname:null,
            //     email: email!=currentUser.email?email:null
            //console.log(response)
            if (response.status != 200 || response.data.status != 200) {
                console.log("Res: "+response.data)
                let errField = response.data.msg.msg
                errField = errField.match(/"([^"]*)"/)
                errField = errField[1]
                if (errField == "users_email_key"){
                    setEErr('Email đã tồn tại')
                    throw new Error('Email đã tồn tại')
                }
                else if(errField == "users_username_key"){
                    setUNErr('Username đã tồn tại')
                    throw new Error('Username đã tồn tại')
                }
                else {
                    setUErr(response.data.msg)
                    return
                }
            }
            else {
                //alert('Cập nhật thông tin thành công')
                setIsPopupOpen(true)
                //window.location.reload();
            }
        }
        catch(e){
            let errField = e.response.data.msg.msg
                errField = errField.match(/"([^"]*)"/)
                errField = errField[1]
                if (errField == "users_email_key"){
                    setEErr('Email đã tồn tại')
                    throw new Error('Email đã tồn tại')
                }
                else if(errField == "users_username_key"){
                    setUNErr('Username đã tồn tại')
                    throw new Error('Username đã tồn tại')
                }
                else {
                    setUErr(response.data.msg)
                    return
                }
        } 
    }
        return(
            <>
            <style>{`
                        .btn-css{
                            padding: 5px;
                            border: 1px solid #C0C0C0;
                            background-color: #F7FFF7;
                            border-radius: 8px;
                            cursor: pointer;
                        }
                        .btn-css:hover{
                            background-color: #D32F2F;
                            color: #F7FFF7;
                        }
                        .openPopup {
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                        }

                        .openPopup:hover {
                            background-color: #0056b3;
                        }

                        .popup {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 9999;
                        }

                        .popupContent {
                            background: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            text-align: center;
                            width: 300px;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        }

                        .closePopup {
                            padding: 10px 20px;
                            background-color: #ff4d4d;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                            margin-top: -10px;
                        }

                        .closePopup:hover {
                            background-color: #cc0000;
                        }
                    `}
                    </style>
                {isPopupOpen && (
                        <div className="popup" onClick={closePopup}>
                            <div className="popupContent" onClick={(e) => e.stopPropagation()} style={unexpectErr == ""?{width: "200px", height:"80px", backgroundColor:"rgba(0, 255, 0, 0.3)", color:"green"}:{width: "200px", height:"80px", backgroundColor:"rgba(255, 0, 0, 0.3)", color:"red"}}>
                                {unexpectErr == ""?
                                <>
                                    <div>&#9989;</div>
                                    <div>Cập nhật thành công</div>
                                </>:
                                <>
                                    <div>&#10060;</div>
                                    <div>{unexpectErr}</div>
                                </>}
                            </div>
                        </div>
                    )}
                 <div className="profile-form">
                    <h2>Chỉnh sửa hồ sơ</h2>
                    <div className="form-group">
                        <div className="full-width">
                            <label htmlFor="firstName">Tên</label>
                            <input type="text" id="firstName" value={user.lname} onChange={(e) => {setLErr("");setUser((prev)=>({...prev,lname:e.target.value}))}} style={lErr != ""?{border: "1px solid red"}:{border: "1px solid gray"}}/>
                            {lErr != ""?<div style={{color: "red", fontSize:"10px"}}>* {lErr}</div>:null}
                        </div>
                        <div className="full-width">
                            <label htmlFor="lastName">Họ và tên lót</label>
                            <input type="text" id="lastName" value={user.fname}  onChange={(e) => {setFErr(""); setUser((prev)=>({...prev,fname:e.target.value}))}} style={fErr != ""?{border: "1px solid red"}:{border: "1px solid gray"}}/>
                            {fErr != ""?<div style={{color: "red", fontSize:"10px"}}>* {fErr}</div>:null}
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="full-width">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" value={user.username}  onChange={(e) => {setUNErr(""); setUser((prev)=>({...prev,username:e.target.value}))}} style={unameErr != ""?{border: "1px solid red"}:{border: "1px solid gray"}}/>
                            {unameErr != ""?<div style={{color: "red", fontSize:"10px"}}>* {unameErr}</div>:null}
                        </div>
                        <div className="full-width">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" value={user.email}  onChange={(e) => {setEErr(""); setUser((prev)=>({...prev,email:e.target.value}))}} style={emailErr != ""?{border: "1px solid red"}:{border: "1px solid gray"}}/>
                            {emailErr != ""?<div style={{color: "red", fontSize:"10px"}}>* {emailErr}</div>:null}
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="full-width">
                            <label htmlFor="adress">Địa chỉ</label>
                            <div className="item-item">
                                <div>{defAdress!=""?defAdress:"Chưa có địa chỉ mặc định"}</div>
                                <button id="address" onClick={()=>{setActive(1); navigate('/user/info/address')}}>Chỉnh sửa</button>
                            </div>
                        </div>
                        <div className="full-width">
                            <label htmlFor="phone">Số điện thoại</label>
                            <div className="item-item">
                                <div>{defPhone&& defPhone.length > 0?defPhone[0]:"Chưa có số điện thoại mặc định"}</div>
                                <button id="phone" onClick={() => {setActive(1); navigate('/user/info/phone') }}>Chỉnh sửa</button>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => {setActive(1); navigate('/user/info/password')}} style={{borderRadius: "8px", width: "120px", height:"40px", cursor: "pointer", backgroundColor: "white", border: "1px, solid gray"}}>Đổi mật khẩu</button>
                    <div className="form-actions">
                        <button className="btn-cancel">Hủy</button>
                        <button className="btn-save" onClick={handleUpdate}>Lưu thay đổi</button>
                    </div>
                </div>
            </>
        )
}

const ControlRender = ({active,currentUser, setActive}) =>{
    switch (active){
        case 1:
            return <UpdateData currentUser={currentUser} active={active} setActive={setActive}/>
        case 2:
            return <History currentUser={currentUser} setActive={setActive} active={active}/>
        case 8:
            return <History currentUser={currentUser} setActive={setActive} active={active}/>
        case 3:
            return <Ranking currentUser={currentUser}/>
        case 5:
            return <UpdateAdress currentUser={currentUser} active={active} setActive={setActive}/>
        case 6:
            return <UpdatePhone currentUser={currentUser} active={active} setActive={setActive}/>
        case 7:
            return <UpdatePassword currentUser={currentUser} active={active} setActive={setActive}/>
        default:
            return <UpdateData currentUser={currentUser}/>
    }
}

function UserAccountManagement() {
    //console.log("users: " + currentUser)
    const uid = localStorage.getItem('uid')
    const location = useLocation();
    const ractive = location.state?(location.state.active?location.state.active:1):1

    //console.log(uid)
    const [currentUser, setUser] = useState(null)
    const [totalPaid, setPaid] = useState(0)
    const [phone1, setPhone1] = useState("")
    useEffect(()=>{
        const fetchUser = async()=>{
            try{
                const ruser = await axios.get(`http://localhost:8000/api/user/get-detail/${uid}`)
                console.log(ruser)
                if (ruser.data.status != 200) throw new Error("Bug Data")
                setUser(ruser.data.data)
            }
            catch(err){
                console.error("Message: ", err.message)
            }
        }
        fetchUser()
    },[uid])
    const navigate = useNavigate()
    const [active,setActive] = useState(ractive)
    const curPage = (number, path) => {
        setActive(number);
        if (path == '/'){
            localStorage.removeItem('uid')
            localStorage.removeItem('token')
        }
        navigate(path);
    };
    return ( currentUser &&
        <>
         <UserContext.Provider value={{ active, setActive, currentUser, totalPaid, setPaid, phone1, setPhone1}}>
                <Header />
                <div className="acc-container">
                    <div className="acc-breadcrumb">
                        <a onClick={() => navigate("/user/homepage")}>Home</a>/
                        <a>
                            <b>Account</b>
                        </a>
                    </div>
                    <div className="update">
                        <div className="side-bar" style={{ color: "black" }}>
                            <div className='item' onClick={() => curPage(1, "/user/info")}>
                                Tài khoản của bạn
                            </div>
                            <div className='item' onClick={() => curPage(2, "/user/info/history-log")}>
                                Lịch sử mua hàng
                            </div>
                            <div className='item' onClick={() => curPage(3, "/user/info/rank")}>
                                Hạng thành viên
                            </div>
                            <div className='item' onClick={() => curPage(5, "/user/info/notification")}>
                                Thông báo
                            </div>
                            <div className='item' onClick={() => curPage(4, "/")}>
                                Đăng xuất
                            </div>
                        </div>
                        <Outlet /> {/* Render các route con */}
                    </div>
                </div>
                <Footer />
            </UserContext.Provider>
        </>
    );
}

export default UserAccountManagement;