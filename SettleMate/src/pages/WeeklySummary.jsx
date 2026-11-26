import { useEffect, useState } from "react";
import api from "../api";

function WeeklySummary() {
  const [entries, setEntries] = useState([]);

  const today = new Date().toISOString().split("T")[0];

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

  const grandTotal = filteredEntries.reduce(
    (sum, entry) => sum + entry.amount,
    0
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold mb-6">
          Weekly Summary
        </h1>

        <div className="grid md:grid-cols-2 gap-4 mb-8">

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
          .map((date) => {

            const dayTotal =
              groupedEntries[date].reduce(
                (sum, entry) =>
                  sum + entry.amount,
                0
              );

            return (
              <div
                key={date}
                className="mb-8"
              >

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
                        {entry.vendor}
                      </span>

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

                <div className="mt-3">
                  <h3 className="font-bold text-blue-600">
                    Day Total : ₹{dayTotal}
                  </h3>
                </div>

              </div>
            );
          })}

        <div className="mt-8 text-right">
          <h2 className="text-3xl font-bold text-green-600">
            Grand Total : ₹{grandTotal}
          </h2>
        </div>

      </div>
    </div>
  );
}

export default WeeklySummary;