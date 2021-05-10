import {getConfig} from "./config";

export const handleResponse = () => {
    return function(response) {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.status);
    };
};


export const getLumeoStreams= () => {
    const {app_id, lumeoBearerToken} = getConfig();
    const url = `https://api.lumeo.com/v1/apps/${app_id}/streams`;

    const payloadGeneric = {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${lumeoBearerToken}`

        }
    };
    return fetch(url, payloadGeneric)
        .then(handleResponse()).then((result) => {
            return result;
        }).catch((error) => {
            return {
                streamsList : []
            };
        });
};
