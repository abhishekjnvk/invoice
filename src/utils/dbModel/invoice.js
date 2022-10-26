import { addData, getAllData, getByColumn } from "../indexedDbUtils";
const storeName = "invoices";

export const addInvoice = async (invoice) => {
  let {
    customerId,
    invoiceNumber,
    date = new Date().toLocaleDateString(),
    additionalNotes = "",
    total,
    paid,
    items = [],
    status = "paid",
    customerName = "",
  } = invoice;

  paid = parseFloat(paid).toFixed(2);
  if (customerId && invoiceNumber && total && paid && items.length) {
    let due = (parseFloat(total) - parseFloat(paid)).toFixed(2);

    let invoiceObj = {
      customerId,
      invoiceNumber,
      date,
      additionalNotes,
      total,
      paid,
      due,
      status,
      items,
      customerName,
    };

    return addData(storeName, invoiceObj);
  } else {
    return {
      error: true,
      message: "Please fill all the fields",
      invoice,
    };
  }
};

// get Next Invoice Number
export const getInvoiceNumber = async (prefix = "") => {
  let date = new Date();
  let year = date.getFullYear().toString().slice(-2);
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let number = `${year}${month}${day}-${hour}${minute}${second}`;

  return number;
};

export const getInvoiceByNumber = (invoiceNumber) => {
  return getByColumn(storeName, "invoiceNumber", invoiceNumber);
};

export const getAllInvoices = async () => {
  return getAllData(storeName);
};
