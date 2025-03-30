"use client"
import React from 'react'
import { useEffect, useState } from 'react'

const Dashboard = () => {
    const [data, setData] = useState<SensorData | null>(null);
    const [error, setError] = useState<string | null>(null);

    interface SensorData {
        Temperature: number;
    }
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:5000/data");
                const newData = await res.json();
                setData(newData);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data", );
            }
        };
        
        // Fetch immediately
        fetchData();
        
        // Then set up interval to fetch regularly
        const interval = setInterval(fetchData, 5000);
        
        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, []);
    
    return (
        <div>
            {error ? (
                <p>Error: {error}</p>
            ) : !data ? (
                <p>Loading...</p>
            ) : (
                <div className='flex'>
                    <h2>Temperature:</h2>
                    <p>{data.Temperature !== undefined ? `${data.Temperature}°C` : "No data available"}</p>
                </div>
            )}
        </div>
    )
}

export default Dashboard