import { useState, useEffect } from 'react'

export default function OwnersCount(){
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetch("https://milechain.netlify.app/.netlify/functions/getOwnersCount?network=sepolia", {method: "GET"})
        .then((res) => res.json())
        .then((data) => {
          setData(data.count)
          setLoading(false)
        })
      }, []);

      if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No data</p>

    return <p>{data} owners</p>
}