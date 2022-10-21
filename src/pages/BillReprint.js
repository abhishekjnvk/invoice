import { Button, TextInput } from "@mantine/core";
import React, { useEffect } from "react";
import { getCustomerByID } from "../utils/dbModel/customer";
import { getInvoiceByNumber } from "../utils/dbModel/invoice";
import { toTitleCase } from "../utils/helper";
import { useParams } from "react-router-dom";

const BillReprint = ({ defaultData = null, ...props }) => {
  let { invoiceNumber } = useParams();

  // const [invoiceNumber, setInvoiceNumber] = React.useState("");
  const [data, setData] = React.useState(defaultData);
  const [customerData, setCustomerData] = React.useState("");
  const [error, setError] = React.useState("");

  useEffect(() => {
    if (!defaultData) {
      getInvoiceByNumber(invoiceNumber.trim()).then((res) => {
        if (res.length) {
          let customerId = res[0].customerId;
          if (customerId) {
            getCustomerByID(customerId).then((res) => {
              setCustomerData(res);
            });
          }
          setData(res[0]);
          setError("");
        } else {
          setError("No data found");
          setData(null);
          setCustomerData(null);
        }
      });
    } else {
      let { customerId } = defaultData;
      getCustomerByID(customerId).then((res) => {
        setCustomerData(res);
      });
    }
  }, [defaultData, invoiceNumber]);

  return (
    <div className="col-lg-8 mt-4 p-3 mx-auto">
      {error && <div className="text-center py-5 text-danger">{error}</div>}

      {data && (
        <>
          <div className="row">
            <div className="col-lg-6 border-end border-success">
              {customerData && (
                <table className="table table-borderless">
                  <tbody>
                    {Object.keys(customerData)
                      .filter((k) => customerData[k] !== "")
                      .map((key) => {
                        return (
                          <tr key={`customer_items${key}`}>
                            <td>
                              <strong>{toTitleCase(key || "-")}</strong>
                            </td>
                            <td className="text-end">
                              {customerData[key] || "-"}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
            </div>
            {customerData && (
              <div className="col-lg-6">
                <table className="table table-borderless">
                  <tbody>
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
                          <tr key={`inv_items${item.key}`}>
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
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <hr />
          <table className="table">
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
                  <tr key={`item_${item.name}`}>
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
