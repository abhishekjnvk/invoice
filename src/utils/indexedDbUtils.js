const AllStores = [
  {
    name: "customers",
    keyPath: "id",
    autoIncrement: true,
    indexes: [
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
        unique: true,
      },
      {
        name: "date",
        keyPath: "date",
        unique: false,
      },
      {
        name: "customerId",
        keyPath: "customerId",
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
  return new Promise((resolve, reject) => {
    connectDB((db) => {
      var transaction = db.transaction([storeName], "readwrite");
      var objectStore = transaction.objectStore(storeName);
      var request = objectStore.add(data);
      request.onsuccess = function (event) {
        data.id = event.target.result;
        resolve(data);
      };
      request.onerror = function (err) {
        reject(err);
      };
    });
  });
};

export const updateData = (storeName, id, data) => {
  return new Promise((resolve, reject) => {
    connectDB(function (db) {
      var transaction = db.transaction(storeName, "readwrite");
      var store = transaction.objectStore(storeName);
      data.id = id;
      var request = store.put(data);
      request.onsuccess = () => {
        resolve(data);
      };
      request.onerror = (e) => {
        reject(e);
        console.log("Error: ", e.target?.error?.message);
      };
    });
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
            // eslint-disable-next-line eqeqeq
            if (cursor.value[column] == value) {
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
