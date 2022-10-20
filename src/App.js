import { useEffect, useState } from "react";
import InvoiceInfo from "./pages/InvoiceInfo";
import BusinessInfo from "./pages/BusinessInfo";
import ItemsInfo from "./pages/ItemsInfo";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let businessInfo = localStorage.getItem("businessInfo");
    if (businessInfo) {
      setStep(1);
    }
    // this will redirect the use to invoice steps if Invoice bussiness info exists
    let clientInfo = localStorage.getItem("clientInfo");
    if (clientInfo) {
      setStep(2);
    }
  }, []);
  return (
    <div className="App">
      <>
        {step === 0 ? (
          <BusinessInfo setStep={setStep} />
        ) : (
          <>
            <InvoiceInfo setStep={setStep} />
            {step === 2 && <ItemsInfo />}
          </>
        )}
      </>
    </div>
  );
}

export default App;
