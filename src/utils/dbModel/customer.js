//create customer object store

import {
  addData,
  getByColumn,
  getById,
  searchByWildCard,
  updateData,
} from "../indexedDbUtils";

const storeName = "customers";

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

  let prevData = await getCustomerByMobile(mobile);
  if (!prevData.length) {
    return addData(storeName, customerData);
  } else {
    return updateData(storeName, prevData[0].id, customerData);
  }
};

// search customer by mobile number
export const searchCustomer = async (mobile) => {
  let customer = await searchByWildCard(storeName, "mobile", mobile);
  return customer;
};

//get customer by mobile number
export const getCustomerByMobile = (mobile) => {
  return getByColumn(storeName, "mobile", mobile);
};

export const getCustomerByID = (id) => {
  return getById(storeName, id);
};
