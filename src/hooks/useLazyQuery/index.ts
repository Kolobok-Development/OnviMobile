import { useState } from 'react';

import { useAxios } from '@hooks/useAxios';

const useLazyQuery = (baseUrl: 'CORE_URL' | 'USER_URL', url: string) => {

    const api = useAxios(baseUrl);

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const query = () => {
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

    return [
        query,
        {
            loading,
            error,
            data
        }
    ];
}

export { useLazyQuery };