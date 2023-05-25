import React from "react";
import "./ImageLinkForm.css";
const ImageLinkForm = () => {
  return (
    <div>
      <p className="f3">
        {"This Magic Brain will detect faces in your pictures.  Give it a try!"}
      </p>
      <div className="center">
        <div className="form pa4 br3 shadow-5 center">
          <input className="f4 p2 w-70 center br2" type="text" />
          <button className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple br2">
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
