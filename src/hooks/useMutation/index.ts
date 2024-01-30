import { useState } from 'react';

import { useAxios } from '@hooks/useAxios';

type IBody = {
    body: any;
}

const useMutation = (baseUrl: 'CORE_URL' | 'USER_URL', url: string) => {

    const api = useAxios(baseUrl);

    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const mutation = (body: IBody) => {
        setLoading(true);
        api
            .post(url, {
                ...body
            })
            .catch((err) => {
                setError(err);
            }) 
            .finally(() => {
                setLoading(false);
            });
    }

    return [
        mutation,
        {
            data,
            error,
            loading
        }
    ]
}

export { useMutation };