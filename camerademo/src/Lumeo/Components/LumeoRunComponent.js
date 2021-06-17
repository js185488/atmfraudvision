
import React, {Component, useEffect, useState} from 'react';
import {getLumeoStatus, callLumeoState,callGetCash,clearLumeoStatus} from '../../messages/callLocalServer'
import {getLumeoStreams, setDeployment,getDeploymentStatus} from '../lumeoMesages'
import Lottie from "react-lottie";
import VideoLoading from "../../icons/fraud_detection_2.json";
//import CashSlotComponent from '../../cameraComponets/teachableMachineComponent'
import {getConfig} from "../config";
let interval;
const {hook_chain_id,atm_fraud_id} = getConfig();


class LumeoRunComponent extends Component {
    constructor(props) {
        super(props);
        this.webcam = React.createRef();
        this.state = {
            objects:[],
            event:null,
            streamLists:[],
            selectedStream:null,
            streamListLoaded:false,
            predictionArr:[],
            predict:null,
            metaData:[],
            deploymentLoading:true


        };
    }

    componentWillMount = async () => {
        this.startCapture();
        this.getStreams();
        this.checkDeploymentStatus();
    };
    componentWillUnmount() {
        clearInterval(interval);

    };

    parseData = (currentEvent) =>{
        const newStreamList=[];
        if(currentEvent && currentEvent.event ) {
            const obj = currentEvent.event;
            const k = Object.keys(obj);
            const o = obj[String(k)];
            const stream_obj_changed = []
            for (let meta of k){
                const m = obj[meta]
                const st= this.state.streamLists.filter((stream)=>(stream.id===meta))
                console.log(...st)
                if(st.length>0) {
                    newStreamList.push({...st[0], ...m})
                    stream_obj_changed.push(meta)
                }
            }
            let streamsUnchanged = this.state.streamLists
            if(stream_obj_changed.length>0) {
                for (let id of stream_obj_changed)
                   streamsUnchanged= streamsUnchanged.filter((stream) => (id !== stream.id))
            }
            newStreamList.push(...streamsUnchanged)
            //console.log('streams unchanged', streamsUnchanged)
            //console.log(newStreamList)
            this.setState({streamLists:newStreamList})
        }


            //this.setState({event:cleaned, objects:cleaned.objects, streamListLoaded:true})

    }
    getStreams = async () => {
       const result = await getLumeoStreams()

        const streamList = result.filter((stream)=> ((this.props.demo ==='lumeoDemo'?
            (stream.status==='online' &&  stream.stream_type === 'webrtc' && stream.deployment_id!==hook_chain_id):
            (stream.deployment_id===hook_chain_id))) )

        //console.log(streamList)
        this.setState({streamLists:streamList})

    }

    checkDeploymentStatus = async ()=>{
        const deployId=this.getDeploymentId()
        const status = await getDeploymentStatus(deployId)
        if(status && status==='running') {
            this.setState({deploymentLoading: false})
            this.getStreams()
        }else {
            this.checkDeploymentStatus()
        }
    }



     getMetaData = async () => {
        const currentEvent = await getLumeoStatus();
        await this.parseData(currentEvent)

    }
     startCapture = async () => {
        interval = setInterval(async () => {
            await this.getMetaData()
        }, 1000);

    };

    setCustomModel = (res) =>{
        if(res.length>0) {
            const max = Math.max(...res.map(o => o.confidence), 0);
            //console.log(max)

            const predict = res.filter(obj => (obj.confidence === max));
            //console.log('pre',predict)
            this.setState({predictionArr: res, predict: predict[0].label})
        }
    }



    checkStreamId=(stream_id)=>{
        return stream_id ==="9ad13ad8-f66f-4e7b-94ef-3c0331e0acc7"//cash slot stream_id
    }
    getDeploymentId =()=>{
        return (this.props.demo ==='lumeoDemo'?atm_fraud_id:hook_chain_id)
    }


