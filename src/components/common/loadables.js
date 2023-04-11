import React from "react";
import Loader from "react-loader-spinner";

function LoadableButton({ loading, title, methodToExecute }) {
  return (
    <button
      type="submit"
      className="btn btn-primary mb-2"
      disabled={Boolean(loading)}
      onClick={(e) => methodToExecute()}
    >
      {loading ? (
        <Loader type="BallTriangle" color="#ffffff" height={16} width={50} />
      ) : (
        <span>{title}</span>
      )}
    </button>
  );
}

export function LoadableInput() {
  return (
    <div className="form-control d-flex justify-content-center">
      <Loader type="Bars" color="#ffffff" height={10} width={50} />
    </div>
  );
}

export default LoadableButton;
