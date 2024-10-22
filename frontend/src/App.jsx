import { useState } from "react";
import Form from "./components/Form";

export default function App() {
  // const [fileData, setFileData] = useState(null);
  // const [showImage, setShowImage] = useState(false); // To toggle image rendering

  // const handleClick = () => {
  //   fetch('http://localhost:4000/print/orders', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'image/png'  // Ensure it's set to the right image type
  //     }
  //   })
  //   .then(response => response.blob())  // Convert the response to a blob
  //   .then(blob => { 
  //     const imageURL = URL.createObjectURL(blob);
  //     setFileData(imageURL);  
  //     window.open(imageURL, '_blank');
  //   })
  //   .catch(error => console.error('Error fetching image:', error));
  // };

  return (
    <>
      <h1>THIS IS REACT</h1>
      <Form></Form>
    </>
  );
}
