import React from "react";
import Spinner from "react-bootstrap/Spinner";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <Spinner animation="border" />
      <span className="ms-2">{label}</span>
    </div>
  );
}
