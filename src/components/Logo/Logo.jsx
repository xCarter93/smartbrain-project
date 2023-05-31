import React from "react";
import Tilt from "react-parallax-tilt";
import brain2 from "./brain2.png";
import "./Logo.css";

const Logo = () => {
  return (
    <Tilt
      className="br2 shadow-2 ma4 mt0 pa3 Tilt"
      style={{
        height: "150px",
        width: "150px",
      }}
    >
      <img style={{ paddingTop: "5px" }} src={brain2} alt="logo" />
    </Tilt>
  );
};

export default Logo;