    render() {
        let objectsDetected = null
        if (this.state.objects.length > 1) {
            objectsDetected =
                this.state.objects.map((object) => {
                    return (
                        <p style={{color: 'white'}}>{object.label} & {object.probability}</p>
                    )
                });
        }


        return (
            <div className="DemoContainer" style={{height: '100vh', width: "100vw"}}>
                <div className='videoContainer'>
                    {/* <div className='video'>
                        {this.props.demo === 'lumeoDemo' &&
                        <CashSlotComponent callback={(res) => {
                            //console.log(res)
                            this.setCustomModel(res)
                        }}>
                        </CashSlotComponent>
                        }
                        {this.state.predict &&
                        <p className={(this.state.predict === 'Finger jam' ? 'fraudDetectedText' : 'nonFraudText')}>
                            {this.state.predict}</p>}
                    </div>
                    */}
                    {(this.state.deploymentLoading ?
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            < h2 style={{color: 'white', paddingTop: 10, fontSize: 56}}>Loading ATM Fraud Demo</h2>
                            <Lottie options={{animationData: VideoLoading, loop: true, autoplay: true}}
                                    speed={.75}
                                    height={400}
                                    width={600}/>


                        </div> :
                        this.state.streamLists.map((stream) => {//"9ad13ad8-f66f-4e7b-94ef-3c0331e0acc7"
                            return (
                                <div className='video'>
                                    <iframe src={stream.uri} style={{
                                        width: (this.checkStreamId(stream.stream_id) ? '400px' : '90%'),
                                        height: (this.checkStreamId(stream.stream_id) ? '400px' : '100%'),
                                        transform: (this.checkStreamId(stream.stream_id) ? 'rotate(90deg)' : 'scale(-1, 1)')
                                    }} allow='autoplay'>
                                        stream
                                        {stream.uri}
                                    </iframe>
                                    {stream.fraud_detected &&
                                    <p className='fraudDetectedText'>{stream.fraud_detected}</p>}
                                    {stream.camera_message && <p className='nonFraudText'>{stream.camera_message}</p>}
                                    {stream.vehicle_message && <p className='nonFraudText'>{stream.vehicle_message}</p>}
                                    {stream.persons_message && <p className='nonFraudText'>{stream.persons_message}</p>}
                                    {stream.weapons_message && <p className='nonFraudText'>{stream.weapons_message}</p>}
                                    {stream.loitering_message && <p className='nonFraudText'>{stream.loitering_message}</p> }
                                    {stream.objects && stream.objects.map((object) => {
                                        return (
                                            <>
                                                {/*<p className='nonFraudText'>{object.label} </p>*/}
                                                {object.attributes && object.attributes.length > 0 && object.attributes[0].label === 'finger_jam' &&
                                                <p className='fraudDetectedText'>Finger jam Detected!</p>}

                                                {
                                                    object.attributes && object.attributes.length > 0 &&
                                                    <p className='nonFraudText'>{object.attributes[0].label}</p>
                                                }
                                            </>
                                        )
                                    })}

                                </div>

                            )
                        }))
                    }}


                </div>
                {
                    !this.state.deploymentLoading &&
                    <>


                        {this.props.demo === 'lumeoDemo' && <button className="demoButtons"
                                                                    onClick={async () => {
                                                                        console.log('Getting Cash')
                                                                        await callGetCash()
                                                                    }}>
                            Get Cash
                        </button>}
                        <button className="demoButtons" onClick={async () => {
                            clearLumeoStatus()

                            this.setState({streamLists: []})
                            await this.getStreams()
                            setDeployment(this.getDeploymentId(), 'running')
                        }}>
                            Refresh Video
                        </button>
                        <button className="demoButtons"
                                style={{backgroundColor: 'red'}}
                                onClick={() => {
                                    this.props.setDemo(null)
                                    clearLumeoStatus()

                                    setDeployment(this.getDeploymentId(), 'stopped')
                                    //setDeployment(atm_fraud_id,'stopped')

                                }}>
                            Stop
                        </button>
                    </>}

            </div>
        )
    }
}
export default LumeoRunComponent;
