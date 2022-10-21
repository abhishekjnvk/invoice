import React from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button, Box, Textarea, Text } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons";

const BusinessInfo = ({ setStep }) => {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      address: "",
      website: "",
      terms: [],
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
      website: (value) =>
        value.length
          ? /^https?:\/\/\S+$/.test(value)
            ? null
            : "Invalid URL"
          : null,
    },
  });

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
    setStep(1);
  };

  return (
    <Box sx={{ maxWidth: 340 }} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Business Name"
          placeholder="Name"
          {...form.getInputProps("name")}
        />
        <TextInput
          mt="sm"
          label="Email"
          placeholder="Email"
          {...form.getInputProps("email")}
        />
        <TextInput
          mt="sm"
          label="Mobile Number"
          placeholder="Mobile Number"
          pattern={
            "^(\\+\\d{1,3}[- ]?)?\\d{10}$" // only allow numbers and + sign
          }
          {...form.getInputProps("mobile")}
        />
        <Textarea
          mt="sm"
          label="Complete Business Address"
          placeholder="Business Address"
          {...form.getInputProps("address")}
        />
        <TextInput
          mt="sm"
          label="Business Website"
          placeholder="Website"
          {...form.getInputProps("website")}
        />
        <div>
          <Text mt="md">Terms & Conditions</Text>

          {form.values.terms.map((_, index) => (
            <>
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
            </>
          ))}

          <Button mt="xs" color="dark" size="xs" onClick={addNewTerm}>
            <IconPlus />
            {form.values.terms.length ? "Add New" : "Add Term"}
          </Button>
        </div>

        <br />

        <Button type="submit" mt="sm">
          Proceed
        </Button>
      </form>
    </Box>
  );
};

export default BusinessInfo;
