import React, {useState} from 'react'
import './App.css';
import RouteComponent from './route/RouteConfig'
function App() {
    const [demo, setDemo] = useState(null);
    const [selectedCamera, setCamera] = useState(null);

    return (<RouteComponent/>);
}

export default App;
