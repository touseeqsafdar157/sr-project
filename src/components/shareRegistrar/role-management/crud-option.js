import React, { useState, useEffect } from "react";

const CrudOptions = ({ checks }) => {
  return (
    <div className="form-group m-t-15 m-checkbox-inline mb-0 ml-1">
      <div className="checkbox checkbox-success">
        <input
          id="create"
          type="checkbox"
          defaultChecked={checks.crud[0]}
          onChange={(e) => {
            checks.crud[0] = e.target.checked;
          }}
        />
        <label for="create">{"Create"}</label>
      </div>
      <div className="checkbox checkbox-secondary">
        <input
          id="read"
          type="checkbox"
          defaultChecked={checks.crud[1]}
          onChange={(e) => {
            checks.crud[1] = e.target.checked;
          }}
        />
        <label for="read">{"Read"}</label>
      </div>
      <div className="checkbox checkbox-primary">
        <input
          id="update"
          type="checkbox"
          defaultChecked={checks.crud[2]}
          onChange={(e) => {
            checks.crud[2] = e.target.checked;
          }}
        />
        <label for="update">{"Update"}</label>
      </div>
      <div className="checkbox checkbox-danger">
        <input
          id="delete"
          type="checkbox"
          defaultChecked={checks.crud[3]}
          onChange={(e) => {
            checks.crud[3] = e.target.checked;
          }}
        />
        <label for="delete">{"Delete"}</label>
      </div>
    </div>
  );
};

export default CrudOptions;
