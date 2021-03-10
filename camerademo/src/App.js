import React, {useState} from 'react'
import './App.css';
import CoverCameraComponent from "./cameraComponets/coverCameraComponent";
import {callPythonCoverDemo} from './messages/callLocalServer'

function App() {
    const [demo, setDemo] = useState(null);

    return (
    <div className="App">
        {(demo==='webCoverDemo'?
            <CoverCameraComponent/>: null)}
        {(demo==='pyCoverDemo'?
            <>Running PythonDemo, Wait for terminal to open</>: null)}
        {(demo==='cppCoverDemo'?
            <>Running cpp Demo, Wait for terminal to open</>: null)}
        <div className="buttonContainer">
            <button className="demoButtons" onClick={()=>{
                setDemo('pyCoverDemo');
                callPythonCoverDemo()
            }}>
                Cover camera (python)
            </button>
            <button className="demoButtons" onClick={()=>{
                setDemo('cppCoverDemo')
            }}>
                Cover camera (cpp)
            </button>
            <button className="demoButtons"
                    onClick={()=>{
                setDemo('webCoverDemo')
            }}>
                Cover camera (web based)
            </button>
        </div>    </div>
  );
}

export default App;
