
import React, {Component, useEffect, useState} from 'react';
import {getLumeoStatus, callLumeoState} from '../../messages/callLocalServer'
import {getLumeoStreams, getCash} from '../lumeoMesages'
let interval;
let eventArr = []
class LumeoRunComponent extends Component {
    constructor(props) {
        super(props);
        this.webcam = React.createRef();
        this.state = {
            objects:[],
            event:null,
            streamLists:[],
            selectedStream:null,
            streamListLoaded:false


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
        const str = JSON.stringify(currentEvent)
        const n = str.search("video1.source_name");

        if(n >-1){
            const n1 = str.search("version");
            const cleaned = JSON.parse(str.substring(n-2,n1-3))
            console.log(cleaned)
            this.setState({event:cleaned, objects:cleaned.objects, streamListLoaded:true})
        }
    }
    getStreams = async () => {
       const result = await getLumeoStreams()
        const streamList = result.filter((stream)=> (stream.status==='online' &&  stream.stream_type === 'webrtc'))
        console.log(streamList)
        this.setState({streamLists:streamList})

    }


     getMetaData = async () => {
        const currentEvent = await getLumeoStatus();
        this.parseData(currentEvent)

    }
     startCapture = async () => {
        interval = setInterval(async () => {
           // await this.getMetaData()
        }, 10500);

    };





    render() {


        return (
            <div className="DemoContainer" style={{top:180, width:"100%"}}>
                <div>





                        { this.state.streamLists.map((stream)=>{
                                return(<iframe src={stream.uri} style={{width: 600, height:400}} allow='autoplay'>
                                        stream
                                        {stream.uri}
                                    </iframe>

                                )
                            })}
                    <button className="demoButtons"
                            onClick={async ()=>{
                                console.log('Getting Cash')
                                await getCash()
                            }}>
                        Get Cash
                    </button>


                </div>


                {
                    this.state.objects.map((object) => {
                        return(
                            <p>{object.label} & {object.probability}</p>
                        )
                    })

                }
                <button className="demoButtons"
                        onClick={()=>{
                            this.props.setDemo(null)
                        }}>
                    Stop
                </button>

            </div>
        )
    }
}
export default LumeoRunComponent;
