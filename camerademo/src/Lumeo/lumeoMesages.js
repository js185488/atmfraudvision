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
        credentials: 'same-origin',
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


export const getCash=()=>{
    const dispenseURL= 'http://localhost:3001/api/deliverypoints/ATM/Atlanta/6684-BAY04A/allocations/1'
    const raw = JSON.stringify({"action":"DISPENSE","params":"{\"amount\": \"40\",\"notes_taken_timeout\": 40}"});

    const payloadGeneric = {
        method: "PUT",
        credentials: 'same-origin',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body:raw
    };
    return fetch(dispenseURL, payloadGeneric)
        .then(handleResponse()).then((result) => {
            return result;
        }).catch((error) => {
            return {
                streamsList : []
            };
        });

}
