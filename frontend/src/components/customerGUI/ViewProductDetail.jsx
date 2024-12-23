import React, {useState,useEffect} from "react";
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom";

import Header from "./Header";
import Footer from "../Footer";
import '../../design/product/ratebar.css'
import '../../design/product/review.css'
import '../../design/product/view.css'

function NewReview({product, closePopup}){
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
            //console.log(product.product_id + " " + currentUser.uid)
            try{
                const rreview = await axios.get(`http://localhost:8000/api/product/GetReview/${product.product_id}`)
                console.log(rreview)
                if (rreview.data.status != 200){
                    return
                }
                else {
                    setMine(rreview.data.data.find(i => i.uid == localStorage.getItem('uid')))
                    Coloring(rreview.data.data.find(i => i.uid == localStorage.getItem('uid')).rating)
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
            "uid": localStorage.getItem('uid'),
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
    const switchToModify = (str) =>{
        let scrumb = str.split('\n')
        console.log("Scrumble: " + scrumb)
        let rcomment = ""
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
            else rcomment += i + '\n'
        setComment(rcomment)
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
                    <button style={{marginTop:"10px"}} className="closePopup" onClick={()=>switchToModify(myReview.comment)}>
                    Chỉnh sửa đánh giá
                    </button>
            </>
        )
    }
}

function Detail({reviews, product }) {
    if (!product) return null;
    const navigate = useNavigate()
    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);
    const averageRate = reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) / reviews.length).toFixed(1) 
        : "0.0";
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/product/GetImageByProduct/${product.product_id}`);
                if (!response.ok) throw new Error("Failed to fetch image");
                const data = await response.json();
                const newImages = data.data || [];

                // Cập nhật lại mainImage và otherImages sau khi tải hình ảnh
                const main = newImages.find(item => item.product_id === product.product_id && item.ismain);
                const others = newImages.filter(item => item.product_id === product.product_id && !item.ismain);
                
                setMainImage(main || null);  // Nếu không có main image, sử dụng null
                setOtherImages(others);      // Cập nhật mảng các hình ảnh phụ
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };

        fetchImages();
    }, [product.product_id]);  // Chạy lại useEffect nếu product_id thay đổi

    // Hàm thay đổi hình ảnh chính
    const switchImgPlace = (index) => {
        const temp = mainImage;
        const newOther = [...otherImages];  // Tạo bản sao mảng otherImages để thay đổi

        // Hoán đổi main image và hình ảnh phụ
        setMainImage(newOther[index]);
        newOther[index] = temp;
        setOtherImages(newOther);
    };
    
    const category = product.cate_id == 'c01'? "Điện thoại":
                    product.cate_id == 'c02'?"Laptop":
                    product.cate_id == 'c03'?"Máy tính bảng":
                    product.cate_id ==' c04'?"Đồng hồ thông minh":"Phụ kiện"
    const [buyQuantity, setBuy] = useState(1)
    const changeQuantity = (charge)=>{
        if (charge == 1) setBuy(buyQuantity + 1 < product.quantity?buyQuantity+1:product.quantity)
        else setBuy(buyQuantity - 1 > 0?buyQuantity -1:0)
    }
    const handleInputChange = (e) => {
        const value = parseInt(e.target.value, 10) || 0; // Chuyển chuỗi thành số hoặc mặc định là 0
        if (value >= 0 && value <= product.quantity) {
            setBuy(value);
        }
    };

    const handleAddCart = async () => {
        try {
            const uid = localStorage.getItem('uid')
            const response = await axios.post(
                `http://localhost:8000/api/cart/AddToCart/${uid}`,
                {
                    product_id: product.product_id,
                    quantity: buyQuantity,
                }
            );
    
            if (response.status !== 200) {
                throw new Error("Lỗi khi thêm sản phẩm vào giỏ hàng");
            }
    
            alert('Đã thêm sản phẩm vào giỏ hàng');
        } catch (e) {
            console.error("Error:", e.message || "Thêm vào giỏ hàng thất bại");
            alert("Thêm vào giỏ hàng thất bại: " + (e.message || "Lỗi không xác định"));
        }
    };
    
    return (
        <>
            <div className="breadcrumbs">
                <div>
                    <a href='/user/shopping' className="off">Mua sắm</a> /
                    <a href={`/category/${product.cate_id}`} className="off">
                        {category}
                    </a> / {product.pname}
                </div>
            </div>
            <div className="product-page">
                <div className="product-container">
                    <div className="thumbnails">
                        {otherImages.map((item, index) => (
                            <div key={index} className="thumbnail" onClick={() => switchImgPlace(index)}>
                                <img src={item ? item.image_url : ""} alt="Thumbnail" />
                            </div>
                        ))}
                    </div>
                    <div className="main-image">
                        <img src={mainImage ? mainImage.image_url : "default_image.png"} alt="Main" />
                    </div>
                    <div className="product-details">
                        <h1>{product.pname}</h1>
                        <div className="rating-stock">
                            <p><span style={{color: "red"}}>{averageRate}</span>/5.0 ({reviews.length} đánh giá) | <span className="stock-status">{product.quantity>0?"Còn "+product.quantity+" sản phẩm":"Hiện sản phẩm đã hết"}</span></p>
                        </div>
                        <p className="price">{formatPrice(product.price)}</p>
                        <div className="purchase-options">
                            <div className="quantity">
                                <button class="btn decrement" onClick={(e) => {e.preventDefault(); changeQuantity(0)}}>-</button>
                                <input
                                    type="text"
                                    value={buyQuantity}
                                    onChange={(e)=>handleInputChange(e)}
                                    style={{ width: "40px", textAlign: "center" }}
                                />
                                <button class="btn increment" onClick={(e) => {e.preventDefault(); changeQuantity(1)}}>+</button>
                            </div>
                            <button className="buy-now">Mua ngay</button>
                            <button className="add-to-cart" onClick={handleAddCart}>Thêm vào giỏ hàng</button>
                        </div>
                        <div className="info-box">
                            <div className="info-item">
                                <div className="icon">&#128666; </div>
                                <div>
                                    <p><strong>Giao hàng nhanh chóng</strong></p>
                                    <p>Giao hàng trong vòng 7 ngày kể từ khi thanh toán*</p>
                                </div>
                            </div>
                            <div className="info-item">
                            <div className="icon">&#128209; </div>
                                <div>
                                    <p><strong>Chính sách đổi trả</strong></p>
                                    <p>Miễn phí trả hàng trong vòng 30 ngày.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Description({ product }) {
    if (!product) return null;
    const hashDescription = product.description?product.description.split("\n"):[]

    return (
        <div className="prod-description">
            <h3>Thông tin chi tiết sản phẩm</h3>
            <div className="description">{hashDescription && hashDescription.length > 0?hashDescription.map((des, idx)=>{
                return <p key={idx}>{des}</p>
            }):null}</div>
        </div>
    );
}

function Review({ reviews, product }) {
    
    const averageRate = reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) / reviews.length).toFixed(1) 
        : 0;
    const ratings = [5, 4, 3, 2, 1].reduce((acc, rating) => ({
        ...acc,
        [rating]: reviews.filter(review => review.rating === rating).length
    }), {});

    const myReview = reviews.find(review => review.uid === localStorage.getItem('uid')) || null;
    const otherReviews = reviews.filter(review => review.uid !== localStorage.getItem('uid'));
    const viewTime = (time) =>{
        const date = new Date(time);

        // Lấy các thành phần thời gian
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const day = date.getDate();
        const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
        const year = date.getFullYear().toString().slice(-2); // Lấy 2 chữ số cuối của năm

        // Định dạng thành chuỗi "h:m dd/mm/yy"
        return `${hours}:${minutes.toString().padStart(2, '0')} ${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/20${year}`;
    }

    const Rate = (rate) =>{
        if (averageRate == -1) return;
        else if (averageRate <= 1.5) return `⭐`
        else if (averageRate <= 2.5) return `⭐⭐`
        else if (averageRate <= 3.5) return `⭐⭐⭐`
        else if (averageRate <= 4.5) return `⭐⭐⭐⭐`
        else return `⭐⭐⭐⭐⭐`
    }
    const RateSwitch = (rate) =>{
        switch(rate){
            case 1:
                return `⭐`
            case 2:
                return `⭐⭐`
            case 3: 
                return `⭐⭐⭐`
            case 4:
                return `⭐⭐⭐⭐`
            case 5:
                return `⭐⭐⭐⭐⭐`
        }
    }
    let ratingsBreakdown = [0, 0, 0, 0, 0]
    let totalRatings = reviews.length;
    for (let i = 0; i < reviews.length; i++){
        ratingsBreakdown[reviews[i].rating - 1]++;
    }
    const getDate = () => {
        const now = new Date();
        return now.toLocaleString(); 
    };

    const [hasBought, setHasBought] = useState(false);
    const checkProductinOrder = async () => {
        try {
            const uid = localStorage.getItem('uid');
            const response = await axios.get(`http://localhost:8000/api/order/getAllOrder/${uid}`);
            if (response.status !== 200) {
                throw new Error("Lỗi khi kiểm tra sản phẩm trong đơn hàng");
            }
            const orders = response.data.data;
            console.log(orders);
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                try {
                    const response = await axios.get(`http://localhost:8000/api/order/getDetailOrder/${order.oid}`);
                    if (response.status !== 200) {
                        throw new Error("Lỗi khi kiểm tra sản phẩm trong đơn hàng");
                    }
                    const products = response.data.data;
                    console.log("Checkout: " + products[0].product_id);
                    for (let j = 0; j < products.length; j++) {
                        if (products[j].product_id === product.product_id) {
                            console.log("Has bought");
                            setHasBought(true);
                            return;
                        }
                    }
                } catch (e) {
                    console.error("Error:", e.message || "Kiểm tra sản phẩm trong đơn hàng thất bại");
                    //alert("Kiểm tra sản phẩm trong đơn hàng thất bại: " + (e.message || "Lỗi không xác định"));
                }
            }
        } catch (e) {
            console.error("Error:", e.message || "Kiểm tra sản phẩm trong đơn hàng thất bại");
            //alert("Kiểm tra sản phẩm trong đơn hàng thất bại: " + (e.message || "Lỗi không xác định"));
        }
    };

    useEffect(() => {
        checkProductinOrder();
    }, [product, reviews]);
    const calculateStarPercentage = (starLevel) =>
        ((ratingsBreakdown[starLevel - 1] || 0) / totalRatings) * 100;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
            const openPopup = () => {
                setIsPopupOpen(true);
            };

            const closePopup = () => {
                setIsPopupOpen(false);
            };
    const hashComment = (comment) =>{
        const hash = comment.split("\n")
        return hash
    }
    const getBarWidth = (ratingCount) =>
        reviews && reviews.length > 0 ? (ratingCount / reviews.length) * 100 : 0;
    return (
        <div className="review-prod">
            <h3>Đánh giá và nhận xét {product.pname}</h3>
            <div className="rating-container">
                <div className="rating-summary">
                    <div className="average-rating">
                    <span className="rating-value">{averageRate}/5</span>
                    <div className="stars">
                        <span>{Rate(averageRate)}</span>
                    </div>
                    <div className="rating-count">{totalRatings} đánh giá</div>
                    </div>
                </div>
                <div className="slash"></div>
                <div className="rating-distribution">
                    <div className="rating-row">
                    <span>5 ⭐</span>
                    <div className="rating-bar">
                        <div className="filled-bar" style={{ width: `${calculateStarPercentage(5)}%` }}></div>
                    </div>
                    <span>{ratingsBreakdown[4]} đánh giá</span>
                    </div>
                    <div className="rating-row">
                    <span>4 ⭐</span>
                    <div className="rating-bar">
                        <div className="filled-bar" style={{ width: `${calculateStarPercentage(4)}%` }}></div>
                    </div>
                    <span>{ratingsBreakdown[3]} đánh giá</span>
                    </div>
                    <div className="rating-row">
                    <span>3 ⭐</span>
                    <div className="rating-bar">
                        <div className="filled-bar" style={{ width: `${calculateStarPercentage(3)}%` }}></div>
                    </div>
                    <span>{ratingsBreakdown[2]} đánh giá</span>
                    </div>
                    <div className="rating-row">
                    <span>2 ⭐</span>
                    <div className="rating-bar">
                        <div className="filled-bar" style={{ width: `${calculateStarPercentage(2)}%` }}></div>
                    </div>
                    <span>{ratingsBreakdown[1]} đánh giá</span>
                    </div>
                    <div className="rating-row">
                    <span>1 ⭐</span>
                    <div className="rating-bar">
                        <div className="filled-bar" style={{ width: `${calculateStarPercentage(1)}%` }}></div>
                    </div>
                    <span>{ratingsBreakdown[0]} đánh giá</span>
                    </div>
                </div>
                </div>

            <div className="review-of-customer">
                {myReview?
                <div className="a-review">
                <div className="By">{myReview.uid}<span style={{marginLeft: '40px'}}> {viewTime(myReview.time)} </span><span className="edit-button" onClick={openPopup}> Chỉnh sửa &#128221;</span></div>
                <div><b>Rating:</b> <span style={{color: 'red'}}>{RateSwitch(myReview.rating)}</span></div>
                <div><b>Comment:</b> {hashComment(myReview.comment) && hashComment(myReview.comment).length > 0?hashComment(myReview.comment).map((com, idx)=>{
                    return <p key={idx}>{com}</p>
                }):null}</div>
            </div>:null }
                {otherReviews.map((review, index) => (
                    <div key={index} className="a-review">
                        <div className="By">{review.uid}<span style={{marginLeft: '40px'}}> {viewTime(review.time)}</span></div>
                        <div><b>Rating:</b> <span style={{color: 'red'}}>{RateSwitch(review.rating)}</span></div>
                        <div><b>Comment:</b> {hashComment(review.comment) && hashComment(review.comment).length > 0?hashComment(review.comment).map((com, idx)=>{
                            return <p key={idx}>{com}</p>
                        }):null}</div>
                    </div>
                ))}
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

                        .edit-button {
                            cursor: pointer;
                            border: 1px solid gray;
                            padding: 3px 4px;
                            border-radius: 3px;
                            margin-left: 10px;
                        }

                        .edit-button:hover {
                            background-color: red;
                            color: white;
                        }
                    `}
                    </style>
                    {isPopupOpen && (
                        <div className="popup" onClick={closePopup}>
                            <div className="popupContent" onClick={(e) => e.stopPropagation()} style={{width: "700px", height:"600px"}}>
                                <h2 style={{backgroundColor: "#E5E5E5", marginLeft: "-20px", padding: "10px 0px 10px 0px", width:"700px", marginTop:"-20px", borderRadius: "8px 8px 0px 0px"}}>Đánh giá và nhận xét</h2>
                                <NewReview product={product} closePopup={closePopup} />
                            </div>
                        </div>
                    )}
                    {reviews.find(review => review.uid === localStorage.getItem('uid')) ? null:
                    hasBought ?
                    <div className="add-review" onClick={openPopup}>
                    Thêm review của bạn
                <style>
                    {`
                    .add-review {
                        padding: 10px 20px;
                        background-color: white;
                        color: black;  
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                        margin-top: 20px;
                        text-align: center;
                        width:40%;
                        margin-left: auto;
                        margin-right: auto;
                        margin-bottom: 10px;
                        border: 1px solid gray;
                        border-radius: 8px;
                    }

                    .add-review:hover {
                        background-color: red;
                        color: white;
                    }
                    `}
                    
                </style>
                </div>: null
                    
                }
                
            </div>
        </div>
    );
}

function ViewDetail() {
    const navigate = useNavigate()
    const {id} = useParams()
    const [product, setProduct]= useState({});
    useEffect(()=>{
        const fetchProduct = async() =>{
            try{
                const response = await axios.get(`http://localhost:8000/api/product/get-detail/${id}`)
                console.log(response)
                if (response.status !== 200) throw new Error("Bug data")
                setProduct(response.data.data)
            }
            catch(err){
                console.log(err.message)
            }
        }
        fetchProduct()
    },[])
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        const fetchReviews = async () => {
            let newReviews = [];
            try {
                const response = await fetch(`http://localhost:8000/api/product/GetReview?product_id=${product.product_id}&limit=1000&page=0`);
                if (!response.ok) throw new Error("Failed to fetch image");
                const data = await response.json();
                newReviews = data.data||[];

            } catch (error) {
                console.error("Error fetching image:", error);
                newReviews = []; // Fallback if image fetch fails
            }
            setReviews(newReviews); // Update images state once all images are fetched
        };

        fetchReviews();
    }, [product]);
    return (product &&
        <>
        <Header/>
        <div className="viewpage">
            
            <Detail reviews = {reviews} product={product}/>
            <Description product={product} />
            <Review product={product} reviews={reviews}/>
            
        </div>
        <Footer/>
        </>
        
    );
}

export default ViewDetail;

// Helper function for price formatting
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}
