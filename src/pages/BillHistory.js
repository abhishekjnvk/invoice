import { TextInput, Button } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { getAllInvoices } from "../utils/dbModel/invoice";
import { Link, useNavigate } from "react-router-dom";

const BillHistory = () => {
  const [allInvoices, setAllInvoices] = useState([]);
  const [invoiceNumberInput, setInvoiceNumberInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllInvoices = async () => {
      getAllInvoices().then((data) => {
        setAllInvoices(data);
      });
    };
    fetchAllInvoices();
  }, []);

  const handleGetInvoice = () => {
    navigate(`/bill/${invoiceNumberInput.trim()}`);
  };

  return (
    <div className="container">
      <div className="col-lg-4 mx-auto py-3 row">
        <div className="col-lg-10">
          <form autocomplete="off">
            <TextInput
              value={invoiceNumberInput}
              placeholder="Enter Invoice Number"
              onChange={(e) => setInvoiceNumberInput(e.target.value)}
            />
          </form>
        </div>
        <div className="col-lg-2">
          <Button
            onClick={handleGetInvoice}
            disabled={invoiceNumberInput.trim().length === 0}
          >
            Get Invoice
          </Button>
        </div>
      </div>
      <h5 className="text-center">Bill History</h5>
      <div className="col-lg-12 mx-auto row mb-4">
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
                    <td>
                      <Link to={`/bill/${invoice.invoiceNumber}`}>
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
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