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

export const getDeploymentStatus = (deployment_id)=>{
    const {app_id, lumeoBearerToken} = getConfig();

    const url = `https://api.lumeo.com/v1/apps/${app_id}/deployments/${deployment_id}`

    const payloadGeneric = {
        method: "GET",
        credentials: 'same-origin',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${lumeoBearerToken}`

        },
    };
    return fetch(url, payloadGeneric)
        .then(handleResponse()).then((result) => {
            return result.state;
        }).catch((error) => {
            return {
                message:''
            };
        });
}


export const setDeployment =(deployment_id, state) =>{
    const {app_id, lumeoBearerToken,hook_chain_id} = getConfig();
    const url = `https://api.lumeo.com/v1/apps/${app_id}/deployments/${deployment_id}/state`;

    const payloadGeneric = {
        method: "PUT",
        credentials: 'same-origin',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${lumeoBearerToken}`

        },
        body: state
    };
    return fetch(url, payloadGeneric)
        .then(handleResponse()).then((result) => {
            return result;
        }).catch((error) => {
            return {
                message:''
            };
        });
};


export const getCash=()=>{
    const dispenseURL= 'http://153.73.151.162:3001/api/deliverypoints/ATM/Atlanta/6684-BAY04A/allocations/1'
    const raw = JSON.stringify({"action":"DISPENSE","params":"{\"amount\": \"40\",\"notes_taken_timeout\": 40}"});

    const payloadGeneric = {
        method: "PUT",
        credentials: 'same-origin',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            'Access-Control-Allow-Origin': 'http://localhost:3000'
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
