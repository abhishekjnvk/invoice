import React, { useEffect } from "react";
import { getAllInvoices } from "../utils/dbModel/invoice";

const BillHistory = () => {
  const [allInvoices, setAllInvoices] = React.useState([]);

  useEffect(() => {
    const fetchAllInvoices = async () => {
      getAllInvoices().then((data) => {
        setAllInvoices(data);
      });
    };
    fetchAllInvoices();
  }, []);

  return (
    <div className="col-lg-8 border shadow mt-4 p-3 mx-auto">
      <h2 className="text-center">Bill History</h2>

      <div className="col-lg-12 mx-auto py-3 row mb-4">
        {allInvoices.length > 0 && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Invoice Number</th>
                <th scope="col">Customer Name</th>
                <th scope="col">Date</th>
                <th scope="col">Total</th>
                <th scope="col">Due</th>
              </tr>
            </thead>
            <tbody>
              {allInvoices.slice(0, 100).map((invoice) => {
                return (
                  <tr>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.customerName}</td>
                    <td>{invoice.date}</td>
                    <td>{invoice.total}</td>
                    <td>{invoice.due}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BillHistory;
