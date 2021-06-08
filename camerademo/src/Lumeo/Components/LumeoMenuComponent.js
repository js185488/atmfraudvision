
import React, {Component, useState} from 'react';
import './Lumeo.css';
import {setDeployment} from '../lumeoMesages'
import {getConfig} from "../config";

const {app_id, lumeoBearerToken,hook_chain_id} = getConfig();


class LumeoMenuComponent extends Component {
    constructor(props) {
        super(props);
        this.state={
            start:false
        }
    }


        render() {


            return(

        <div className="menuContainer">
            {!this.state.start &&
            <>
                <h1 style={{color: 'white', paddingTop: 200, fontSize: 72, margin:0}}>ATM Fraud Demo</h1>
                < h2 style={{color:'white', paddingTop:10, fontSize:56}}>HW Innovation</h2>


                <button className="demoButtons"
                onClick={() => {
                this.setState({start: true})
                    setDeployment(hook_chain_id,'running')//savedVideo
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
            {
                this.state.start &&
                <div style={{ justifyContent: 'center'}}>
                    <h2 style={{color:'white', paddingTop:50, fontSize:56,  margin:0}}>Demo Rules</h2>
                    <div style={{padding:0,display:"flex",  justifyContent: 'center',}}>

                        <div style={{ display:"flex",  justifyContent: 'center',backgroundColor:'white', width:'80%'}}>
                        <ol className="listComponent">
                            <h3 style={{marginBottom:10}}>Normal activity</h3>
                            <li>Hit 'Continue'</li>
                            <li>Withdrawl some cash</li>
                            <li>Act 'normal'</li>
                        </ol>
                        <ol className="listComponent">
                            <h3 style={{marginBottom:10}}>Fraud activity</h3>

                            <li>Stick finger in cash slot</li>
                            <li>Cover the top camera</li>
                            <li>Bring multiple people in front of ATM</li>
                            <li>Pick up weapon</li>
                            <li>Hit get cash multiple times</li>

                        </ol>
                        </div>
                    </div>


                    <button className="demoButtons"
                            onClick={()=>{
                                this.props.setDemo('lumeoDemo')
                            }}>
                        Continue
                    </button>

                </div>

            }









        </div>
    )
}}
export default LumeoMenuComponent;
