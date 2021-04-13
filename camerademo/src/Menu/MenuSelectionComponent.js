
import React from 'react';
import '../App.css';
import {callPythonCoverDemo} from '../messages/callLocalServer'
import {callCppCoverDemo} from "../messages/callLocalServer";


export const ButtonSelectionComponent =({setDemo}) => {
    return(
        <div className="buttonContainer">
            <button className="demoButtons" onClick={()=>{
                setDemo('pyCoverDemo');
                callPythonCoverDemo()
            }}>
                Cover camera (python)
            </button>
            <button className="demoButtons" onClick={()=>{
                setDemo('cppCoverDemo');
                callCppCoverDemo();
            }}>
                Cover camera (cpp)
            </button>
            <button className="demoButtons"
                    onClick={()=>{
                        setDemo('webCoverDemo')
                    }}>
                Cover camera (web based)
            </button>
            {/* <button className="demoButtons"
                    onClick={()=>{
                        setDemo('loiteringDemo')
                    }}>
                Jackpotting Demo (web based)
            </button>*/}
            <button className="demoButtons" onClick={()=>{
                setDemo('pose');
            }}>
                Jackpotting Demo (pose)
            </button>
        </div>
    )
}
export default ButtonSelectionComponent;
