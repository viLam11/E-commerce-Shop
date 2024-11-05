import { useEffect, useState } from "react";
import Form from "./components/Form";
import axios from 'axios'
import { useQuery } from "@tanstack/react-query";

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './redux/slides/counterSlide'

export default function App() {
  // useEffect(() => {
  //   fetchApi()
  // }, [])
  const fetchApi = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/getAll`)
    return res.data
    //const res = await axios.get(`http://localhost:8000/api/product/getAll?page=0&limit=5`)
    //console.log("res", res)
  }
  const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi })
  console.log("query", query)
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}

// export default function App() {
//   // const [fileData, setFileData] = useState(null);
//   // const [showImage, setShowImage] = useState(false); // To toggle image rendering

//   // const handleClick = () => {
//   //   fetch('http://localhost:4000/print/orders', {
//   //     method: 'GET',
//   //     headers: {
//   //       'Content-Type': 'image/png'  // Ensure it's set to the right image type
//   //     }
//   //   })
//   //   .then(response => response.blob())  // Convert the response to a blob
//   //   .then(blob => {
//   //     const imageURL = URL.createObjectURL(blob);
//   //     setFileData(imageURL);
//   //     window.open(imageURL, '_blank');
//   //   })
//   //   .catch(error => console.error('Error fetching image:', error));
//   // };

//   return (
//     <>
//       <h1>THIS IS REACT</h1>
//       <Form></Form>
//     </>
//   );
// }
