import React, {useState} from 'react'
import './App.css';
import CoverCameraComponent from "./cameraComponets/coverCameraComponent";
//import FaceDetection from "./cameraComponets/api/LoiteringDetection";
import ButtonSelectionComponent from "./Menu/MenuSelectionComponent";
import CameraSelectionComponent from "./Menu/CameraSelection";
import PoseNet from "./modelComponents/poseNetComponent";
function App() {
    const [demo, setDemo] = useState(null);
    const [selectedCamera, setCamera] = useState(null);

    return (

    <div className="App">
        <ButtonSelectionComponent setDemo={setDemo}/>
        <div className="DemoContainer">
            {((demo==='webCoverDemo')||(demo==='loiteringDemo')||(demo==='pose')?
                <CameraSelectionComponent setCamera={setCamera} />
            :null)}
        {(demo==='webCoverDemo'?
            <CoverCameraComponent selectedCamera={selectedCamera}/>: null)}
        {(demo==='loiteringDemo'?
            '': null)}
        {(demo==='pose'?
                <PoseNet selectedCamera={selectedCamera}/>:null)}

        {(demo==='pyCoverDemo'?
            <>Running PythonDemo, Wait for terminal to open</>: null)}
        {(demo==='cppCoverDemo'?
            <>Running cpp Demo, Wait for terminal to open</>: null)}
           </div>
    </div>



  );
}

export default App;
