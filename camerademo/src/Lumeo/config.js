const configStore = {
    lumeoBearerToken:'$lbXCXADeoTc7//79dqw1fRjbuUAdftdp',
    app_id:'bfd962d4-806e-46c7-88e9-be291399561e',
     hook_chain_id: 'c9503097-c06e-444f-9ae5-8d617e2ae6cd'

};

if(process.env.NODE_ENV === "development"){

}

export const getConfig = () => {
    return configStore;
};
