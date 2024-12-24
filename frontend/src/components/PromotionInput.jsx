
export default function PromotionInput({ name, setValue, value }) {

    function handleChangeValue(value) {
        setValue(value);
    }

    if (name == "percentage") {
        return (
            <>
                <span>Giá trị : </span>
               
                <input type="number" min={1} max={100} className="mt-2 mr-2 bg-gray-100 hover:border hover:border-black w-1/2"
                    onChange={(e) => handleChangeValue(e.target.value)}
                    value={value}
                /> %
            </>
        )
    } else {
        return (
            <>
                <span>Giá trị : </span>
                <input type="number" min={10000} className="mt-2 mr-2 bg-gray-100 hover:border hover:border-black w-1/2"
                    onChange={(e) => handleChangeValue(e.target.value)}
                    value={value}
                /> VND
            </>

        )
    }
}