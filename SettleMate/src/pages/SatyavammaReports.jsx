import { useEffect, useState } from "react";
import api from "../api";
import jsPDF from "jspdf";

function SatyavammaReports() {
  const [entries, setEntries] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] =
    useState(today);

  const [toDate, setToDate] =
    useState(today);

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

  const [charges, setCharges] =
    useState("");

  const [baki, setBaki] =
    useState("");

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

  const dailyTotal = filteredEntries.reduce(
    (sum, entry) => sum + entry.amount,
    0
  );

  const netAmount =
    dailyTotal +
    Number(charges || 0) +
    Number(baki || 0);

  const generatePDF = () => {
    const pdf = new jsPDF();

    const PAGE_HEIGHT = 285;
    const MARGIN_BOTTOM = 18;
    let y = 0;

    const COL = {
      item: 20,
      weight: 75,
      rate: 120,
      amount: 165,
    };

    const checkNewPage = (
      neededSpace = 12
    ) => {
      if (
        y + neededSpace >
        PAGE_HEIGHT - MARGIN_BOTTOM
      ) {
        pdf.addPage();
        y = 20;
      }
    };

    const drawLine = (
      lineY,
      r = 180,
      g = 180,
      b = 180
    ) => {
      pdf.setDrawColor(r, g, b);
      pdf.line(14, lineY, 196, lineY);
    };

    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      "SATYAVAMMA REPORT",
      14,
      16
    );

    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(80);

    pdf.text(
      `Period : ${fromDate} to ${toDate}`,
      14,
      25
    );

    pdf.setTextColor(0);

    drawLine(30);

    y = 40;

    Object.keys(groupedEntries)
      .sort()
      .forEach((date) => {
        checkNewPage(40);

        pdf.setFontSize(15);
        pdf.setFont("helvetica", "bold");

        pdf.text(date, 14, y);

        y += 8;

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(120);

        pdf.text(
          "Item",
          COL.item,
          y
        );

        pdf.text(
          "Weight",
          COL.weight,
          y
        );

        pdf.text(
          "Rate",
          COL.rate,
          y
        );

        pdf.text(
          "Amount",
          COL.amount,
          y
        );

        pdf.setTextColor(0);

        y += 7;

        let dayTotal = 0;

        groupedEntries[date].forEach(
          (entry) => {
            checkNewPage(10);

            pdf.setFontSize(12);
            pdf.setFont(
              "helvetica",
              "normal"
            );

            pdf.text(
              String(entry.item),
              COL.item,
              y
            );

            pdf.text(
              `${entry.weight} kg`,
              COL.weight,
              y
            );

            pdf.text(
              `Rs.${entry.rate}`,
              COL.rate,
              y
            );

            pdf.text(
              `Rs.${entry.amount}`,
              COL.amount,
              y
            );

            dayTotal += entry.amount;

            y += 9;
          }
        );

        checkNewPage(12);

        pdf.setFontSize(12);
        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setTextColor(
          30,
          100,
          200
        );

        pdf.text(
          `Day Total : Rs.${dayTotal}`,
          COL.item,
          y
        );

        pdf.setTextColor(0);

        y += 8;

        drawLine(y);

        y += 9;
      });

    checkNewPage(14);

    pdf.setFontSize(14);
    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      `Daily Total : Rs.${dailyTotal}`,
      COL.item,
      y
    );

    y += 12;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");

    pdf.text(
      `Charges : Rs.${charges || 0}`,
      COL.item,
      y
    );

    y += 8;

    pdf.text(
      `Baki : Rs.${baki || 0}`,
      COL.item,
      y
    );

    y += 10;

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");

    pdf.text(
      `Net Amount : Rs.${netAmount}`,
      COL.item,
      y
    );

    pdf.save(
      `Satyavamma_Report_${fromDate}_to_${toDate}.pdf`
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold mb-6">
          Satyavamma Report
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
                setFromDate(
                  e.target.value
                )
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
                setToDate(
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

        </div>

        <h2 className="text-2xl font-bold mb-6">
          Preview Report
        </h2>

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
                className="mb-6"
              >
                <h3 className="text-xl font-bold mb-3">
                  {date}
                </h3>

                <div className="overflow-x-auto">
                  <table
  className="border-collapse"
  style={{
    width: "700px",
    lineHeight: "1.8"
  }}
>
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="py-0 font-medium">Item</th>
                        <th className="py-0 font-medium">Weight</th>
                        <th className="py-0 font-medium">Rate</th>
                        <th className="py-0 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedEntries[date].map((entry) => (
                        <tr key={entry._id}>
                          <td style={{ width: "250px" }}>
                            {entry.item}
                          </td>
                         <td style={{ width: "120px" }}>
                            {entry.weight} kg
                          </td>
                      <td style={{ width: "120px" }}>
                            Rs.{entry.rate}
                          </td>
                         <td style={{ width: "120px" }}>
                            Rs.{entry.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="font-bold text-blue-600 mt-2">
                  Day Total : ₹{dayTotal}
                </h3>

              </div>
            );
          })}

        <div className="border-t-2 border-gray-400 mt-4 pt-4 mb-10">

          <h3 className="font-bold text-lg">
            Daily Total : ₹{dailyTotal}
          </h3>

          <div className="mt-4">
            <label className="block mb-2 font-medium">
              Charges
            </label>

            <input
              type="number"
              value={charges}
              onChange={(e) =>
                setCharges(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2 font-medium">
              Baki
            </label>

            <input
              type="number"
              value={baki}
              onChange={(e) =>
                setBaki(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="mt-4 border-t pt-4">
            <h3 className="font-bold text-xl text-green-600">
              Net Amount : ₹{netAmount}
            </h3>
          </div>

        </div>

        <div className="mt-10">
          <button
            onClick={generatePDF}
            className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-700"
          >
            Generate PDF
          </button>
        </div>

      </div>
    </div>
  );
}

export default SatyavammaReports;