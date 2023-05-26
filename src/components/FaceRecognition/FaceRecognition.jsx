import React from "react";
import "./FaceRecognition.css";
const FaceRecognition = ({ imageURL, boxes }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="inputimage"
          src={imageURL}
          alt=""
          width="300px"
          height="auto"
        />
        {boxes.map((box, i) => {
          return (
            <div
              key={i}
              className="bounding-box"
              style={{
                top: box.topRow,
                right: box.rightCol,
                bottom: box.bottomRow,
                left: box.leftCol,
              }}
            ></div>
          );
        })}
        <div
          className="bounding-box"
          style={{
            top: boxes.topRow,
            right: boxes.rightCol,
            bottom: boxes.bottomRow,
            left: boxes.leftCol,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FaceRecognition;
