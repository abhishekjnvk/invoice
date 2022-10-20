import { Button, TextInput } from "@mantine/core";
import React from "react";
import { getCustomerByID } from "../utils/dbModel/customer";
import { getInvoiceByNumber } from "../utils/dbModel/invoice";
import { toTitleCase } from "../utils/helper";

const BillReprint = () => {
  const [invoiceNumber, setInvoiceNumber] = React.useState("");
  const [data, setData] = React.useState("");
  const [customerData, setCustomerData] = React.useState("");
  const [error, setError] = React.useState("");

  const handleFetchInvoice = async () => {
    let data = await getInvoiceByNumber(invoiceNumber);
    if (data.length) {
      let customerId = data[0].customerId;
      if (customerId) {
        let customer = await getCustomerByID(customerId);
        setCustomerData(customer);
      }
      setData(data[0]);
      setError("");
    } else {
      setError("No data found");
      setData(null);
      setCustomerData(null);
    }
  };
  return (
    <div className="col-lg-8 border shadow mt-4 p-3 mx-auto">
      <h2 className="text-center">Reprint Bill</h2>
      <div className="col-lg-4 mx-auto py-3 row mb-4">
        <div className="col-lg-10">
          <TextInput
            value={invoiceNumber}
            placeholder="Enter Invoice Number"
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>
        <div className="col-lg-2">
          <Button onClick={handleFetchInvoice}>Fetch Invoice</Button>
        </div>
      </div>
      {error && <div>{error}</div>}
      {data && (
        <>
          <div className="row">
            <div className="col-lg-6 border-end border-success">
              <table class="table table-borderless">
                <tbody>
                  {customerData && (
                    <>
                      {Object.keys(customerData).map((key) => {
                        if (customerData[key]) {
                          return (
                            <tr>
                              <td>
                                <strong>{toTitleCase(key)}</strong>
                              </td>
                              <td className="text-end">
                                {customerData[key] || "-"}
                              </td>
                            </tr>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-lg-6">
              <table class="table table-borderless">
                <tbody>
                  {customerData && (
                    <>
                      {[
                        {
                          label: "Invoice Number",
                          key: "invoiceNumber",
                        },
                        {
                          label: "Date",
                          key: "date",
                        },
                        {
                          label: "Invoice Amount",
                          key: "total",
                        },
                        {
                          label: "Due Amount",
                          key: "due",
                        },
                        {
                          label: "Paid Amount",
                          key: "paid",
                        },
                      ].map((item) => {
                        return (
                          <tr>
                            <td>
                              <strong>{item.label}</strong>
                            </td>
                            <td className="text-end">
                              {data[item.key] || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col" className="text-end">
                  Quantity
                </th>
                <th scope="col" className="text-end">
                  Price
                </th>
                <th scope="col" className="text-end">
                  Discount
                </th>
                <th scope="col" className="text-end">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.items?.map((item) => {
                return (
                  <tr>
                    <td>{item.name}</td>
                    <td className="text-end">{item.unit}</td>
                    <td className="text-end">{item.rate}</td>
                    <td className="text-end">{item.discount} %</td>
                    <td className="text-end">
                      {(
                        item.rate * item.unit -
                        (item.rate * item.unit * item.discount) / 100
                      ).toFixed(2) || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default BillReprint;
