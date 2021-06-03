import React, {useState} from 'react';
import ml5 from "ml5";
import '../Lumeo/Components/Lumeo.css'
const MODEL_URL = process.env.PUBLIC_URL + '/models/cashslotModel/model.json';
const cloud_url = "https://teachablemachine.withgoogle.com/models/wwff063Lq/model.json";
let interval;
class CashSlotComponent extends React.Component {


    componentDidMount() {
        this.videoRef = React.createRef();
        this.setState({videoRef : this.videoRef, imageSrc:null});

        this.classifier = ml5.imageClassifier(
            cloud_url,
            () => {
                navigator.mediaDevices
                    .getUserMedia({ video: true, audio: false })
                    .then(stream => {
                        this.videoRef.current.srcObject = stream;
                        this.videoRef.current.play();
                    });
                this.setState({classifier :this.classifier});
                console.log(this.classifier);
            }
        );

        var classifier = this.classifier;
        var videoRef = this.videoRef;
        var callback = this.props.callback;

        interval = setInterval(async function(){
            //console.log("update", classifier);
            if (classifier) {

                classifier.classify(videoRef.current, (error, results) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    callback(results);
                });

            }
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(interval);
        this.videoRef = null
        this.setState({videoRef : this.videoRef});



    }



    splitImage = (imageBase64, cb) => {
        var img = new Image();
        img.src = imageBase64;
        var imagePieces = [];
        img.onload= ()=> {
                    var canvas = document.createElement('canvas');
                    canvas.width = 600;
                    canvas.height = 410;
                    var context = canvas.getContext('2d');
                    context.drawImage(img, 576, 0, 600, 410, 0, 0, 600,410);
                    imagePieces.push(canvas.toDataURL("image/jpeg"));
            };
        this.setState({imageSrc:imagePieces[0]});
            cb(imagePieces)
    };

    render(){
        return(
            <div>
                <video
                    ref={this.videoRef}
                    className='videoElement'
                    style={{transform: "scale(-1, 1)" }}
                    //width="300"
                   // height="150"
                />
            </div>
        );
    }
}

export default CashSlotComponent;
