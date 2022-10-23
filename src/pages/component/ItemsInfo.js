import { useEffect, useState } from "react";
import {
  Group,
  TextInput,
  Button,
  NumberInput,
  Textarea,
  Grid,
  ActionIcon,
  Text,
  NativeSelect,
  CloseButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  IconCaretDown,
  IconCaretUp,
  IconGripVertical,
  IconTrash,
} from "@tabler/icons";
import { useNavigate } from "react-router-dom";

import { addInvoice, getInvoiceNumber } from "../../utils/dbModel/invoice";

const newItem = {
  name: "",
  rate: "",
  unit: "",
  discount: 0,
  description: "",
  openMore: false,
  discountType: 1,
};

function ItemsInfo({ invoiceNumber, setInvoiceNumber, customer }) {
  const [paid, setPaid] = useState(0);
  const navigate = useNavigate();
  const [businessInfo, setBusinessInfo] = useState({});

  useEffect(() => {
    getInvoiceNumber().then((res) => {
      setInvoiceNumber(res);
    });
    let businessInfo = localStorage.getItem("businessInfo");
    if (businessInfo) {
      setBusinessInfo(JSON.parse(businessInfo));
    }
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
          ((item.unit || 0) * (item.rate || 0) -
            (item.discountType === 1
              ? Number(
                  ((item.discount || 0) * (item.unit || 0) * (item.rate || 0)) /
                    100
                )
              : Number(item.discount || 0))),

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
              <div className="col-md-6">
                <Grid>
                  <Grid.Col span={1}>
                    <ActionIcon
                      mt="md"
                      py="md"
                      {...provided.dragHandleProps}
                      disabled={
                        form.values.items[index].name &&
                        form.values.items[index].rate &&
                        form.values.items[index].unit
                          ? false
                          : true
                      }
                    >
                      <IconGripVertical size={18} />
                    </ActionIcon>
                  </Grid.Col>
                  <Grid.Col span={9}>
                    <TextInput
                      label="Item Name"
                      size="xs"
                      placeholder="Item Name"
                      {...form.getInputProps(`items.${index}.name`)}
                    />
                  </Grid.Col>
                  <Grid.Col span={1}>
                    <ActionIcon
                      mt="lg"
                      color="blue"
                      onClick={() => {
                        form.setFieldValue(
                          `items.${index}.openMore`,
                          !form.values.items[index].openMore
                        );
                      }}
                    >
                      {form.values.items[index].openMore ? (
                        <IconCaretUp size={16} stroke={1.5} />
                      ) : (
                        <IconCaretDown size={16} stroke={1.5} />
                      )}
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
              </div>
              <div className="col-md-4">
                <Grid>
                  <Grid.Col span={4}>
                    <NumberInput
                      label="Rate"
                      size="xs"
                      placeholder="Rate Per Unit"
                      hideControls
                      icon={<>{businessInfo.currency}</>}
                      formatter={(value) =>
                        !Number.isNaN(parseFloat(value))
                          ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : ""
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      {...form.getInputProps(`items.${index}.rate`)}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <TextInput
                      type="number"
                      label="Unit"
                      placeholder="Number Of Unit"
                      size="xs"
                      min={0}
                      {...form.getInputProps(`items.${index}.unit`)}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Group>
                      <NumberInput
                        label="Discount"
                        placeholder="Discount in percentage"
                        min={0}
                        size="xs"
                        max={
                          form.values.items[index].discountType === 1
                            ? 100
                            : form.values.items[index].rate *
                              form.values.items[index].unit
                        }
                        hideControls
                        rightSection={
                          <NativeSelect
                            styles={{
                              input: {
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                borderRight: 0,
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                              },
                            }}
                            value={form.values.items[index].discountType}
                            onChange={(e) => {
                              form.setFieldValue(
                                `items.${index}.discountType`,
                                Number(e.target.value)
                              );
                            }}
                            data={[
                              { value: 1, label: "%" },
                              { value: 2, label: businessInfo?.currency || "" },
                            ]}
                            size="xs"
                          />
                        }
                        rightSectionWidth={50}
                        {...form.getInputProps(`items.${index}.discount`)}
                      />
                    </Group>
                  </Grid.Col>
                </Grid>
              </div>
              <div className="col-md-2 text-end pt-4">
                <small>
                  {(
                    (form.values.items[index].rate || 0) *
                      (form.values.items[index].unit || 0) -
                    (form.values.items[index].discountType === 1
                      ? ((form.values.items[index].rate || 0) *
                          (form.values.items[index].unit || 0) *
                          form.values.items[index].discount || 0) / 100
                      : form.values.items[index].discount)
                  ).toFixed(2)}
                </small>
                <IconTrash
                  className="hand-pointer ms-2"
                  onClick={() => removeItem(index)}
                  color="red"
                  size={16}
                  stroke={1.5}
                />
              </div>
            </div>

            {form.values.items[index].openMore && (
              <div className="col-lg-12 px-5">
                <Grid>
                  <Grid.Col span={5}>
                    <Textarea
                      label="Item Description"
                      minRows={1}
                      size="xs"
                      autosize
                      {...form.getInputProps(`items.${index}.description`)}
                    />
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
    if (form.values.items.length) {
      let invoiceObj = {
        invoiceNumber,
        items: form.values.items,
        total,
        paid,
        customerId: customer.id,
        customerName: customer.name,
      };
      let { invoiceNumber: invNum } = await addInvoice(invoiceObj);
      navigate(`/bill/${invNum}`);
    }
  };
  return (
    <div className="col-lg-9 mx-auto">
      <div className="row my-3">
        <div className="col-lg-6 text-start">
          Bill To:{" "}
          <strong>
            {" "}
            {customer.name}({customer.mobile})
          </strong>
        </div>
        <div className="col-lg-6 text-end">
          Invoice Number: <strong> {invoiceNumber}</strong>{" "}
          <small className="ms-3">
            <CloseButton
              className="float-end"
              color="red"
              onClick={() => {
                if (
                  window.confirm(
                    "All filled data will be lost. Are you sure you want to cancel?"
                  )
                ) {
                  window.location.reload();
                }
              }}
              about="Cancel"
            />
          </small>
        </div>
      </div>
      <hr />
      <h6 className="text-muted text-center">Items</h6>

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
              <form autoComplete="off">{fields}</form>
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
      <Text mt="xs" align="right">
        <Button
          title={
            form.values.items.some((item) => {
              return !item.name || !item.rate || !item.unit;
            })
              ? "Please Fill all remaining field"
              : ""
          }
          disabled={
            form.values.items.length === 0 ||
            form.values.items.some((item) => {
              return !item.name || !item.rate || !item.unit;
            })
          }
          onClick={handleGenerateInvoice}
        >
          Generate Bill
        </Button>
      </Text>
    </div>
  );
}

export default ItemsInfo;
