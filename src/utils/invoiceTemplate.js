export const invoiceTemplate1 = (client, business, invoice) => {
  let itemTable = [];
  let invoiceItems = invoice.items;

  itemTable.push([
    {
      text: "Sl.",
      color: "darkblue",
      bold: true,
    },
    {
      text: "Item",
      color: "darkblue",
      bold: true,
    },
    {
      text: "Rate",
      color: "darkblue",
      bold: true,
    },
    {
      text: "Quantity",
      color: "darkblue",
      bold: true,
    },
    {
      text: "Discount",
      color: "darkblue",
      bold: true,
    },
    {
      text: "Amount",
      color: "darkblue",
      bold: true,
    },
  ]);

  for (let i = 0; i < invoiceItems.length; i++) {
    itemTable.push([
      {
        text: i + 1,
      },
      {
        text: invoiceItems[i].name,
      },
      {
        text: business.currency + invoiceItems[i].rate.toFixed("2"),
        alignment: "right",
      },
      {
        text: invoiceItems[i].unit,
        alignment: "right",
      },
      {
        text:
          (invoiceItems[i].discountType === 2 ? business.currency : "") +
          invoiceItems[i].discount.toFixed("2") +
          (invoiceItems[i].discountType === 1 ? "%" : ""),
        alignment: "right",
      },
      {
        text:
          business.currency +
          (
            invoiceItems[i].rate * invoiceItems[i].unit -
            (invoiceItems[i].discountType === 1
              ? (invoiceItems[i].rate *
                  invoiceItems[i].unit *
                  invoiceItems[i].discount) /
                100
              : invoiceItems[i].discount)
          ).toFixed(2),
        alignment: "right",
        bold: true,
      },
    ]);
  }

  return {
    content: [
      {
        text: business.name,
        fontSize: 20,
        bold: true,
        alignment: "center",
        color: "#047886",
      },
      {
        columns: [
          [
            business.logo
              ? {
                  image: business.logo,
                  width: 80,
                  height: 80,
                }
              : {},
          ],
          [
            {
              text: `INVOICE`,
              bold: true,
              alignment: "right",
            },
            {
              text: `Bill No : ${invoice.invoiceNumber}`,
              bold: true,
              alignment: "right",
            },
            {
              text: `Date: ${invoice.date}`,
              bold: true,
              alignment: "right",
            },
          ],
        ],
      },
      {
        columns: [
          [
            {
              text: "From",
              italics: true,
              decoration: "underline",
            },
            {
              text: business.name,
              bold: true,
              fontSize: 14,
            },
            {
              text: "Mobile: " + business.mobile,
              italics: true,
            },
            {
              text: business.email ? "Email: " + business.email : "",
              italics: true,
            },
            {
              text: business.address,
              italics: true,
            },
          ],
          [
            {
              text: "To",
              alignment: "right",
              italics: true,
              decoration: "underline",
            },
            {
              text: client.name,
              alignment: "right",
              bold: true,
              fontSize: 14,
            },
            {
              text: "Mobile: " + client.mobile,
              italics: true,
              alignment: "right",
            },
            {
              text: client.email ? "Email: " + client.email : "",
              italics: true,
              alignment: "right",
            },
            {
              text: client.address || "N/A",
              italics: true,
              alignment: "right",
            },
          ],
        ],
        margin: [0, 10, 0, 0],
      },
      {
        text: "Order Details",
        style: "sectionHeader",
      },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "auto", "auto", "auto"],
          body: [...itemTable],
        },
        margin: [0, 10, 0, 0],
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          body: [
            [
              {
                text: "Total",
                bold: true,
                alignment: "right",
              },
              {
                text: business.currency + invoice.total,
                bold: true,
              },
            ],
            [
              {
                text: "Paid",
                bold: true,
                alignment: "right",
              },
              {
                text: business.currency + invoice.paid,
                bold: true,
              },
            ],
            [
              {
                text: "Due",
                bold: true,
                alignment: "right",
              },
              {
                text: business.currency + invoice.due,
                bold: true,
              },
            ],
          ],
        },
        margin: [0, 10, 0, 0],
        layout: "noBorders",
      },
      {
        text: "Additional Details",
        style: "sectionHeader",
      },
      {
        text: invoice.notes || "-----",
        margin: [0, 0, 0, 15],
      },
      {
        columns: [
          [{ qr: `${invoice.invoiceNumber}`, fit: "50" }],
          [{ text: "Signature", alignment: "right", italics: true }],
        ],
      },
      {
        text: business.terms?.length > 0 ? "Terms and Conditions" : "",
        style: "sectionHeader",
      },
      {
        ul: business.terms,
      },
      {
        canvas: [
          { type: "line", x1: 0, y1: 10, x2: 515, y2: 10, lineWidth: 1 },
          { type: "line", x1: 0, y1: 12, x2: 515, y2: 12, lineWidth: 1 },
        ],
      },
    ],
    styles: {
      sectionHeader: {
        bold: true,
        decoration: "underline",
        fontSize: 14,
        margin: [0, 15, 0, 15],
      },
    },
  };
};
