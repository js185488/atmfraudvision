const configStore = {
    lumeoBearerToken:'$lbXCXADeoTc7//79dqw1fRjbuUAdftdp',
    //lumeoBearerToken:'$ijQQqZYlZ9+U8hOlA7nVAuBGkvawHbQ7',//(ATM fraud app)
    //app_id:'8d38f078-6899-428f-beb6-0fb0c068cdb9', //(ATM fraud app)
    app_id:'bfd962d4-806e-46c7-88e9-be291399561e',
     hook_chain_id: 'e975cb9c-e920-4237-93e2-a15b5d2a0969', //deployment ids
    atm_fraud_id:'43b2f838-8a1a-4dbd-940c-fd998a635dc7',

};

if(process.env.NODE_ENV === "development"){

}

export const getConfig = () => {
    return configStore;
};
