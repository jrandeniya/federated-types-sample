import React from "react";
import ReactDOM from "react-dom";

import Button from "./components/Button";

ReactDOM.render(
  <React.StrictMode>
    <div className="max-w-xs p-6">
      <Button consumer="Cars" />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
