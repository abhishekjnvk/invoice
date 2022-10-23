import React, { useState } from "react";

import CustomerInfo from "./component/CustomerInfo";
import ItemsInfo from "./component/ItemsInfo";

const GenerateInvoice = () => {
  const [step, setStep] = useState(1);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [customer, setCustomer] = useState({});

  return (
    <>
      {step === 1 && (
        <>
          <CustomerInfo
            setStep={setStep}
            customer={customer}
            setCustomer={setCustomer}
          />
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
  );
};

export default GenerateInvoice;
