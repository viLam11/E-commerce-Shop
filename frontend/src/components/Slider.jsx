import { useState, useEffect } from "react";

const images = [
    // "../public/banner1.png",
    // "../public/banner2.jpg",
    "../../public/banner1.jpg"
    // Add more image paths as needed
];

export default function Slider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-2/3 h-64">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
                >
                    <img src={image} alt={`Slide ${index}`} className="w-auto mx-auto h-full object-cover" />
                </div>
            ))}
        </div>
    );
}