const configStore = {
    lumeoBearerToken:'$lbXCXADeoTc7//79dqw1fRjbuUAdftdp',
    //lumeoBearerToken:'$ijQQqZYlZ9+U8hOlA7nVAuBGkvawHbQ7',//(ATM fraud app)
    //app_id:'8d38f078-6899-428f-beb6-0fb0c068cdb9', //(ATM fraud app)
    app_id:'bfd962d4-806e-46c7-88e9-be291399561e',
     hook_chain_id: 'c9503097-c06e-444f-9ae5-8d617e2ae6cd', //deployment ids
    atm_fraud_id:'43b2f838-8a1a-4dbd-940c-fd998a635dc7',

};

if(process.env.NODE_ENV === "development"){

}

export const getConfig = () => {
    return configStore;
};
