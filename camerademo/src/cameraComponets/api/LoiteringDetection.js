import React, { Component, useState } from 'react';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription, loadSSDModel, setFaceRecognition, getFaceMatcher, getCustomerFace } from '../api/face';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import LottieEyeComponent from '../../icons/lottiefiles/LottieEyeComponent'


import { Button } from '@material-ui/core';
let beginMatchTime;
let startMatchingTime;

const WIDTH = 325; //420
const HEIGHT = 325; //420
const inputSize = 160;
let interval;


function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

class FaceDetection extends Component {
    constructor(props) {
        super(props);
        this.webcam = React.createRef();
        this.state = {
            fullDesc: null,
            detections: null,
            descriptors: null,
            faceMatcher: null,
            match: null,
            facingMode: null,
            imgsrc:null,
            tinyModelBool:true,
            initalLoading:true,
            facelandmark:null,
            LoadingSSDMOdel:false,
            gender:null,
            genderProbability:null,
            expressions:null,
            showFaceMarks:false,
            showDrawBox:true,
            age:null,
            regions:null,
            continousRegion:false,
            faceSearching:false,
            livecapture:false, bestMatch:'',
            faceRecogBool:true, customerArr:[],
            openDialog:false, loiteringTime:0

        };
    }
    checkStatus = () =>{

    };


    componentWillMount = async () => {
        this.checkStatus();
        this.setState({initalLoading:true})
        await loadModels().then( async()=>{
            console.log("Models Loaded")});
        this.setInputDevice();
        startMatchingTime = new Date();
    };

    setCustomer= async (img)=>{

        console.log('Setting Customer');
        await getCustomerFace(img, inputSize, '1').then((faceMatcher)=>{
            this.setState({faceMatcher})
        })
    };


    setInputDevice = () => {
        navigator.mediaDevices.enumerateDevices().then(async devices => {
            let inputDevice = await devices.filter(
                device => device.kind === 'videoinput'
            );
            if (inputDevice.length < 2) {
                await this.setState({
                    facingMode: 'user'
                });
            } else {
                await this.setState({
                    facingMode: { exact: 'environment' }
                });
            }
            this.startCapture();
        });
    };

    startCapture = () => {
        interval = setInterval(() => {
            this.capture();
        }, 1500);
    };

    componentWillUnmount() {
        clearInterval(interval);
    }



