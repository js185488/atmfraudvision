import FaceDetection from "../cameraComponets/api/LoiteringDetection";
import React from 'react';
import '../App.css';



export const Demo =({demo, selectedCamera}) => {
    return(
        <>
            <FaceDetection selectedCamera={selectedCamera}/>
        </>
    )}
    export default Demo;
