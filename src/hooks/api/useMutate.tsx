
import {useState} from "react";

export const useMutate =<TData =unknown, TVariables = unknown, TError = Error> () => {
    const [data, setData] = useState<TData | null>(null);
    const [error, setError] = useState<TError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const mutate = async (
        url: string,
        method: "POST" | "PATCH" | "PUT" | "DELETE",
        body?: TVariables,
        options? : RequestInit
    ) => {
        setLoading(true);
        setError(null);

        try{
            const  fetchOptions: RequestInit = {
                ...options,
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    ...options?.headers,
                }
            };
            if(body) {
                fetchOptions.body = JSON.stringify(body);
            }

            const response = await fetch(url, fetchOptions);

            if(!response.ok) {
                const errorData = await response.json();
                throw  new Error(errorData.message || `HTTP/${response.status}: ${errorData}`);
            }

            const result: TData = await response.json();
            setData(result);
            return result;
        } catch (e: any){
            setError( e as TError);
            throw e;
        }finally {
            setLoading(false);
        }
    }

    return { mutate, data, error, loading};
}