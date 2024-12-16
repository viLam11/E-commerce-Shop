import { useEffect, useState } from "react"
import RenderStars from "./RenderStart"
import axios from "axios";


export default function NewReview({prodID}) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [useName, setUsername] = useState("");
    const [userID, setUserID] = useState(null);
    const [count, setCount] = useState(0);
 
    useEffect(() => {
        // setUsername(localStorage.getItem("userName"));
        setUserID(localStorage.getItem("userID"));
        const user_id = localStorage.getItem("userID");
        console.log(user_id);    
        axios.get(`http://localhost:8000/api/user/get-detail/${user_id}`)
            .then((response) => {
                if(response.status === 200) {
                    setUsername(response.data.data.username);
                    console.log(response.data.data.username);   
                }
            })
            .catch((err) => {
                if(err.response.data) {
                    alert(err.response.data.msg);
                } else {
                    console.log(err.message);
                }
            })
    }, [count])

    function hanldePostReview() {
        console.log("Rating: ", rating),
        console.log("Comment: ", comment),
        axios.post(`http://localhost:8000/api/product/CreateReview/${prodID}`, {
            "uid": userID,
            "rating": rating,
            "comment": comment
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
              alert(error.response.data.msg);
            } else {
              console.error('Error:', error.message);
            }
          })
    
    }

    return(
        <div className="w-full rounded-md border"> 
        <div className="review border border-black rounded-md  p-2">
                <div className="flex flex-row space-x-2 items-baseline">
                    <span className="font-semibold mr-2">{useName}</span>
                    <div className=" text-gray-500 italic text-sm">{}</div>


                </div>
                <div>
                    <span  className={`star filled ${rating >= 1 ? "text-yellow-400" : ''}`}
                        onClick={() => setRating(1)}    
                        >★</span>
                    <span  className={`star filled ${rating >= 2 ? "text-yellow-400" : ''}`}
                        onClick={() => setRating(2)}    
                        >★</span>
                    <span  className={`star filled ${rating >= 3 ? "text-yellow-400" : ''}`}
                        onClick={() => setRating(3)}    
                        >★</span>
                    <span  className={`star filled ${rating >= 4 ? "text-yellow-400" : ''}`}
                        onClick={() => setRating(4)}    
                     >★</span>
                    <span  className={`star filled ${rating === 5 ? "text-yellow-400" : ''}`}
                        onClick={() => setRating(5)}    
                        >★</span>
                </div>
                <textarea className="comment border border-black w-full p-1"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                >
                    
                </textarea>

                <div className="flex justify-end">
                    <button className="bg-red-500 p-1  text-white font-bold hover:bg-red-600" 
                        onClick={hanldePostReview}
                    >Thêm nhận xét</button>
                </div> 
            </div>
        </div>
    )
}