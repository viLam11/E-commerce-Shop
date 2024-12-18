
export default function RenderStart({rating}) {
    const totalStars = 5;
    return (
        <>
            {[...Array(totalStars)].map((_, index) => (
                <span
                    key={index}
                    className={` ${index < rating ? 'filled text-yellow-400' : ''}`}
                >
                    ★
                </span>
            ))}
        </>
    );
};