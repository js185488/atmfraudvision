
import React, {Component, useState} from 'react';
import './Lumeo.css';



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
                <h1 style={{color: 'white', paddingTop: 200, fontSize: 72}}>ATM Fraud Demo</h1>
                < h2 style={{color:'white', paddingTop:10, fontSize:56}}>HW Innovation</h2>


                <button className="demoButtons"
                onClick={() => {
                this.setState({start: true})
            }}>
                Start
                </button>
            </>
            }
            {
                this.state.start && <>
                    <h2 style={{color:'white', paddingTop:200, fontSize:56}}>HW Innovation</h2>
                    <h2 style={{color:'white', paddingTop:10, fontSize:56}}>HW Innovation</h2>


                    <button className="demoButtons"
                            onClick={()=>{
                                this.props.setDemo('lumeoDemo')
                            }}>
                        Lumeo
                    </button>

                </>

            }









        </div>
    )
}}
export default LumeoMenuComponent;
