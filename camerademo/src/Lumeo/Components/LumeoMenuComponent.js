
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
                    setDeployment(hook_chain_id,'running')
            }}>
                Start
                </button>
            </>
            }
            {
                this.state.start &&
                <div style={{ justifyContent: 'center'}}>
                    <h2 style={{color:'white', paddingTop:50, fontSize:56,  margin:0}}>Demo Rules</h2>
                    <div style={{padding:0,display:"flex",  justifyContent: 'center',}}>

                        <div style={{ display:"flex",  justifyContent: 'center',backgroundColor:'white', width:'70%'}}>
                        <ol className="listComponent">
                            <h3 style={{marginBottom:10}}>Normal activity</h3>
                            <li>Hit 'Continue'</li>
                            <li>Withdrawl some cash</li>
                            <li>Milk</li>
                        </ol>
                        <ol className="listComponent">
                            <h3 style={{marginBottom:10}}>Fraud activity</h3>

                            <li>Stick finger in cash slot</li>
                            <li>Cover any of the cameras</li>
                            <li>Bring multiple people in front of ATM</li>
                            <li>Pick up weapon</li>
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
