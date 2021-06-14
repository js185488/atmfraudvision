
import React, {Component, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import {DialogActions,DialogContent,DialogContentText,DialogTitle,Button, Fab} from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';import './Lumeo.css';
import {setDeployment} from '../lumeoMesages'
import {getConfig} from "../config";

const {app_id, lumeoBearerToken,hook_chain_id,atm_fraud_id} = getConfig();


class LumeoMenuComponent extends Component {
    constructor(props) {
        super(props);
        this.state={
            helpDialog:false
        }
    }


        render() {


            return(
        <div className="menuContainer">
            {!this.props.demo &&
            <>
                <h1 style={{color: 'white', paddingTop: 200, fontSize: 72, margin:0}}>ATM Fraud Demo</h1>
                < h2 style={{color:'white', paddingTop:10, fontSize:56}}>NCR Innovation</h2>

                <button className="demoButtons"
                onClick={() => {
                   // setDeployment(hook_chain_id,'running')//savedVideo
                    this.props.setDemo('lumeoDemo')
                    setDeployment(atm_fraud_id,'running')

                }}>
                Live demo
                </button>
                <button className="demoButtons"
                        onClick={() => {
                            this.props.setDemo('savedVideo')
                            setDeployment(hook_chain_id,'running')
                        }}>
                    Recorded demo
                </button>
            </>
            }


                <Dialog
                    fullScreen={false}
                    open={this.state.helpDialog}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth={'sm'}
                    fullWidth={true}
                    style={{height:800}}

                >
                    <DialogTitle >Demo Instructions</DialogTitle>
                    <DialogContent>
                    <div style={{padding:0,  display:"flex",justifyContent: 'center',}}>

                        <div style={{   justifyContent: 'center',backgroundColor:'white'}}>

                            <ol className="listComponent">
                                <h3 style={{marginBottom:10}}>Cash slot fraud</h3>
                                <li>Hit 'Get Cash'</li>
                                <li>Pick up the fake hand</li>
                                <li>Stick fake finger in cash slot</li>
                            </ol>
                            <ol className="listComponent">
                                <h3 style={{marginBottom:10}}>Obstruct camera fraud</h3>
                                <li>Cover the top camera</li>
                            </ol>
                            <ol className="listComponent">
                                <h3 style={{marginBottom:10}}>Fraud activity</h3>
                                <li>Bring multiple people in front of ATM</li>
                                <li>Pick up weapon</li>
                                <li>Hit get cash multiple times</li>
                            </ol>
                            <ol className="listComponent">
                                <h3 style={{marginBottom:10}}>Normal activity</h3>
                                <li>Hit 'Continue'</li>
                                <li>Withdrawl some cash</li>
                                <li>Act 'normal'</li>
                            </ol>
                        </div>

                    </div>
                    </DialogContent>
                    <DialogActions>

                    <Button variant="outlined" color='black' style={{fontSize: '32px',backgroundColor:'#A6CE39','text-transform': 'none'}}
                            onClick={()=>{
                                this.setState({helpDialog: false})
                                //this.props.setDemo('lumeoDemo')
                            }}>
                        Back
                    </Button>
                    </DialogActions>


                </Dialog>
            <Fab variant="outlined" style={{top:(!this.props.demo?'5%':'90%'),right:'3%',backgroundColor:'black', position:"absolute", padding:0}}
                    onClick={()=>{
                        this.setState({helpDialog: true})
                        //this.props.setDemo('lumeoDemo')
                    }}>
                <HelpOutlineIcon  style={{fontSize: '54px',color:'#A6CE39', margin:1}}/>
            </Fab>


        </div>
    )
}}
export default LumeoMenuComponent;
