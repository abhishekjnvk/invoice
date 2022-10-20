import { useEffect, useState } from "react";
import CustomerInfo from "./pages/CustomerInfo";
import BusinessInfo from "./pages/BusinessInfo";
import ItemsInfo from "./pages/ItemsInfo";
import "bootstrap/dist/css/bootstrap.min.css";
import BillReprint from "./pages/BillReprint";
import BillHistory from "./pages/BillHistory";

function App() {
  const [step, setStep] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [customer, setCustomer] = useState({});

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
        {step === 0 && <BusinessInfo setStep={setStep} />}

        {step === 1 && (
          <>
            <CustomerInfo
              setStep={setStep}
              customer={customer}
              setCustomer={setCustomer}
            />
            <BillReprint />
            <BillHistory />
          </>
        )}

        {step === 2 && (
          <ItemsInfo
            customer={customer}
            invoiceNumber={invoiceNumber}
            setInvoiceNumber={setInvoiceNumber}
          />
        )}
      </>
    </div>
  );
}

export default App;
