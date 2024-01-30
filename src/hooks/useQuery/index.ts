import { useEffect, useState } from "react";

import { useAxios } from '@hooks/useAxios';

const useQuery = (baseUrl: 'CORE_URL' | 'USER_URL', url: string) => {

    const api = useAxios(baseUrl);

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const refetch = () => {
        setLoading(true);
        api
            .get(url).then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                setError(err);
            }) 
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {   
        setLoading(true);
        api
            .get(url).then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                setError(err);
            }) 
            .finally(() => {
                setLoading(false);
            });
    }, [url]);

    return { data, loading, error, refetch };
}

export { useQuery };