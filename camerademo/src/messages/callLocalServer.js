//const serverIP = '153.73.253.204'
const serverIP=window.location.hostname


export function callPythonCoverDemo () {
    fetch(`http://localhost:8000/startPython`, {
        credentials: 'same-origin',
        method: 'GET'
    })
}
export function callCppCoverDemo () {
    fetch(`http://localhost:8000/startCPP`, {
        credentials: 'same-origin',
        method: 'GET'
    })
}
export async function callLumeoState () {
    await fetch(`http://localhost:8000/getlumeostatus`, {
        method: 'GET',
        redirect: 'follow',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            'Access-Control-Allow-Origin':'*'
        }


    }).then(result => console.log(result))
        .catch(error => console.log('error', error));

}
export async function callGetCash () {
    await fetch(`http://localhost:8000/getCash`, {
        method: 'GET',
        redirect: 'follow',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            'Access-Control-Allow-Origin':'*'
        }


    }).then(result => console.log(result))
        .catch(error => console.log('error', error));

}
export const getLumeoStatus = () => {
    const url = `http://${serverIP}:8000/getlumeostatus`;

    const payloadGeneric = {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            'Access-Control-Allow-Origin':'*'

}};
    return fetch(url, payloadGeneric)
        .then(handleResponse()).then((result) => {
            return {
                event: result,

            };
        }).catch((error) => {
            console.log(error)
            return {
                event : null,

            };
        });
};
export const handleResponse = () => {
    return function(response) {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.status);
    };
};

export const clearLumeoStatus =() =>{
    const url ='http://localhost:8000/clearlumeostatus'
    const payloadGeneric = {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            'Access-Control-Allow-Origin':'*'

        }};
    return fetch(url, payloadGeneric)
        .then(handleResponse()).then((result) => {
            return {
                event: result,

            };
        }).catch((error) => {
            console.log(error)
            return {
                event : null,

            };
        });
};
export const getLumeoMetadata =(fileid) =>{
    const url =`http://${serverIP}:8000/filemetadata`
    const payloadGeneric = {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            'Access-Control-Allow-Origin':'*'

        },
        body:JSON.stringify({file_id:fileid})
    };
    return fetch(url, payloadGeneric)
        .then(handleResponse()).then((result) => {
            return  result;
        }).catch((error) => {
            console.log(error)
            return {
                event : null,

            };
        });
};
export const getLumeoFileList =(deployment_id1,deployment_id2,file_limit) =>{
    const url =`http://${serverIP}:8000/fileList`
    const payloadGeneric = {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            'Access-Control-Allow-Origin':'*'

        },
        body:JSON.stringify({deployment_id1,deployment_id2,file_limit})
    };
    return fetch(url, payloadGeneric)
        .then(handleResponse()).then((result) => {
            return  result;
        }).catch((error) => {
            console.log(error)
            return {
                event : null,

            };
        });
};
export const getLumeoStreams =() =>{
    const url =`http://${serverIP}:8000/streams`
    const payloadGeneric = {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            'Access-Control-Allow-Origin':'*'

        },
    };
    return fetch(url, payloadGeneric)
        .then(handleResponse()).then((result) => {
            return  result;
        }).catch((error) => {
            console.log(error)
            return {
                event : null,

            };
        });
};

export const getLumeoFileURL =(fileid) =>{
    const url =`http://${serverIP}:8000/fileUrl`
    const payloadGeneric = {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            'Access-Control-Allow-Origin':'*'

        },
        body:JSON.stringify({file_id:fileid})
    };
    return fetch(url, payloadGeneric)
        .then(handleResponse()).then((result) => {
            return  result;
        }).catch((error) => {
            console.log(error)
            return {
                event : null,

            };
        });
};
