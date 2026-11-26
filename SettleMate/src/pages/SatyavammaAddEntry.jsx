import { useEffect, useState } from "react";
import api from "../api";

function SatyavammaAddEntry() {
  const items = [
  "AAGAKARA",
  "ANAPAKAYA",
  "ARATIKAYA",
  "BADDA CHIKKUDU",
  "BAJJI MIRCHI",
  "BARABATI",
  "BEANS",
  "BEANS PIKKALU",
  "BEERAKAYA",
  "BEETROOT",
  "BENDAKAYA",
  "CABBAGE",
  "CAPSICUM",
  "CARROT",
  "CAULIFLOWER",
  "CHEEMA",
  "CHELAKAYALU",
  "CHILAGADADUMPA",
  "DEMUDUCHIKKUDU",
  "DONDAKAYALU",
  "DOSAKAYALU",
  "GAJAR",
  "GORI CHIKKUDI",
  "GREEN PEAS",
  "GUMMADIKAYA",
  "KAKARAKAYALU",
  "KANDA",
  "KARA PENDALAM",
  "KEERA",
  "MAMIDI KAYALU",
  "MIRCHI",
  "MULLANKADA",
  "OSIRI KAYALU",
  "PANDU MIRCHI",
  "POTTLS",
  "TOMATO",
  "VANKAYALU"
];

  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [item, setItem] = useState("");
  const [weight, setWeight] = useState("");
  const [rate, setRate] = useState("");
  const [editId, setEditId] = useState(null);

 const [entries, setEntries] = useState([]);

async function fetchEntries() {
  try {
    const response = await api.get("/api/satyavamma");

    setEntries(response.data);
  } catch (error) {
    console.log(error);
  }
}

useEffect(() => {
  let ignore = false;

  api.get("/api/satyavamma")
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

  const amount =
    Math.round(
      ((Number(weight) || 0) *
        (Number(rate) || 0)) / 10
    ) * 10;

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editId) {
     await api.put(
  `/api/satyavamma/${editId}`,
  {
  username:
  localStorage.getItem(
    "loggedInUser"
  ),

  date,
  item,
  weight,
  rate,
  amount,
}
);
    } else {
      await api.post(
  "/api/satyavamma",
  {
  username:
  localStorage.getItem(
    "loggedInUser"
  ),
  date,
  item,
  weight,
  rate,
  amount,
}
);
    }

    fetchEntries();

    setEditId(null);
    setItem("");
    setWeight("");
    setRate("");

  } catch (error) {
    console.log(error);
  }
};

 const deleteEntry = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this entry?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
   await api.delete(`/api/satyavamma/${id}`);

    fetchEntries();
  } catch (error) {
    console.log(error);
  }
};
  const editEntry = (entry) => {
    const confirmEdit = window.confirm(
      "Do you want to edit this entry?"
    );

    if (!confirmEdit) {
      return;
    }

    setEditId(entry._id);

    setDate(entry.date);
    setItem(entry.item);
    setWeight(entry.weight);
    setRate(entry.rate);
  };

  const loggedInUser =
  localStorage.getItem(
    "loggedInUser"
  );

const filteredEntries = entries.filter(
  (entry) =>
    entry.username ===
      loggedInUser &&
    entry.date === date
);
  const grandTotal = filteredEntries.reduce(
    (sum, entry) => sum + entry.amount,
    0
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold mb-6">
          Satyavamma Add Entry
        </h1>

        <form onSubmit={handleSubmit}>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-2 font-medium">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Item
              </label>

              <select
                value={item}
                onChange={(e) =>
                  setItem(e.target.value)
                }
                className="w-full border rounded-lg p-3"
                required
              >
                <option value="">
                  Select Item
                </option>

                {items.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Weight
              </label>

              <input
                type="number"
                value={weight}
                onChange={(e) =>
                  setWeight(e.target.value)
                }
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Rate
              </label>

              <input
                type="number"
                value={rate}
                onChange={(e) =>
                  setRate(e.target.value)
                }
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

          </div>

          <div className="mt-4">
            <label className="block mb-2 font-medium">
              Amount
            </label>

            <input
              value={amount}
              readOnly
              className="w-full border rounded-lg p-3 bg-gray-100"
            />
          </div>

          <button
            type="submit"
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            {editId ? "Update Entry" : "Save Entry"}
          </button>

        </form>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-4">
          Entries
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">Date</th>
                <th className="border p-3">Item</th>
                <th className="border p-3">Weight</th>
                <th className="border p-3">Rate</th>
                <th className="border p-3">Amount</th>
                <th className="border p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry._id}>
                  <td className="border p-3">
                    {entry.date}
                  </td>

                  <td className="border p-3">
                    {entry.item}
                  </td>

                  <td className="border p-3">
                    {entry.weight}
                  </td>

                  <td className="border p-3">
                    {entry.rate}
                  </td>

                  <td className="border p-3">
                    ₹{entry.amount}
                  </td>

                  <td className="border p-3">
                    <button
                      onClick={() => editEntry(entry)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteEntry(entry._id)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

        <div className="mt-6 text-right">
          <h2 className="text-2xl font-bold text-green-600">
            Grand Total : ₹{grandTotal}
          </h2>
        </div>

      </div>
    </div>
  );
}

export default SatyavammaAddEntry;