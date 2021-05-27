import React, {useState} from 'react'
import './App.css';
import CoverCameraComponent from "../cameraComponets/coverCameraComponent";
import FaceDetection from "../cameraComponets/api/LoiteringDetection";
import ButtonSelectionComponent from "../Menu/MenuSelectionComponent";
import CameraSelectionComponent from "../Menu/CameraSelection";
import LumeoRunComponent from "../Lumeo/Components/LumeoRunComponent";
function older() {
    const [demo, setDemo] = useState(null);
    const [selectedCamera, setCamera] = useState(null);

    return (

        <div className="oldApp">
            <ButtonSelectionComponent setDemo={setDemo}/>
            <div className="oldDemoContainer">
                {((demo==='webCoverDemo')||(demo==='loiteringDemo')?
                    <CameraSelectionComponent setCamera={setCamera} />
                    :null)}
                {(demo==='webCoverDemo'?
                    <CoverCameraComponent selectedCamera={selectedCamera}/>: null)}
                {(demo==='loiteringDemo'?
                    <FaceDetection selectedCamera={selectedCamera}/>: null)}

                {(demo==='pyCoverDemo'?
                    <>Running PythonDemo, Wait for terminal to open</>: null)}
                {(demo==='cppCoverDemo'?
                    <>Running cpp Demo, Wait for terminal to open</>: null)}
                {(demo==='lumeoDemo'?
                    <LumeoRunComponent selectedCamera={selectedCamera}/>: null)}

            </div>
        </div>



    );
}
