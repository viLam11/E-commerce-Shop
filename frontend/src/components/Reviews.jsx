import RenderStars from "./RenderStart";

export default function Reviews({rating, comment, customer_name, time}) {
    return (
        <div className="w-full">
            
            <div className="review border border-black rounded-md  p-2">
                <div className="flex flex-row space-x-2 items-baseline">
                    <span className="font-semibold mr-2">{customer_name}</span>
                    <div className=" text-gray-500 italic text-sm">{time}</div>


                </div>
                <RenderStars rating={rating} />
                <div className="comment">
                    <p className="pl-6">{comment}</p>
                </div>
            </div>
        </div>
    )
}