    capture = async () => {
        const img = this.webcam && this.webcam.current && this.webcam.current.getScreenshot();
        if(img){

            if (!!this.webcam.current) {

                await getFullFaceDescription(
                    img,
                    inputSize,
                    true,true, this.state.faceMatcher
                ).then(async (fullDesc) => {
                    if (!!fullDesc) {
                        console.log(fullDesc)
                        this.setFaceOutput(fullDesc);
                        this.setState({
                            detections: fullDesc.map(fd => fd.detection),
                            descriptors: fullDesc.map(fd => fd.descriptor),
                            facelandmark:fullDesc.map(fd=> fd.landmarks ),
                        });
                    }
                    if(fullDesc&&fullDesc.length ==0 ) {
                        this.setState({faceSearching:true});
                        if(new Date() - startMatchingTime> 5000 && this.state.customerArr.length > 0){
                            //localStorage.setItem(`CustomerArray_${parseInt(localStorage.getItem('CustomerId'))-1}`, JSON.stringify(this.state.customerArr))

                            this.setState({faceMatcher:null, customerArr:[],loiteringTime:0})

                        }

                    } else if(fullDesc && fullDesc.length> 0){
                        this.setState({faceSearching:false})


                    }
                });

                if (!!this.state.descriptors && !!this.state.faceMatcher && this.state.faceRecogBool && !this.state.faceSearching) {
                    let match = await this.state.descriptors.map(descriptor =>
                        this.state.faceMatcher.findBestMatch(descriptor)
                    );
                    this.setState({ match });
                    if(match.length>0){
                        startMatchingTime = new Date();

                        match.forEach(element =>{
                            if(element._label!=='unknown'){
                                localStorage.setItem('currentCustomer', element._label);
                                const gender = this.state.gender;
                                const age = JSON.stringify(this.state.age);
                                const newObj = {...this.state.expressions, gender, age, customerId:element._label, date:new Date()};
                                const newArr = [...this.state.customerArr, newObj];
                                console.log(newArr);
                                const loiteringTime = (new Date() - beginMatchTime)/1000;
                                this.setState({customerArr:newArr, loiteringTime})
                                console.log("===================== Ms", new Date() - beginMatchTime)
                            }
                        })
                    }else if(match.length === 0 &&new Date() - startMatchingTime >3000 ){
                        console.log('Setting New Customer In Run')
                       const CI = parseInt(localStorage.getItem('CustomerId'));
                        await getCustomerFace(img, inputSize, `${CI}`).then((faceMatcher)=>{
                            this.setState({faceMatcher});
                            localStorage.setItem('CustomerId', `${CI +1}`);

                        })

                    }

                }else if(!!this.state.descriptors && !this.state.faceMatcher && !this.state.faceSearching ) {
                    console.log('Setting New Customer')
                    beginMatchTime = new Date();
                    startMatchingTime = new Date();


                    const CI = parseInt(localStorage.getItem('CustomerId'));
                    await getCustomerFace(img, inputSize, `${CI}`).then((faceMatcher)=>{
                        this.setState({faceMatcher});
                        localStorage.setItem('CustomerId', `${CI +1}`);

                    })

                }
            }
        }};
    onLoadSSDModel=async() => {
        try{
            await loadSSDModel().then(()=>{
                this.setState({LoadingSSDMOdel:false});

            })
        }catch(ex){
            console.log('Error Loading SSD Model')
        }

    }
    setFaceOutput= (fullDesc)=>{
        if(fullDesc.length ==! 0){
            this.setState({
                expressions:fullDesc[0].expressions,
                gender:fullDesc[0].gender,
                genderProbability:fullDesc[0].genderProbability,
                age:fullDesc[0].age,
            })
        }
    }




