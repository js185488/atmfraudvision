
import React, {Component, useEffect, useState} from 'react';
import {getLumeoStatus, callLumeoState,callGetCash} from '../../messages/callLocalServer'
import {getLumeoStreams, setDeployment} from '../lumeoMesages'
import CashSlotComponent from '../../cameraComponets/teachableMachineComponent'
import {getConfig} from "../config";
let interval;
let eventArr = [];
const {app_id, lumeoBearerToken,hook_chain_id} = getConfig();


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
            predict:null


        };
    }

    componentWillMount = async () => {
        this.startCapture();
        this.getStreams();
    };
    componentWillUnmount() {
        clearInterval(interval);

    };
    parseData = (currentEvent) =>{
        if(currentEvent && currentEvent.event && currentEvent.event.meta) {
            const obj = currentEvent.event;
            const k = Object.keys(obj.meta);
            const o = obj.meta[String(k)];
            console.log(o)
            this.setState({event:o, objects:o.objects})
        }


            //this.setState({event:cleaned, objects:cleaned.objects, streamListLoaded:true})

    }
    getStreams = async () => {
       const result = await getLumeoStreams()
        const streamList = result.filter((stream)=> (stream.status==='online' &&  stream.stream_type === 'webrtc'|| stream.deployment_id===hook_chain_id))
        console.log(streamList)
        this.setState({streamLists:streamList})

    }



     getMetaData = async () => {
        const currentEvent = await getLumeoStatus();
        await this.parseData(currentEvent)

    }
     startCapture = async () => {
        interval = setInterval(async () => {
            await this.getMetaData()
        }, 10500);

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






    render() {
        let objectsDetected = null
        if( this.state.objects.length>1) {
            objectsDetected =
                this.state.objects.map((object) => {
                    return (
                        <p style={{color: 'white'}}>{object.label} & {object.probability}</p>
                    )
                });
        }


        return (
            <div className="DemoContainer" style={{height:'100vh', width:"100vw"}}>
                <div className='videoContainer' >
                    <div className='video'>
                    <CashSlotComponent callback={(res)=>{
                        //console.log(res)
                        this.setCustomModel(res)
                    }}>
                    </CashSlotComponent>
                    {this.state.predict && <p style={{ color:(this.state.predict==='Finger jam'?'red':'white'),
                        'font-size': (this.state.predict ==='Finger jam'? '24px':'normal'), 'font-weight':(this.state.predict==='Finger jam'? 'bold':'initial')
                    }}>{
                        this.state.predict}</p>}
                    </div>

                    { this.state.streamLists.map((stream)=>{
                                return(
                                    <div className='video'>
                                    <iframe src={stream.uri} style={{width:380,height:285}} allow='autoplay'>
                                        stream
                                        {stream.uri}
                                    </iframe>

                                    </div>

                                )
                            })}


                </div>




                <button className="demoButtons"
                        onClick={async ()=>{
                            console.log('Getting Cash')
                            await callGetCash()
                        }}>
                    Get Cash
                </button>
                <button className="demoButtons" onClick={async()=>{
                    this.setState({streamLists:[]})
                    await this.getStreams()}}>
                    Stream Refresh
                </button>
                <button className="demoButtons"
                        onClick={()=>{
                            this.props.setDemo(null)
                            setDeployment(hook_chain_id,'stopped')

                        }}>
                    Stop
                </button>

            </div>
        )
    }
}
export default LumeoRunComponent;
