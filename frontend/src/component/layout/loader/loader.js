import React from "react";
import "./loading.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <img
        className="loader-image"
        alt="loadingBar"
        src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
      />
    </div>
  );
};

export default Loader;
