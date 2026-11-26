import { useEffect, useState } from "react";
import api from "../api";

function VendorSummary() {
  const [entries, setEntries] = useState([]);

  const vendors = [
    ...new Set(entries.map((entry) => entry.vendor)),
  ];

  const today = new Date().toISOString().split("T")[0];

  const [selectedVendor, setSelectedVendor] =
    useState("");

  const [fromDate, setFromDate] =
    useState(today);

  const [toDate, setToDate] =
    useState(today);

useEffect(() => {
  let ignore = false;

  api.get("/api/purchases")
    .then(({ data }) => {
      if (!ignore) {
        setEntries(data);
      }
    })
    .catch((error) => console.error(error));

  return () => {
    ignore = true;
  };
}, []);

  const loggedInUser =
  localStorage.getItem(
    "loggedInUser"
  );

const filteredEntries = entries.filter(
  (entry) =>
    entry.username ===
      loggedInUser &&
    entry.vendor === selectedVendor &&
    entry.date >= fromDate &&
    entry.date <= toDate
);

  const groupedEntries = filteredEntries.reduce(
    (acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = [];
      }

      acc[entry.date].push(entry);

      return acc;
    },
    {}
  );

  const totalAmount = filteredEntries.reduce(
    (sum, entry) => sum + entry.amount,
    0
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold mb-6">
          Vendor Summary
        </h1>

        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <div>
            <label className="block mb-2 font-medium">
              Vendor
            </label>

            <select
              value={selectedVendor}
              onChange={(e) =>
                setSelectedVendor(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            >
              <option value="">
                Select Vendor
              </option>

              {vendors.map((vendor) => (
                <option
                  key={vendor}
                  value={vendor}
                >
                  {vendor}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

        </div>

        {Object.keys(groupedEntries)
          .sort()
          .map((date) => (
            <div key={date} className="mb-8">

              <h2 className="text-xl font-bold mb-3">
                {date}
              </h2>

              {groupedEntries[date].map(
                (entry) => (
                  <div
                    key={entry._id}
                    className="flex flex-wrap gap-6 mb-2"
                  >
                    <span>
                      {entry.item}
                    </span>

                    <span>
                      {entry.weight} kg
                    </span>

                    <span>
                      ₹{entry.rate}
                    </span>

                    <span>
                      ₹{entry.amount}
                    </span>
                  </div>
                )
              )}

            </div>
          ))}

        <div className="mt-8 text-right">

          <h2 className="text-2xl font-bold text-green-600">
            Total Amount : ₹{totalAmount}
          </h2>

        </div>

      </div>
    </div>
  );
}

export default VendorSummary;