import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./Dashboard";
import BusinessInfo from "./pages/BusinessInfo";

const App = () => {
  const [businessInfo, setBusinessInfo] = React.useState({});

  useEffect(() => {
    let businessInfo = localStorage.getItem("businessInfo");
    if (businessInfo) {
      setBusinessInfo(JSON.parse(businessInfo));
    }
  }, []);
  return (
    <div>
      {businessInfo.name ? (
        <Dashboard />
      ) : (
        <BusinessInfo setBusinessInfo={setBusinessInfo} />
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
