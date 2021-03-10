import logo from './logo.svg';
import './App.css';
import {useState} from 'react'
import CoverCameraComponent from "./cameraComponets/coverCameraComponent";
import PoseNet from "./modelComponents/poseNetComponent";
function App() {
    const [demoSelected, selectDemo] = useState('Pose');
  return (
    <div className="App">
        {demoSelected ==='Pose'? <PoseNet/>:<CoverCameraComponent/>}

    </div>
  );
}

export default App;