    render() {
        const { detections, match, facingMode,tinyModelBool,facelandmark} = this.state;
        let videoConstraints = null;
        let camera = '';
        if (!!facingMode) {
            videoConstraints = {
                width: WIDTH,
                height: HEIGHT,
            };
            if (facingMode === 'user') {
                camera = 'Front';
            } else {
                camera = 'Back';
            }
        }

        let drawBox = null;
        if (!!detections) {
            drawBox = detections.map((detection, i) => {
                let _H = detection.box.height;
                let _W = detection.box.width;
                let _X = detection.box._x;
                let _Y = detection.box._y;
                if (_H > 120 && _W > 120 && !this.state.imgBool){
                    //this.captureFace();
                }
                return (
                    <div key={i}>
                        <div
                            style={{
                                position:  'absolute',
                                border: 'solid',
                                borderColor: 'blue',
                                height: _H,
                                width: _W,
                                //transform: `translate(${_X}px,${_Y}px)`,
                                left:_X ,//+15,
                                top:_Y ,//+ 300,zIndex:'-1'
                            }}
                        >
                            {!!match && !!match[i] ? (
                                <p
                                    style={{
                                        backgroundColor: 'blue',
                                        border: 'solid',
                                        borderColor: 'blue',
                                        width: _W,
                                        marginTop: 0,
                                        color: '#fff',
                                        transform: `translate(-3px,${_H}px)`,
                                    }}
                                >
                                    {match[i]._label}
                                </p>
                            ) : null}
                        </div>
                    </div>
                );
            });
        }
        let drawpoints= null;
        if(!!facelandmark){
            facelandmark.map((landmark,i)=>{
                if(this.state.initalLoading){
                    this.setState({initalLoading:false})
                }

                drawpoints=  landmark.positions.map((position,i)=> {

                    return (
                        <div  key={i} >
                            <div

                                style={{
                                    position: 'absolute',
                                    border: 'solid',
                                    color: 'blue',
                                    "background-color":"#bbb",
                                    "border-radius": "50%",
                                    height: 10,
                                    width: 10,
                                    left:position._x,// +15 ,
                                    top:position._y  , //+300
                                    zIndex:'-1'
                                    // transform: `translate(${position._X}px,${position._Y}px)`
                                }}
                            >
                                {i}

                            </div>
                        </div>
                    );
                });
            });
        }

        const handleClose= ()=>{
            this.setState({openDialog:!this.state.openDialog})
        }
        return (
            <div className="Camera"
                 style={{
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center'
                 }}
            >
                <div>
                    <div style={{ position: 'relative', width: WIDTH }}>
                        {!!videoConstraints ? (
                            <div style={{ position:'absolute' }}>
                                <Webcam
                                    audio={false}
                                    width={WIDTH}
                                    height={HEIGHT}
                                    ref={this.webcam}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}

                                />

                                {this.state.initalLoading ? <p>Loading....</p> :<>
                                    {this.state.faceSearching ? <>  <LottieEyeComponent/> </> :
                                            <p style={{fontSize: 24}}>{this.state.loiteringTime} seconds</p>
                                    }
                                    </>
                                }

                            </div>
                        ) : null}
                        { this.state.showDrawBox && (!!drawBox) ? drawBox : null}

                        {this.state.showFaceMarks && (!!drawpoints)? drawpoints:null}

                    </div>
                </div>
                <Dialog open={false}
                        onClose={handleClose}
                        PaperComponent={PaperComponent}
                        aria-labelledby="draggable-dialog-title"
                >
                    {this.state.age && <p>Age: {this.state.age}</p>}
                    { this.state.expressions &&
                    <>
                        Neutral
                        <LinearProgress variant="determinate" value={this.state.expressions.neutral*100} />
                        Happy
                        <LinearProgress variant="determinate" value={this.state.expressions.happy*100} />
                        Sad
                        <LinearProgress variant="determinate" value={this.state.expressions.sad*100} />
                        Angry
                        <LinearProgress variant="determinate" value={this.state.expressions.angry*100} />
                        Fearful
                        <LinearProgress variant="determinate" value={this.state.expressions.fearful*100} />
                        Disgusted
                        <LinearProgress variant="determinate" value={this.state.expressions.disgusted*100} />
                        Surprised
                        <LinearProgress variant="determinate" value={this.state.expressions.surprised*100} />

                        <Button autoFocus onClick={handleClose} color="primary">
                            Cancel
                        </Button>

                    </>
                    }
                </Dialog>
                <div style={{position:'fixed', top: 0, right:0, zIndex:1000,'background-color': 'white',
                    color:'#036558',
                    padding: '0.1em',
                    border:'solid',
                    outline: 'none',}}>
                <Button style={{zIndex:1000,'background-color': 'white',
                    color:'#036558',
                    padding: '0.1em',
                    border:'solid',
                    outline: 'none',}} onClick={handleClose}> Emotion Tracker
                </Button>

                    {this.state.openDialog &&
                        <> {this.state.age && <p>Age: {this.state.age}</p>}
                            {this.state.gender && <p>{this.state.gender}</p>}
                            { this.state.expressions &&
                            <>
                            Neutral
                            <LinearProgress variant="determinate" value={this.state.expressions.neutral*100} />
                            Happy
                            <LinearProgress variant="determinate" value={this.state.expressions.happy*100} />
                            Sad
                            <LinearProgress variant="determinate" value={this.state.expressions.sad*100} />
                            Angry
                            <LinearProgress variant="determinate" value={this.state.expressions.angry*100} />
                            Fearful
                            <LinearProgress variant="determinate" value={this.state.expressions.fearful*100} />
                            Disgusted
                            <LinearProgress variant="determinate" value={this.state.expressions.disgusted*100} />
                            Surprised
                            <LinearProgress variant="determinate" value={this.state.expressions.surprised*100} />

                            <Button autoFocus onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                        </>
                        }
                        </>
                    }
                </div>




            </div>


        );
    };
}

export default FaceDetection;
