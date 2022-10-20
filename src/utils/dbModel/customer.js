//create customer object store

import { addData, getByColumn, searchByWildCard } from "../indexedDbUtils";

export const addCustomer = async (customer) => {
  let {
    name,
    email = "",
    mobile,
    address = "",
    gstin = "",
    pan = "",
    city = "",
    state = "",
    pincode = "",
  } = customer;

  if (!name || !mobile) {
    throw new Error("Customer name and mobile are required");
  }
  let customerData = {
    name,
    email,
    mobile,
    address,
    gstin,
    pan,
    state,
    city,
    pincode,
  };

  let prevData = await getByColumn("customers", "mobile", mobile);
  if (!prevData.length) {
    return addData("customers", customerData);
  } else {
    throw new Error("Mobile Already in use");
  }
};
// search customer by mobile number
export const searchCustomer = async (mobile) => {
  let customer = await searchByWildCard("customers", "mobile", mobile);
  return customer;
};

// //get customer by mobile number
// export const getCustomerByMobile = (db, mobile) => {
//   return getDataByColumnValue(db, "customers", "mobile", mobile);
// };
