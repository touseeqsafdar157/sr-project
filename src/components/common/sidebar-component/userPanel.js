import React, { Fragment } from "react";
import logo from "../../../assets/images/share-registrar.svg";

const UserPanel = () => {
  return (
    <Fragment>
      <div className="sidebar-user text-center">
        <div>
          <img src={logo} alt="" className=""  width="200" />
          {/* <img
            className="img-60 rounded-circle lazyloaded blur-up"
            src={url ? url : man}
            alt="#"
          /> */}
          <div className="profile-edit">
            {/* <Link to={`/users/userEdit`}>
              <Edit />
            </Link> */}
          </div>
        </div>
        {/* <h6 className="mt-3 f-14">{sessionStorage.getItem("name")}</h6>
        <p>{sessionStorage.getItem("role")}</p> */}
      </div>
    </Fragment>
  );
};

export default UserPanel;
