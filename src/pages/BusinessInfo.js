import React, { useEffect } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Box,
  Textarea,
  Text,
  Select,
  FileButton,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons";
import { toast } from "react-toastify";

import currencies from "./currency.json";

const BusinessInfo = ({ setBusinessInfo }) => {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      address: "",
      website: "",
      gst: "",
      terms: [],
      currency: "₹",
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
          : "Mobile number is required",
      address: (value) => (value.length ? null : "Address Is Required"),
      website: (value) =>
        value.length
          ? /^https?:\/\/\S+$/.test(value)
            ? null
            : "Invalid URL"
          : null,
      gst: (value) =>
        value.length
          ? /^(\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[A-Z\d]{1})$/.test(
              value
            )
            ? null // GSTIN
            : "Invalid GSTIN"
          : null,
      currency: (value) => (value?.length ? null : "Currency is required"),
    },
  });

  useEffect(() => {
    let businessInfo = localStorage.getItem("businessInfo");
    if (businessInfo) {
      form.setValues(JSON.parse(businessInfo));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNewTerm = () => {
    if (
      form.values.terms.length === 0 ||
      form.values.terms[form.values.terms.length - 1]
    ) {
      let filteredTerms = form.values.terms.filter((term) => term !== "");
      form.setFieldValue("terms", [...filteredTerms, ""]);
    } else {
      form.setFieldError(
        `terms.${form.values.terms.length - 1}`,
        "Add a term first before adding another"
      );
    }
  };

  const removeTerm = (index) => {
    let filteredTerms = form.values.terms.filter((term, i) => i !== index);
    form.setFieldValue("terms", filteredTerms);
    form.setFieldError(`terms.${index}`, null);
  };

  const handleSubmit = (values) => {
    let filteredTerms = values.terms.filter((term) => term !== "");
    form.setFieldValue("terms", filteredTerms);
    let businessInfo = JSON.stringify(values);
    localStorage.setItem("businessInfo", businessInfo);
    setBusinessInfo?.(values);

    toast.success("Saved !", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 1000,
    });
  };

  return (
    <div className="col-lg-6 mx-auto">
      <h5 className="text-muted text-center mb-3">Business Info Setup</h5>
      <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
        <div className="row">
          <div className="col-lg-6">
            <TextInput
              label="Business Name"
              placeholder="Name"
              withAsterisk
              {...form.getInputProps("name")}
            />
          </div>
          <div className="col-lg-6">
            <TextInput
              label="Email"
              placeholder="Email"
              {...form.getInputProps("email")}
            />
          </div>
          <div className="col-lg-6">
            <TextInput
              label="Mobile Number"
              withAsterisk
              placeholder="Mobile Number"
              pattern={
                "^(\\+\\d{1,3}[- ]?)?\\d{10}$" // only allow numbers and + sign
              }
              {...form.getInputProps("mobile")}
            />
          </div>
          <div className="col-lg-6">
            <TextInput
              label="Business Website"
              placeholder="Website"
              {...form.getInputProps("website")}
            />
          </div>
          <div className="col-lg-6">
            <TextInput
              label="GST Number"
              placeholder="GST Number"
              {...form.getInputProps("gst")}
            />
          </div>
          <div className="col-lg-6">
            <Select
              maxDropdownHeight={280}
              searchable
              clearable
              nothingFound="No options"
              label="Invoice Currency"
              withAsterisk
              itemComponent={({ item, ...others }) => (
                <Box {...others} padding="xs">
                  <Text size="sm" weight={500}>
                    {others.value}
                  </Text>
                  <Text size="xs" color="gray">
                    {others.code}- {others.label}
                  </Text>
                </Box>
              )}
              filter={(value, item) =>
                item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
                item.code.toLowerCase().includes(value.toLowerCase().trim())
              }
              placeholder="Invoice Currency"
              data={currencies}
              {...form.getInputProps("currency")}
            />
          </div>
        </div>

        <Textarea
          mt="sm"
          label="Complete Business Address"
          withAsterisk
          placeholder="Business Address"
          {...form.getInputProps("address")}
        />

        <div className="mt-3 text-center">
          <h6>
            <span className="text-muted">Logo</span>
          </h6>
          {form.values.logo && (
            <div>
              <img
                src={form.values.logo}
                alt="logo"
                style={{ width: "100px", height: "auto" }}
              />
            </div>
          )}
          <FileButton
            onChange={(newFile) => {
              const reader = new FileReader();
              reader.readAsDataURL(newFile);
              reader.onload = () => {
                form.setFieldValue("logo", reader.result);
              };
            }}
            accept="image/png,image/jpeg"
          >
            {(props) => (
              <>
                {form.values.logo ? (
                  <span className="mx-3">
                    <IconTrash
                      size={18}
                      className="hand-pointer text-danger"
                      onClick={() => {
                        form.setFieldValue("logo", null);
                      }}
                    />
                  </span>
                ) : (
                  <>
                    <Button {...props}>Select Logo</Button>
                    <div>
                      <small>(100px*100px)</small>
                    </div>
                  </>
                )}
              </>
            )}
          </FileButton>
        </div>

        <div>
          <Text mt="md">Terms & Conditions</Text>
          {form.values.terms.map((_, index) => (
            <Textarea
              key={`term_${index}`}
              placeholder="Add your Bill Term Here"
              mt="xs"
              autosize
              minRows={1}
              maxRows={2}
              {...form.getInputProps(`terms.${index}`)}
              rightSection={
                <IconTrash
                  color="red"
                  size={20}
                  className="hand-pointer"
                  onClick={() => removeTerm(index)}
                />
              }
            />
          ))}

          <Button mt="xs" color="dark" size="xs" onClick={addNewTerm}>
            <IconPlus />
            {form.values.terms.length ? "Add New" : "Add Term"}
          </Button>
        </div>

        <br />

        <Button type="submit" mt="sm">
          Save & Continue
        </Button>
      </form>
    </div>
  );
};

export default BusinessInfo;
