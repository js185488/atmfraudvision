import React, {useState} from 'react'
import './App.css';
import CoverCameraComponent from "./cameraComponets/coverCameraComponent";
import FaceDetection from "./cameraComponets/api/LoiteringDetection";
import ButtonSelectionComponent from "./Menu/MenuSelectionComponent";
function App() {
    const [demo, setDemo] = useState(null);

    return (

    <div className="App">
        <ButtonSelectionComponent setDemo={setDemo}/>
        <div className="DemoContainer">
        {(demo==='webCoverDemo'?
            <CoverCameraComponent/>: null)}
        {(demo==='loiteringDemo'?
            <FaceDetection/>: null)}

        {(demo==='pyCoverDemo'?
            <>Running PythonDemo, Wait for terminal to open</>: null)}
        {(demo==='cppCoverDemo'?
            <>Running cpp Demo, Wait for terminal to open</>: null)}
           </div>
    </div>



  );
}

export default App;
