const configStore = {
    lumeoBearerToken:'$lbXCXADeoTc7//79dqw1fRjbuUAdftdp',
    app_id:'bfd962d4-806e-46c7-88e9-be291399561e'
   };

if(process.env.NODE_ENV === "development"){

}

export const getConfig = () => {
    return configStore;
};
