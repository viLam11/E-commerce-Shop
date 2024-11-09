import React, { useState, useEffect } from 'react';

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/data')  // URL API của backend
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return data;
}

export default App;
