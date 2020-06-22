import React from 'react';
import Helmet from "react-helmet";

import Paper from 'material-ui/Paper';

const NotFound = () =>
    <div className="row">
        <div className="col-sm-12 text-xs-center">

            <Helmet title="Page not found" />

            <Paper>
                <br /><br />
                <h2>Page not found</h2>
                <br /><br />
            </Paper>
        </div>
    </div>

export default NotFound;