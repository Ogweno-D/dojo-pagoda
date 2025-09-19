/**
 * Custom hook to fetch data from a URL
 * @param{string} url - The URL to fetch data from
 * @param{object} [options={}] - Optional fetch options (headers, body,methods, e.t.c
 * @return{object} - An object containing the data,loading state and error
 */
import {useCallback, useEffect, useState} from "react";
export const useFetch = <T,>( url:string, options={}) => {
    const [data, setData] = useState<T |null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error| null>(null);


        const fetchData = useCallback(async () => {
            const controller = new AbortController();
            setLoading(true);

            try{
                const token = import.meta.env.VITE_ADMIN_BEARER_TOKEN;
                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal,
                    headers:{
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        ...options.headers,
                    }
                });

                if(!response.ok){
                    throw new Error(`HTTP error: ${response.statusText}`);
                }

                const result:T  = await response.json();
                setData(result);
                setError(null);
            } catch(e:any){
                if(e.name !== 'AbortError'){
                    setError(e.message);
                }
            } finally {
                setLoading(false);
            }
        // fetchData();

        return () => {
            controller.abort();
        };

    },[url,JSON.stringify(options)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {data,loading,error, refetch:fetchData}
}