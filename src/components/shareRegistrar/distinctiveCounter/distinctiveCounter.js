import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import UpdateCertificateCounter from "components/shareRegistrar/distinctiveCounter/updateCertificateCounter";

import UpdateFolioCounter from "components/shareRegistrar/distinctiveCounter/updateFolioCounter";

export default function DistinctiveCounter() {
  return (
    <Fragment>
      <Breadcrumb title="Distinctive Counter" parent="Company" />
      <div className="container-fluid ">
        <UpdateCertificateCounter />
        <UpdateFolioCounter />
      </div>
    </Fragment>
  );
}
