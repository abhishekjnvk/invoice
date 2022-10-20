const AllStores = [
  {
    name: "customers",
    keyPath: "id",
    autoIncrement: true,
    indexes: [
      {
        name: "name",
        keyPath: "name",
        unique: false,
      },
      {
        name: "mobile",
        keyPath: "mobile",
        unique: true,
      },
      {
        name: "email",
        keyPath: "email",
        unique: false,
      },
      {
        name: "pincode",
        keyPath: "pincode",
        unique: false,
      },
      {
        name: "address",
        keyPath: "address",
        unique: false,
      },
      {
        name: "gstin",
        keyPath: "gstin",
        unique: false,
      },
      {
        name: "pan",
        keyPath: "pan",
        unique: false,
      },
    ],
  },
  {
    name: "invoices",
    keyPath: "id",
    autoIncrement: true,
    indexes: [
      {
        name: "invoiceNumber",
        keyPath: "invoiceNumber",
        unique: false,
      },
      {
        name: "invoiceDate",
        keyPath: "invoiceDate",
        unique: false,
      },
      {
        name: "invoiceNotes",
        keyPath: "invoiceNotes",
        unique: false,
      },
      {
        name: "invoiceTotal",
        keyPath: "invoiceTotal",
        unique: false,
      },
      {
        name: "invoicePaid",
        keyPath: "invoicePaid",
        unique: false,
      },
      {
        name: "invoiceDue",
        keyPath: "invoiceDue",
        unique: false,
      },
      {
        name: "invoiceStatus",
        keyPath: "invoiceStatus",
        unique: false,
      },
      {
        name: "invoiceCustomer",
        keyPath: "invoiceCustomer",
        unique: false,
      },
    ],
  },
  {
    name: "products",
    keyPath: "id",
    autoIncrement: true,
    indexes: [
      {
        name: "productName",
        keyPath: "productName",
        unique: false,
      },
      {
        name: "productDescription",
        keyPath: "productDescription",
        unique: false,
      },
      {
        name: "productPrice",
        keyPath: "productPrice",
        unique: false,
      },
      {
        name: "productQuantity",
        keyPath: "productQuantity",
        unique: false,
      },
      {
        name: "productDiscount",
        keyPath: "productDiscount",
        unique: false,
      },
      {
        name: "productTotal",
        keyPath: "productTotal",
        unique: false,
      },
      {
        name: "productInvoice",
        keyPath: "productInvoice",
        unique: false,
      },
    ],
  },
];

export const connectDB = (f = () => {}) => {
  var request = indexedDB.open("invoiceDB", 1);
  request.onerror = (err) => {
    console.log("Error opening database", err);
  };
  request.onsuccess = function () {
    f(request.result);
  };
  request.onupgradeneeded = function (e) {
    var Db = e.currentTarget.result;
    AllStores.forEach((store) => {
      if (!Db.objectStoreNames.contains(store.name)) {
        var objectStore = Db.createObjectStore(store.name, {
          keyPath: store.keyPath,
          autoIncrement: store.autoIncrement,
        });
        store.indexes.forEach((index) => {
          objectStore.createIndex(index.name, index.keyPath, {
            unique: index.unique,
          });
        });
      }
    });
    connectDB(f);
  };
};

export const addData = (storeName, data) => {
  connectDB(function (db) {
    var transaction = db.transaction(storeName, "readwrite");
    var store = transaction.objectStore(storeName);
    var request = store.add(data);
    request.onsuccess = function (e) {
      console.log("Data added successfully");
    };
    request.onerror = function (e) {
      console.log("Error: ", e.target?.error?.message);
    };
  });
};

// get all data
export const getAllData = (storeName) => {
  return new Promise((resolve, reject) => {
    connectDB(function (db) {
      var rows = [],
        store = db.transaction([storeName], "readonly").objectStore(storeName);

      if (store.mozGetAll)
        store.mozGetAll().onsuccess = function (e) {
          resolve(e.target.result);
        };
      else
        store.openCursor().onsuccess = function (e) {
          var cursor = e.target.result;
          if (cursor) {
            rows.push(cursor.value);
            cursor.continue();
          } else {
            resolve(rows);
          }
        };
    });
  });
};

export const getById = (storeName, id) => {
  return new Promise((resolve, reject) => {
    connectDB(function (db) {
      var transaction = db.transaction([storeName], "readonly");
      var objectStore = transaction.objectStore(storeName);
      var request = objectStore.get(id);
      request.onerror = function (event) {
        reject(event);
      };
      request.onsuccess = function (event) {
        resolve(request.result);
      };
    });
  });
};

// get by column value
export const getByColumn = (storeName, column, value) => {
  return new Promise((resolve, reject) => {
    connectDB(function (db) {
      var rows = [],
        store = db
          .transaction([storeName], "readonly")
          .objectStore(storeName)
          .index(column);

      if (store.mozGetAll)
        store.mozGetAll().onsuccess = function (e) {
          resolve(e.target.result);
        };
      else
        store.openCursor().onsuccess = function (e) {
          var cursor = e.target.result;
          if (cursor) {
            if (cursor.value[column] === value) {
              rows.push(cursor.value);
            }
            cursor.continue();
          } else {
            resolve(rows);
          }
        };
    });
  });
};

export const searchByWildCard = (storeName, column, value) => {
  return new Promise((resolve, reject) => {
    connectDB(function (db) {
      var rows = [],
        store = db
          .transaction([storeName], "readonly")
          .objectStore(storeName)
          .index(column);

      if (store.mozGetAll)
        store.mozGetAll().onsuccess = function (e) {
          resolve(e.target.result);
        };
      else
        store.openCursor().onsuccess = function (e) {
          var cursor = e.target.result;
          if (cursor) {
            if (cursor.value[column].includes(value)) {
              rows.push(cursor.value);
            }
            cursor.continue();
          } else {
            resolve(rows);
          }
        };
    });
  });
};

// delete by id
export const deleteById = (storeName, id) => {
  return new Promise((resolve, reject) => {
    connectDB(function (db) {
      var request = db
        .transaction([storeName], "readwrite")
        .objectStore(storeName)
        .delete(id);
      request.onsuccess = function (event) {
        resolve(true);
      };
    });
  });
};

//delete by column value
export const deleteByColumnValue = (storeName, column, value) => {
  getByColumn(storeName, column, value).then((data) => {
    data.forEach((item) => {
      deleteById(storeName, item.id);
    });
  });
};
