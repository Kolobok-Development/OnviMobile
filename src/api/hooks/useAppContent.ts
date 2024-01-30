
import {
    getCampaign,
    getCampaigns,
    getCarWashes,
    getNewsPost,
    getNewsPosts,
    getPartner,
    getPartners
} from "../AppContent/appContent";
import {useQuery} from "@tanstack/react-query";
import {BusinessSuccessRequestPayload} from "../AppContent/types";

function usePartner( id: number) {
    return useQuery([`partner-${id}`], () => getPartner(id), {
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (err) => {
            console.log(err);
        }
    })
};

function usePartners() {
    return useQuery(['partner'], () => getPartners(), {
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (err) => {
            console.log(err);
        }
    })
};

function useCampaign(id: number) {
    return useQuery([`campaign-${id}`], () => getCampaign(id), {
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (err) => {
            console.log(err);
        }
    })
}

function useCampaigns(){
    return useQuery(['campaign'], () => getCampaigns(), {
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (err) => {
            console.log(err);
        }
    })
}

function useBusiness(query: {[key: string]: string}, automatic: boolean = true) {
    return useQuery(['business'], () => getCarWashes(query), {
        enabled: automatic,
        onSuccess: (data: BusinessSuccessRequestPayload | undefined) => {
            console.log(data);
        },
        onError: (err) => {
            console.log(err);
        }
    })
}


function useNewsPosts() {
    return useQuery(['news'], () => getNewsPosts(), {
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (err) => {
            console.log(err);
        }
    } )
}

function useNewsPost(id: number) {
    return useQuery([`news-${id}`], () => getNewsPost(id), {
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (err) => {
            console.log(err);
        }
    } )
}



export { usePartner, usePartners, useCampaigns, useCampaign, useBusiness, useNewsPosts, useNewsPost }
