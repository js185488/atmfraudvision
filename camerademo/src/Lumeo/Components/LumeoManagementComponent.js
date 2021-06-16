import {getLumeoStreams, getFileList, getFileMetaData, getFileURL, getAmazonMeta} from "../lumeoMesages";
import {getLumeoMetadata} from "../../messages/callLocalServer"
import React, {Component} from "react";
import {getConfig} from "../config";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import {
    Avatar, Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItemAvatar, Typography
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';

let interval;
const {hook_chain_id, atm_fraud_id} = getConfig();

function cleanMetaData(obj) {
    const k = Object.keys(obj.meta);
    const o = obj.meta[String(k)];
    const k2 = Object.keys(o);
    const sourceId = o[String(k2[2])];
    const metaData = {[o.output_stream_id]: {objects: o.objects, stream_id: o.output_stream_id, ...o}}
    return metaData
}

class LumeoManagementComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            helpDialog: false,
            streamLists: [],
            fileList: [],
            fileListLoading: true,
            selectedFile: null,
            showVideo: false,
            videoSrc: null,
            loadingVideo: true,
        }
    }

    componentWillMount = async () => {
        this.getStreams();
        await this.getFiles()
    };
    parseEvent = (eventMap) => {
        const videoTimeStamp = Object.keys(eventMap);
        const eventArr = []
        let fraudBool = false;
        let videoMessage = {//initalizing videoMessage
            weapons_message: '',
            camera_message: '',
            persons_message: '',
            vehicle_message: '',
            loitering_message: ''
        }
        for (let i = 0; i < videoTimeStamp.length; i++) {
            const objects = eventMap[String(videoTimeStamp[i])].objects
            const stream_id = eventMap[String(videoTimeStamp[i])].output_stream_id
            const fraud_detected = eventMap[String(videoTimeStamp[i])].fraud_detected
            const camera_message = eventMap[String(videoTimeStamp[i])].camera_message
            const vehicle_message = eventMap[String(videoTimeStamp[i])].persons_message
            const persons_message = eventMap[String(videoTimeStamp[i])].persons_message
            const weapons_message = eventMap[String(videoTimeStamp[i])].weapons_message
            const loitering_message = eventMap[String(videoTimeStamp[i])].loitering_message

            eventArr.push({
                videoTimeStamp: videoTimeStamp[i], fraud_detected, camera_message,
                vehicle_message, persons_message, weapons_message, loitering_message, stream_id, objects
            }) //adding messages with timestamp, objects, and stream_id

            let messageLogic = (weapons_message || camera_message || persons_message
                || vehicle_message || loitering_message || fraud_detected)
            if (!fraudBool && messageLogic) {
                fraudBool = true
            }
            if (messageLogic) {
                videoMessage = { //catching messages if they appear, setting messages to older messages if not
                    weapons_message: (weapons_message ? weapons_message : videoMessage.weapons_message),
                    camera_message: (camera_message ? camera_message : videoMessage.camera_message),
                    persons_message: (persons_message ? persons_message : videoMessage.persons_message),
                    vehicle_message: (vehicle_message ? vehicle_message : videoMessage.vehicle_message),
                    loitering_message: (loitering_message ? loitering_message : videoMessage.loitering_message)
                }
            }
        }
        return {eventArr, videoMessage, fraudBool}

    }

    getStreams = async () => {
        const result = await getLumeoStreams()

        const streamList = result.filter((stream) =>
            (stream.status === 'online' && stream.stream_type === 'webrtc'))

        console.log(streamList)
        this.setState({streamLists: streamList})

    }

    parseArray = async (fileList) => {

        return await Promise.all(
            fileList.map(async file => {
                const meta = await getFileURL(file.id)
                //console.log(meta)
                const metaData = await getLumeoMetadata(meta.metadata_url)
                //console.log('iside mapp',metaData)
                const eventMap = metaData.meta
                console.log(eventMap)
                if (eventMap) {
                    const {eventArr, videoMessage, fraudBool} = await this.parseEvent(eventMap)
                    const dateTimestamp = new Date(file.created_at)
                    return {...meta, ...file, eventArr, ...videoMessage, dateTimestamp, fraudBool}
                }

            })
        )

    }

    getFiles = async () => {
        const result = await getFileList(atm_fraud_id)
        //console.log('fileList result', result)


        let fileList = result.filter((file) =>
            (file.deployment_id === atm_fraud_id))
        const today = new Date()
        const startDate = new Date(today)
        startDate.setDate(startDate.getDate() - 10)
        const endDay = startDate.getTime()

        fileList = fileList.filter(file => {
            let time = new Date(file.created_at).getTime();
            return (endDay < time);// && time < ed);
        });

        //fileList = fileList.slice(0,10);
        await this.parseArray(fileList).then((newArr) => {
            console.log(newArr)
            console.log(newArr[0])
            this.setState({fileList: newArr, fileListLoading: false})

        })


    }

    render() {


        return (
            <div style={{height: '100%'}}>
                <div className="videoContainer">
                    {
                        this.state.streamLists.map((stream) => {//"9ad13ad8-f66f-4e7b-94ef-3c0331e0acc7"
                            return (
                                <div className='video'>

                                    <iframe src={stream.uri} style={{
                                        width: '90%',
                                        height: '100%',
                                        transform: 'none'
                                    }} allow='autoplay *; fullscreen *' allowFullScreen='true'>
                                        stream
                                        {stream.uri}
                                    </iframe>

                                    )}
                                    )}
                                </div>

                            )
                        })
                    }
                    <div style={{width: '100%'}}>
                        {!this.state.fileListLoading &&

                        <List style={{width: '100%', border: 'red', borderStyle: 'solid'}}>


                            <Typography variant="h6" style={{color: 'white', width: '100%', textAlign: 'left'}}>
                                Suspicious Activity Alerts
                            </Typography>



                            {!this.state.fileListLoading && this.state.fileList.map((file, key) => {

                                return (
                                    <>
                                        {

                                            (file.fraudBool ?
                                                    <>
                                                        <Divider style={{color: 'grey'}}/>

                                                        <ListItem style={{width: '100%', display: 'flex'}}
                                                                  onClick={() => {
                                                                      this.setState({
                                                                          selectedFile: file,
                                                                          showVideo: true
                                                                      })
                                                                  }}>
                                                            <ListItemAvatar>
                                                                <Avatar style={{backgroundColor: 'red'}}>
                                                                    <PageviewIcon/>
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText className='nonFraudText'
                                                                          style={{display: 'flex'}}>
                                                                {file.dateTimestamp.toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                                {"  " + file.dateTimestamp.toLocaleString().split(',')[0] + ": "}
                                                                Detected:
                                                                {file.camera_message && ' Camera Blocked |'}
                                                                {file.vehicle_message &&
                                                                file.vehicle_message}
                                                                {file.persons_message && file.persons_message}
                                                                {file.weapons_message && ' Weapon Detected |'}
                                                                {file.loitering_message && ' Loitering Detected'}

                                                            </ListItemText>
                                                        </ListItem>
                                                    </> : null
                                            )
                                        }

                                    </>

                                )


                            })}

                        </List>
                        }

                    </div>


                </div>
                <Dialog
                    fullScreen={false}
                    open={this.state.selectedFile}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth={'lg'}
                    fullWidth={true}
                    style={{height: 800}}

                >
                    {this.state.selectedFile &&
                    <>
                        <DialogTitle>Fraud Detected </DialogTitle>

                        <DialogContent>
                            <DialogContentText>{`${this.state.selectedFile.dateTimestamp.toLocaleString()}`}</DialogContentText>


                            <video width="60%" controls autoplay>
                                <source src={this.state.selectedFile && this.state.selectedFile.data_url}
                                        type="video/ogg"/>
                                <source src={this.state.selectedFile && this.state.selectedFile.data_url}
                                        type="video/mp4"/>

                            </video>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" color='black'
                                    style={{fontSize: '32px', backgroundColor: '#A6CE39', 'text-transform': 'none'}}
                                    onClick={() => {
                                        this.setState({selectedFile: null})
                                    }}>
                                Close
                            </Button>
                        </DialogActions>
                    </>
                    }
                </Dialog>

            </div>

        )
    }
}

export default LumeoManagementComponent;
