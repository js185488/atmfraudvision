import React ,{Component} from "react";

import NativeSelect from '@material-ui/core/NativeSelect';


class CameraSelectionComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            camera: 'IntelRealSense',
            cameraDevices: [], deviceId: ''
        }
    }
    componentDidMount() {
        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                console.log(devices);
                const cams = [];
                devices.forEach((device) => {
                    if (device.kind === 'videoinput' && !device.label.includes('AvStream')) {
                        cams.push(device);
                        console.log(device.kind + ": " + device.label +
                            " id = " + device.deviceId);
                    }
                });
                const t = cams[0].label.substring(0, cams[0].label.lastIndexOf('('));
                const deviceId = cams[0].deviceId;
                console.log(deviceId);
                this.props.setCamera(deviceId)
                this.setState({camera: t, cameraDevices: cams, deviceId: deviceId})


            })
            .catch(function (err) {
                console.log(err.name + ": " + err.message);
            });
    }
    render() {
        const handleCameraChange =(event) => {
            const camLabel = this.state.cameraDevices.filter((dn)=> dn.deviceId === event.target.value);
            console.log(camLabel[0].label.substring(0,camLabel[0].label.lastIndexOf('(') ));
            const selectedCam = camLabel[0].label.substring(0,camLabel[0].label.lastIndexOf('(') );
            this.setState({camera:selectedCam});
        };
        const setDeviceId = (deviceId)=>{
            this.props.setCamera(deviceId)

            this.setState({deviceId:deviceId})
        };
        return(

            <>
                <NativeSelect
                    style={{background:'white', paddingLeft:20}}
                    onChange={(event) => {
                        setDeviceId(event.target.value);
                        handleCameraChange(event)

                    }}
                    inputProps={{
                        name: 'age',
                        id: 'age-native-label-placeholder',
                    }}
                >
                    {
                        this.state.cameraDevices&&  this.state.cameraDevices.map(device=>(
                            <option value={device.deviceId} >{device.label}</option>
                        ))
                    }
                </NativeSelect>
            </>
        )
    }
}

export default CameraSelectionComponent;
