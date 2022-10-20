import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button, Textarea, Autocomplete } from "@mantine/core";
import { addCustomer, searchCustomer } from "../utils/dbModel/customer";

const InvoiceInfo = ({ setStep }) => {
  const [customerOptions, setCustomerOptions] = useState([]);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      address: "",
      invoiceNotes: "",
      invoiceNumber: "",
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        value ? (/^\S+@\S+$/.test(value) ? null : "Invalid email") : null,
      mobile: (value) =>
        value
          ? value.length < 10
            ? "Mobile must have at least 10 numbers"
            : null
          : null,
      address: (value) => (value.length ? null : "Address Is Required"),
      invoiceNumber: (value) =>
        value.length ? null : "Invoice Number Is Required",
    },
  });

  const handleSubmit = (values) => {
    try {
      addCustomer(values);
    } catch (e) {
      console.log(e.message);
    }
    setStep(2);
  };

  const handleMobileChange = async (value) => {
    if (value.length > 5) {
      let customer = await searchCustomer(value);
      let customerOpts = customer.map((c) => {
        return {
          value: c.mobile,
          data: c,
        };
      });
      setCustomerOptions(customerOpts);
    } else {
      setCustomerOptions([]);
    }
    form.setFieldValue("mobile", value);
  };

  return (
    <div className="col-lg-6 mx-auto px-3">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="row">
          <div className="col-lg-6">
            <TextInput
              label="Customer Name"
              placeholder="Name"
              {...form.getInputProps("name")}
            />
          </div>
          <div className="col-lg-6">
            <TextInput
              label="Invoice Number"
              placeholder="Invoice Number"
              {...form.getInputProps("invoiceNumber")}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <Autocomplete
              label="Mobile Number"
              placeholder="Mobile Number"
              pattern={
                "^(\\+\\d{1,3}[- ]?)?\\d{10}$" // only allow numbers and + sign
              }
              data={customerOptions}
              {...form.getInputProps("mobile")}
              onChange={handleMobileChange}
              onItemSubmit={(res) => {
                form.setValues(res.data);
                setCustomerOptions([]);
              }}
            />
          </div>
          <div className="col-lg-6">
            <TextInput
              label="Email"
              placeholder="Email"
              {...form.getInputProps("email")}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <Textarea
              autosize
              minRows={1}
              maxRows={4}
              label="Customer Address"
              placeholder="Customer Address"
              {...form.getInputProps("address")}
            />
          </div>
          <div className="col-lg-6">
            <Textarea
              label="Additional Notes"
              autosize
              minRows={1}
              maxRows={4}
              placeholder="Additional Notes"
              {...form.getInputProps("invoiceNotes")}
            />
          </div>
        </div>
        <Button type="submit" mt="sm">
          Proceed
        </Button>
      </form>
    </div>
  );
};

export default InvoiceInfo;
