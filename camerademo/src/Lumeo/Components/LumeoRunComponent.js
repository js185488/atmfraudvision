
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
            predict:null,
            metaData:[],


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
                    {this.state.streamLists.map((stream) => {
                        return (
                            <div className='video'>
                                <iframe src={stream.uri} style={{width: '90%', height: '100%'}} allow='autoplay'>
                                    stream
                                    {stream.uri}
                                </iframe>
                                {stream.fraud_detected && <p className='fraudDetectedText'>{stream.fraud_detected}</p>}
                                {stream.objects && stream.objects.map((object) => {
                                    return (
                                        <>
                                            <p className='nonFraudText'>{object.label} </p>
                                            {
                                                object.attributes && object.attributes.length > 0 &&
                                                <p className='nonFraudText'>{object.attributes[0].label}</p>
                                            }
                                        </>
                                    )
                                })}

                            </div>

                        )
                    })
                    }


                </div>


                {this.props.demo === 'lumeoDemo' && <button className="demoButtons"
                                                            onClick={async () => {
                                                                console.log('Getting Cash')
                                                                await callGetCash()
                                                            }}>
                    Get Cash
                </button>}
                <button className="demoButtons" onClick={async () => {
                    this.setState({streamLists: []})
                    await this.getStreams()
                }}>
                    Stream Refresh
                </button>
                <button className="demoButtons"
                        onClick={() => {
                            this.props.setDemo(null)
                            setDeployment(hook_chain_id, 'stopped')

                        }}>
                    Stop
                </button>

            </div>
        )
    }
}
export default LumeoRunComponent;
