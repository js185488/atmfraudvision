import {getConfig} from "./config";

export const handleResponse = () => {
    return function(response) {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.status);
    };
};

export const handleResponseFile = () => {
    return function(response) {
        console.log((response))
        if(response.ok) {
            return response.buffer();
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

export const getFileList=(deployment_id)=>{
    const {app_id, lumeoBearerToken,hook_chain_id} = getConfig();

    const url =` https://api.lumeo.com/v1/apps/${app_id}/files?deployment_ids[]=${deployment_id}`;
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
            return result;
        }).catch((error) => {
            return {
                message:''
            };
        });
}
export const getFileURL=(file_id)=>{
    const {app_id, lumeoBearerToken,hook_chain_id} = getConfig();

    const url = `https://api.lumeo.com/v1/apps/${app_id}/files/${file_id}`
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
            return result;
        }).catch((error) => {
            return {
                message:''
            };
        });

}

export const getFileMetaData=(file_id)=>{
    const {app_id, lumeoBearerToken,hook_chain_id} = getConfig();

    const url = `https://api.lumeo.com/v1/apps/${app_id}/files/${file_id}/data`
    const payloadGeneric = {
        method: "GET",
        credentials: 'same-origin',
        mode:'no-cors',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${lumeoBearerToken}`

        },
    };
    return fetch(url, payloadGeneric)
        .then(handleResponse()).then((result) => {
            return result;
        }).catch((error) => {
            return {
                message:''
            };
        });

}
export const getAmazonMeta= (meta)=>{
    //const {app_id, lumeoBearerToken,hook_chain_id} = getConfig();

    //const url = `https://api.lumeo.com/v1/apps/${app_id}/files/${file_id}/data`
    console.log(meta.metadata_url)
    const url =meta.metadata_url
    const payloadGeneric = {
        method: "GET",
        mode:'no-cors',
        redirect: 'follow'
    };
    return fetch(url, payloadGeneric)
        .then(response => response.json()).then((result) => {
            console.log('metadata', result)
            return result;
        }).catch((error) => {
            return {
                message:error
            };
        });

}


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
