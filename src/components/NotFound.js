import React from "react";
import Helmet from "react-helmet";

const NotFound = () => (
  <div className="row">
    <div className="col-sm-12 text-center">
      <Helmet title="404" />

      <h4 className="card-title text-center mb-4 mt-1">
        <h2>Oops! Halaman Tidak Ditemukan</h2>
      </h4>
    </div>
  </div>
);

export default NotFound;
