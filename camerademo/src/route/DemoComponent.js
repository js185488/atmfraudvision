import React, {useState} from 'react'
import '../App.css';
import LumeoRunComponent from "../Lumeo/Components/LumeoRunComponent";
import LumeoMenuComponent from "../Lumeo/Components/LumeoMenuComponent";
function DemoComponent() {
    const [demo, setDemo] = useState(null);
    const [selectedCamera, setCamera] = useState(null);

    return (

        <div className="App">
            <div className="DemoContainer">
                { <LumeoMenuComponent demo={demo} setDemo={setDemo}/>}
                {(demo==='lumeoDemo'?
                    <LumeoRunComponent demo={demo} setDemo={setDemo}/>: null)}
                {(demo==='savedVideo'?
                    <LumeoRunComponent setDemo={setDemo} demo={demo}/>: null)}

            </div>
        </div>



    );
}

export default DemoComponent;
