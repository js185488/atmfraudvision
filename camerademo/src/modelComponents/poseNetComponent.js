import * as posenet from '@tensorflow-models/posenet'
import * as React from 'react'
import { isMobile, drawKeypoints, drawSkeleton,drawBoundingBox } from './poseNet/utils'
import * as tf from '../../node_modules/@tensorflow/tfjs';
import '../../node_modules/@tensorflow/tfjs-backend-cpu';
import "../../node_modules/@tensorflow/tfjs-backend-webgl";
import {useEffect} from "react";

let runPose = true;
export default class PoseNet extends React.Component {


    static defaultProps = {
        videoWidth: 600,
        videoHeight: 500,
        flipHorizontal: true,
        algorithm: 'single-pose',
        mobileNetArchitecture: isMobile() ? 0.50 : 1.01,
        architecture:'MobileNetV1',
        showVideo: true,
        showSkeleton: true,
        showPoints: true,
        minPoseConfidence: 0.25,
        minPartConfidence: 0.1,
        maxPoseDetections: 2,
        inputResolution:500,
        multiplier:0.75,
        nmsRadius: 30.0,
        outputStride: 16,
        imageScaleFactor: 0.5,
        skeletonColor: 'aqua',
        skeletonLineWidth: 2,
        loadingText: 'Loading pose detector...'
    }


    constructor(props) {
        super(props, PoseNet.defaultProps)
        this.state = { loading: true, selectedCamera:this.props.selectedCamera,runPose:true }
    }
    async componentWillUnmount(){
        await this.clearVideoAndModel()


    }

    async clearVideoAndModel(){
        if( this.video.srcObject) {
            await this.video.srcObject.getTracks().forEach(track => {
                track.stop();
            })
            console.log('Clearing video')
        }
        runPose= false
        console.log("Stopping posemodel")

    }



    getCanvas = elem => {
        this.canvas = elem
    }

    getVideo = elem => {
        this.video = elem
    }

    async componentWillMount() {
        await tf.setBackend('webgl');
        await tf.ready().then(() => {console.log('wasm ready')});
        // Loads the pre-trained PoseNet model
        this.net = await posenet.load({  architecture: this.props.architecture,
            outputStride: this.props.outputStride,
            inputResolution: this.props.inputResolution,
            multiplier: this.props.multiplier,})/*
        {  architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: 600, height: 500 },
            multiplier: 0.75});//this.props.mobileNetArchitecture);*/



    }
    async shouldComponentUpdate(){

    }
    async componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.selectedCamera !== this.state.selectedCamera) {
            await this.clearVideoAndModel()

            this.setState({selectedCamera:this.props.selectedCamera})

            await this.setupCamera()
        }
    }


    async componentDidMount() {
        try {
            await this.setupCamera()
        } catch(e) {
            throw 'This browser does not support video capture, or this device does not have a camera'
        } finally {
            this.setState({ loading: false })
        }
        this.detectPose()
    }

    async setupCamera() {
        runPose=true

        // MDN: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw 'Browser API navigator.mediaDevices.getUserMedia not available'
        }

        const { videoWidth, videoHeight } = this.props
        const video = this.video
        const mobile = isMobile()

        video.width = videoWidth
        video.height = videoHeight

        // MDN: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                deviceId:this.state.selectedCamera,
                width: mobile ? void 0 : videoWidth,
                height: mobile ? void 0: videoHeight,
            }
        });

        video.srcObject = stream

        return new Promise(resolve => {
            video.onloadedmetadata = () => {
                // Once the video metadata is ready, we can start streaming video
                video.play()
                resolve(video)
            }
        })
    }

    detectPose() {
        const { videoWidth, videoHeight } = this.props
        const canvas = this.canvas
        const ctx = canvas.getContext('2d')

        canvas.width = videoWidth
        canvas.height = videoHeight

        this.poseDetectionFrame(ctx)
    }

    poseDetectionFrame(ctx) {
        const {
            algorithm,
            imageScaleFactor,
            flipHorizontal,
            outputStride,
            minPoseConfidence,
            maxPoseDetections,
            minPartConfidence,
            nmsRadius,
            videoWidth,
            videoHeight,
            showVideo,
            showPoints,
            showSkeleton,
            skeletonColor,
            skeletonLineWidth,
        } = this.props

        const net = this.net
        const video = this.video






        const poseDetectionFrameInner = async () => {
            let poses = []

            switch (algorithm) {
                case 'single-pose':

                    const pose = await net.estimateSinglePose(
                        video,
                        imageScaleFactor,
                        flipHorizontal,
                        outputStride
                    )
                    console.log(pose)

                    poses.push(pose)

                    break
                case 'multi-pose':

                    poses = await net.estimateMultiplePoses(
                        video,
                        imageScaleFactor,
                        flipHorizontal,
                        outputStride,
                        maxPoseDetections,
                        minPartConfidence,
                        nmsRadius
                    )

                    break
            }

            ctx.clearRect(0, 0, videoWidth, videoHeight);

            if (showVideo) {
                ctx.save()

                ctx.scale(-1, -1)
                ctx.translate(0,videoWidth)

                ctx.drawImage(video, 0, 0, videoWidth, videoHeight)
                ctx.restore()
            }

            // For each pose (i.e. person) detected in an image, loop through the poses
            // and draw the resulting skeleton and keypoints if over certain confidence
            // scores
            poses.forEach(({ score, keypoints }) => {
                if (score >= minPoseConfidence) {
                    if (showPoints) {
                        drawKeypoints(keypoints, minPartConfidence, skeletonColor, ctx);
                    }
                    if (showSkeleton) {
                        drawSkeleton(keypoints, minPartConfidence, skeletonColor, skeletonLineWidth, ctx);
                    }
                    drawBoundingBox(keypoints,skeletonColor, ctx);
                }
            })


            this._frameId = window.requestAnimationFrame(poseDetectionFrameInner )
            if(!runPose){
                stopLoop()

            }
        }
       console.log(runPose)

        const startLoop=()=> {
            if( !this._frameId ) {
                this._frameId = window.requestAnimationFrame( poseDetectionFrameInner() );
            }
        }
        const stopLoop=()=> {
            window.cancelAnimationFrame(this._frameId);
        }




        try{startLoop()} catch(e){}


    }



    render() {



        const loading = this.state.loading
            ? <div className="PoseNet__loading">{ this.props.loadingText }</div>
            : ''
        return (
            <div className="PoseNet">
                { loading }

                    <>
                    <video style={{position: 'absolute'}} playsInline ref={this.getVideo}></video>
                    < canvas style = {{position: 'relative'}} ref={this.getCanvas}></canvas>
                    </>


            </div>
        )
    }
}
