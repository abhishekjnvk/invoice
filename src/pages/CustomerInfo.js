import React from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button, Textarea, NumberInput } from "@mantine/core";
import { addCustomer, getCustomerByMobile } from "../utils/dbModel/customer";
let intVal = {
  name: "",
  email: "",
  mobile: "",
  address: "",
  pan: "",
  gstin: "",
};

const CustomerInfo = ({ setStep, setCustomer }) => {
  const [dataLoaded, setDataLoaded] = React.useState(false);

  const form = useForm({
    initialValues: intVal,
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        value ? (/^\S+@\S+$/.test(value) ? null : "Invalid email") : null,
      mobile: (value) =>
        value
          ? /^\d{10}$/.test(value)
            ? null
            : "Invalid mobile number"
          : "Mobile number is required",
      address: (value) => (value.length ? null : "Address Is Required"),
    },
  });

  const handleSubmit = async (values) => {
    try {
      let data = await addCustomer(values);
      setCustomer(data);
    } catch (e) {
      console.log(e.message);
    }
    setStep(2);
  };

  const handleMobileChange = async (value) => {
    if (value) {
      if (value.toString().length === 10) {
        let customer = await getCustomerByMobile(value);
        form.setValues(customer[0]);
        setDataLoaded(true);
      } else {
        form.setValues({
          ...intVal,
          mobile: value,
        });
        setDataLoaded(false);
        setStep(1);
      }
    }
    form.setFieldValue("mobile", value);
  };

  return (
    <div className="col-lg-6 mx-auto px-3">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="row">
          <div className="col-lg-6">
            <NumberInput
              hideControls
              label="Mobile Number"
              pattern="[6,7,8,9][0-9]{9}"
              placeholder="Mobile Number"
              maxLength={10}
              {...form.getInputProps("mobile")}
              onChange={handleMobileChange}
            />
          </div>
          <div className="col-lg-6">
            <TextInput
              label="Customer Name"
              placeholder="Name"
              disabled={!dataLoaded}
              {...form.getInputProps("name")}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            {" "}
            <TextInput
              label="Email"
              placeholder="Email"
              disabled={!dataLoaded}
              {...form.getInputProps("email")}
            />
          </div>
          <div className="col-lg-6">
            <TextInput
              label="PAN"
              disabled={!dataLoaded}
              placeholder="PAN"
              {...form.getInputProps("pan")}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <TextInput
              label="GSTIN"
              disabled={!dataLoaded}
              placeholder="GSTIN"
              {...form.getInputProps("gstin")}
            />
          </div>
          <div className="col-lg-6">
            <Textarea
              autosize
              size="xs"
              minRows={1}
              disabled={!dataLoaded}
              maxRows={4}
              label="Customer Address"
              placeholder="Customer Address"
              {...form.getInputProps("address")}
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

export default CustomerInfo;
