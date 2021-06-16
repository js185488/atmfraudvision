import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import DemoComponent from "./DemoComponent";
import LumeoManagementComponent from '../Lumeo/Components/LumeoManagementComponent'


export default class RouteComponent extends React.Component {



    render() {

        return (

            <Router >

                <div className="App">


                        <Switch>
                            <Route exact path="/" component={DemoComponent} />
                            <Route path="/management" component={LumeoManagementComponent} />

                        </Switch>

                </div>
            </Router>
        );
    }
}
