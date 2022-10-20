import {
  Group,
  TextInput,
  Box,
  Button,
  NumberInput,
  Textarea,
  Grid,
  CloseButton,
  ActionIcon,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  IconCaretDown,
  IconCaretUp,
  IconCurrencyRupee,
  IconGripVertical,
  IconPercentage,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { addInvoice, getInvoiceNumber } from "../utils/dbModel/invoice";

const newItem = {
  name: "",
  rate: "",
  unit: "",
  discount: 0,
  description: "",
  openMore: false,
};

function ItemsInfo({ invoiceNumber, setInvoiceNumber, customer }) {
  const [paid, setPaid] = useState(0);

  useEffect(() => {
    getInvoiceNumber().then((res) => {
      setInvoiceNumber(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm({
    initialValues: {
      items: [newItem],
    },
  });

  const total =
    form.values.items
      .reduce(
        (acc, item) =>
          acc +
          (item.unit * item.rate -
            (Number(item.discount || 0) / 100) * (item.unit * item.rate)),
        0
      )
      .toFixed(2) || 0;

  useEffect(() => {
    setPaid(Number(total));
  }, [total]);

  const removeItem = (index) => {
    let filteredItems = form.values.items.filter((item, i) => i !== index);
    form.setFieldValue("items", filteredItems);
    form.setFieldError(`items.${index}.name`, null);
    form.setFieldError(`items.${index}.rate`, null);
    form.setFieldError(`items.${index}.unit`, null);
  };

  const handleAddNewItem = () => {
    if (
      form.values.items.length === 0 ||
      (form.values.items[form.values.items.length - 1].name &&
        form.values.items[form.values.items.length - 1].rate &&
        form.values.items[form.values.items.length - 1].unit)
    ) {
      let filteredItems = form.values.items.filter((item) => item !== "");
      form.setFieldValue("items", [...filteredItems, newItem]);
    } else {
      if (!form.values.items[form.values.items.length - 1].name) {
        form.setFieldError(
          `items.${form.values.items.length - 1}.name`,
          "Required"
        );
      }
      if (!form.values.items[form.values.items.length - 1].rate) {
        form.setFieldError(
          `items.${form.values.items.length - 1}.rate`,
          "Required"
        );
      }
      if (!form.values.items[form.values.items.length - 1].unit) {
        form.setFieldError(
          `items.${form.values.items.length - 1}.unit`,
          "Required"
        );
      }
    }
  };

  const fields = form.values.items.map((_, index) => (
    <Draggable key={index} index={index} draggableId={`item_${index}`}>
      {(provided) => (
        <>
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <div className="row">
              <div className="col-md-1 pt-4">
                <Button
                  variant="light"
                  {...provided.dragHandleProps}
                  radius="xs"
                  disabled={
                    form.values.items[index].name &&
                    form.values.items[index].rate &&
                    form.values.items[index].unit
                      ? false
                      : true
                  }
                  size="xs"
                  color="blue"
                >
                  <IconGripVertical size={18} /> {index + 1}
                </Button>{" "}
              </div>
              <div className="col-md-6">
                <TextInput
                  label="Item Name"
                  placeholder="Item Name"
                  {...form.getInputProps(`items.${index}.name`)}
                />
              </div>
              <div className="col-md-4">
                <Grid>
                  <Grid.Col span={5}>
                    <NumberInput
                      label="Rate"
                      placeholder="Rate Per Unit"
                      hideControls
                      icon={<IconCurrencyRupee size={18} />}
                      formatter={(value) =>
                        !Number.isNaN(parseFloat(value))
                          ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : ""
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      {...form.getInputProps(`items.${index}.rate`)}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <NumberInput
                      label="Unit"
                      placeholder="Number Of Unit"
                      width={10}
                      hideControls
                      {...form.getInputProps(`items.${index}.unit`)}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <NumberInput
                      label="Discount"
                      placeholder="Discount in percentage"
                      max={100}
                      min={0}
                      width={10}
                      hideControls
                      rightSection={<IconPercentage size={18} />}
                      {...form.getInputProps(`items.${index}.discount`)}
                    />
                  </Grid.Col>
                </Grid>
              </div>
              <div className="col-md-1 pt-4">
                <Group>
                  <ActionIcon
                    size="xs"
                    variant="light"
                    radius="xs"
                    color="blue"
                    onClick={() => {
                      form.setFieldValue(
                        `items.${index}.openMore`,
                        !form.values.items[index].openMore
                      );
                    }}
                  >
                    {form.values.items[index].openMore ? (
                      <IconCaretUp />
                    ) : (
                      <IconCaretDown />
                    )}
                  </ActionIcon>
                  <CloseButton
                    variant="link"
                    radius="xs"
                    color="red"
                    onClick={() => removeItem(index)}
                  />
                </Group>
              </div>
            </div>

            {form.values.items[index].openMore && (
              <div className="col-lg-12">
                <Grid>
                  <Grid.Col span={1}></Grid.Col>
                  <Grid.Col span={6}>
                    <Textarea
                      label="Item Description"
                      minRows={1}
                      size="sm"
                      autosize
                      {...form.getInputProps(`items.${index}.description`)}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Grid>
                      <Grid.Col span={12}>
                        <NumberInput
                          size="sm"
                          label="Total"
                          width={10}
                          disabled={true}
                          icon={<IconCurrencyRupee size={18} />}
                          formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                              ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              : ""
                          }
                          value={
                            (
                              form.values.items[index]?.unit *
                                form.values.items[index]?.rate -
                              (Number(form.values.items[index]?.discount || 0) /
                                100) *
                                (form.values.items[index]?.unit *
                                  form.values.items[index]?.rate)
                            ).toFixed(2) || 0
                          }
                        />
                      </Grid.Col>
                    </Grid>
                  </Grid.Col>
                </Grid>
              </div>
            )}
          </div>
          <hr />
        </>
      )}
    </Draggable>
  ));

  const handleGenerateInvoice = async () => {
    let invoiceObj = {
      invoiceNumber,
      items: form.values.items,
      total,
      paid,
      customerId: customer.id,
      customerName: customer.name,
    };
    let data = await addInvoice(invoiceObj);
    console.log(data);
  };
  return (
    <Box sx={{ maxWidth: "80%" }} mx="auto">
      <div className="row my-3">
        <div className="col-lg-6 text-start">
          Bill To:{" "}
          <strong>
            {" "}
            {customer.name}({customer.mobile})
          </strong>
        </div>
        <div className="col-lg-6 text-end">
          Invoice Number: <strong> {invoiceNumber}</strong>
        </div>
      </div>

      <DragDropContext
        onDragEnd={({ destination, source }) => {
          if (
            form.values.items[destination.index].name &&
            form.values.items[destination.index].rate &&
            form.values.items[destination.index].unit &&
            form.values.items[source.index].name &&
            form.values.items[source.index].rate &&
            form.values.items[source.index].unit
          ) {
            return form.reorderListItem("items", {
              from: source.index,
              to: destination.index,
            });
          }
        }}
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {fields}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Group position="center" mt="md">
        <Button onClick={handleAddNewItem}>Add Item</Button>
      </Group>
      <div className="row justify-content-end">
        <div className="col-lg-3 text-end">
          Total:
          <strong>{total}</strong>
          <br />
          <div className="text-start col-lg-6 float-end">
            <NumberInput
              hideControls
              label="Total Paid"
              value={paid}
              onChange={(val) => setPaid(val)}
            />
          </div>
        </div>
      </div>
      <Text align="right"></Text>
      <Button onClick={handleGenerateInvoice}>Print</Button>
    </Box>
  );
}

export default ItemsInfo;
