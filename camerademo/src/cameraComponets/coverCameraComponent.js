import React, { Component, useState } from 'react';
import Webcam from 'react-webcam';
import {List,ListItem,ListItemText, Grid} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import face from './api/faceid_100.png'
import FastAverageColor from 'fast-average-color'
import LineGraph from '@chartiful/react-line-graph'

const WIDTH = 325; //420
const HEIGHT = 325; //420
const inputSize = 160;
const sliceImageQuadrants = 2;
let interval;

class CoverCameraComponent extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
        color:null,
        rgb: 'rgb(255, 0, 0)',
        rgba: 'rgba(255, 0, 0, 1)',
        hex: '#ff0000',
        hexa: '#ff0000ff',
        value: [255, 0, 0, 255],
        isDark: true,
        isLight: false,
        facingMode: null,
        cameraCovered:false,
        initialRGB:false,
        image:null,
        imagePieces:[], piecesColors:[],diffArr:[], alphaDiffArr:[], showAlertBox:false


    };
  }

  componentWillMount = async () => {
      this.setInputDevice();
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
      this.captureAverageRGB();
    }, 1500);
  };

  componentWillUnmount() {
    clearInterval(interval);

  }
  getAverageRGB = async (imgSrc, cb) => {
      const fac = new FastAverageColor();
      fac.getColorAsync(imgSrc, { algorithm: "dominant" , mode:'precision'})
          .then(async color => {
              cb(color,imgSrc)
          })
          .catch(e => {
              console.error(e);
          });

  };
  setImagePieces = async(imagePieces, cb)=>{
      const newArr = [];
      imagePieces.map(src=> this.getAverageRGB(src,
          (color,imgSrc) => {

          newArr.push({color,imgSrc});
          if(newArr.length === imagePieces.length){
             this.setState({imagePieces:newArr});
              //cb(newArr)
          }

      }));
  };
    checkImagePieces = ()=>{
        const imageArr = this.state.imagePieces;
        const r = [];
        const g =[];
        const b = [];
        const a = [];
        imageArr.map((obj, idx) => {
            r.push(obj.color.value[0]);
            g.push(obj.color.value[1]);
            b.push(obj.color.value[2]);
            a.push(obj.color.value[3])
        });
        const redBool = this.checkColorValues(r,'red');
        const greenBool = this.checkColorValues(g,'green');
        const blueBool = this.checkColorValues(b,'blue');
        const alphaBool = this.checkColorValues(a,'alpha');
        console.log(redBool, greenBool,blueBool)
        if(redBool && greenBool && blueBool){
            this.setState({showAlertBox:true})
        }else if(this.state.showAlertBox && !redBool && !greenBool && !blueBool){
            this.setState({showAlertBox:false})
        }



    };
    checkColorValues=(arr, str)=>{
        let result = false;
        const differenceArr = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = arr.length -1; j-i >0 ; j--){
                differenceArr.push(Math.abs(arr[j] - arr[i]));
                //console.log(i,j, Math.abs(arr[j] - arr[i]), arr[j],arr[i]);
            }

        }
        const arrAvg = differenceArr.reduce((a,b) => a + b, 0) / differenceArr.length;
        console.log(str +' average difference', arrAvg,isNaN(arrAvg));
        if(!isNaN(arrAvg)){
            if(str !=='alpha'){
                const newArr = this.state.diffArr;
                newArr.push(arrAvg);
                this.setState({diffArr:newArr })
            }else{
                const newArr = this.state.alphaDiffArr;
                newArr.push(arrAvg);
                //this.setState({alphaDiffArr:newArr })
            }


        }



        if(arrAvg < 20)
            result = true;

        return result
    };

 captureAverageRGB = async () =>{
     const img = this.webcam && this.webcam.current && this.webcam.current.getScreenshot();
     if(img){
         await this.splitImage(img, async (imagePieces) => this.setImagePieces(imagePieces));
         await this.checkImagePieces();
         const fac = new FastAverageColor();
         fac.getColorAsync(img, { algorithm: 'dominant' })
             .then(async color => {
                 if(!this.state.initialRGB){
                     this.setState({initialRGB:color.rgb})
                 }
                 //await this.splitImage(img, (imagePieces)=> this.setState({color:color, ...color, image:img, imagePieces}))
                this.setState({color:color, ...color})
                 // {
                 //     rgb: 'rgb(255, 0, 0)',
                 //     rgba: 'rgba(255, 0, 0, 1)',
                 //     hex: '#ff0000',
                 //     hexa: '#ff0000ff',
                 //     value: [255, 0, 0, 255],
                 //     isDark: true,
                 //     isLight: false
                 // }
             })
             .catch(e => {
                 console.error(e);
             });
     }
 };


splitImage = (imageBase64, cb) => {
    var img = new Image();
    img.src = imageBase64;
    let widthOfOnePiece = Math.floor(WIDTH / sliceImageQuadrants);
    let heightOfOnePiece = Math.floor(HEIGHT / sliceImageQuadrants);
    var imagePieces = [];
    img.onload= ()=> {
        const numColumns = sliceImageQuadrants;
        const numRows = sliceImageQuadrants;
        for (var x = 0; x < numColumns; ++x) {
            for (var y = 0; y < numRows; ++y) {
                var canvas = document.createElement('canvas');
                canvas.width = widthOfOnePiece;
                canvas.height = heightOfOnePiece;
                var context = canvas.getContext('2d');
                context.drawImage(img, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, canvas.width, canvas.height);
                imagePieces.push(canvas.toDataURL("image/jpeg"));
        }
    }
    cb(imagePieces)
    }
};



  render() {
    const { facingMode} = this.state;
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


    let alertBox = null
      const blackBool = this.state.value[1] < 95 && this.state.value[2]< 95 && this.state.value[0] < 95;
      if(blackBool){
          alertBox = true
          }
const getRGBSlice = (src)=>{
    const fac = new FastAverageColor();
    fac.getColorAsync(src).then(color =>{
            return color.rgb
        });

      };



    return (
       <div className="Camera"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
        >
           {<div style={{
               position:'absolute',
               left:5,
               top:10,
               width:'30%'
           }}>
               {this.state.diffArr}
               <p>Pixel RGB Average Differences</p>
               <LineGraph
                   data={this.state.diffArr}
                   width={window.innerWidth*.3}
                   height={300}
                   />
               {(this.state.showAlertBox?
                   <div style={{width:'100%'}}>
                       <Alert variant="outlined" severity="error">
                           This is an error alert — check it out!
                       </Alert>
                   </div>
                   :null)
               }
               {/*<LineGraph
                   data={this.state.alphaDiffArr}
                   width={500}
                   height={300}
                   style={{marginTop:10}}
               />*/}

           </div>}
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
                        videoConstraints={{deviceId:this.props.selectedCamera,  width: WIDTH,
                            height: HEIGHT,}}

                    />


                          {this.state.color &&
                              <>
                                  <List component="nav"  aria-label="contacts">
                                      <ListItem style={{backgroundColor:this.state.hex}}>
                                          <ListItemText primary={this.state.rgb} secondary='Current' />
                                      </ListItem>
                                      {/*<ListItem >
                                          <ListItemText inset primary={(this.state.color.isDark? 'Dark' : 'Light')} />
                                      </ListItem>
                                      <ListItem >
                                          <ListItemText primary={this.state.initialRGB} secondary='Initial' />
                                      </ListItem>
                                      */}


                                  </List>
                                  <Grid container spacing={1}>

                                  { this.state.imagePieces && this.state.imagePieces.map((imageObj, i) =>
                                      <Grid item xs={6}>
                                      <img src={imageObj.imgSrc}/>
                                          <ListItem style={{backgroundColor:imageObj.color.hex}}>
                                              <ListItemText primary={imageObj.color.rgb} secondary={ `Piece ${i}`} />
                                          </ListItem>

                                      </Grid>
                                      )}
                                  </Grid>


                              </>
                          }

                      </div>
              ) : <img style = { {padding:100, position:'absolute' }} src = {face}/>}

            </div>


          </div>

          </div>



    );
  };
}

export default CoverCameraComponent;
