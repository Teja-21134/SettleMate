import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function Reports() {
  const [entries, setEntries] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  useEffect(() => {
  fetchEntries();
}, []);

const fetchEntries = async () => {
  try {
    const response = await axios.get(
      "https://ravi-settle-mate.vercel.app/api/purchases"
    );

    setEntries(response.data);
  } catch (error) {
    console.log(error);
  }
};

  const loggedInUser =
  localStorage.getItem(
    "loggedInUser"
  ) || "ravi";

const filteredEntries = entries.filter(
  (entry) =>
    entry.username ===
      loggedInUser &&
    entry.date >= fromDate &&
    entry.date <= toDate
);

  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  const vendorTotals = filteredEntries.reduce((acc, entry) => {
    acc[entry.vendor] = (acc[entry.vendor] || 0) + entry.amount;
    return acc;
  }, {});

  const dailyTotal = filteredEntries.reduce(
    (sum, entry) => sum + entry.amount,
    0
  );

  const vendorGrandTotal = Object.values(vendorTotals).reduce(
    (sum, amount) => sum + amount,
    0
  );

  const generatePDF = () => {
    const pdf = new jsPDF();

    const PAGE_HEIGHT = 285;
    const MARGIN_BOTTOM = 18;
    let y = 0;

    const COL = {
      vendor: 18,
      item: 58,
      weight: 95,
      rate: 128,
      amount: 165,
    };

    const checkNewPage = (neededSpace = 12) => {
      if (y + neededSpace > PAGE_HEIGHT - MARGIN_BOTTOM) {
        pdf.addPage();
        y = 20;
      }
    };

    const drawLine = (lineY, r = 180, g = 180, b = 180) => {
      pdf.setDrawColor(r, g, b);
      pdf.line(14, lineY, 196, lineY);
    };

    // ── Title ──────────────────────────────────────────────
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text("SETTLEMENT REPORT", 14, 16);

    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(80);
    pdf.text(`Period : ${fromDate} to ${toDate}`, 14, 25);
    pdf.setTextColor(0);

    drawLine(30);
    y = 40;

    // ── Daily entries ──────────────────────────────────────
    Object.keys(groupedEntries)
      .sort()
      .forEach((date) => {
        checkNewPage(17);

        // Date heading
        pdf.setFontSize(15);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0);
        pdf.text(date, 14, y);
        y += 8;

        // Column headers
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(120);
        pdf.text("Vendor",  COL.vendor, y);
        pdf.text("Item",    COL.item,   y);
        pdf.text("Weight",  COL.weight, y);
        pdf.text("Rate",    COL.rate,   y);
        pdf.text("Amount",  COL.amount, y);
        pdf.setTextColor(0);
        y += 7;

        // Entry rows
        let dayTotal = 0;
        groupedEntries[date].forEach((entry) => {
          checkNewPage(9);
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "normal");
          pdf.text(String(entry.vendor),  COL.vendor, y);
          pdf.text(String(entry.item),    COL.item,   y);
          pdf.text(`${entry.weight} kg`,  COL.weight, y);
          pdf.text(`Rs.${entry.rate}`,    COL.rate,   y);
          pdf.text(`Rs.${entry.amount}`,  COL.amount, y);
          dayTotal += entry.amount;
          y += 9;
        });

        // Day Total inside each date block
        checkNewPage(9);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(30, 100, 200);
        pdf.text(`Day Total : Rs.${dayTotal}`, COL.vendor, y);
        pdf.setTextColor(0);
        y += 8;

        drawLine(y);
        y += 9;
      });

    // ── Daily Total — immediately after all dates ──────────
    checkNewPage(12);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0);
    pdf.text(`Daily Total : Rs.${dailyTotal}`, COL.vendor, y);
    y += 12;

    // ── Vendor Settlement Summary ────────────────────────
    y += 6;

    checkNewPage(18);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Vendor Settlement Summary", 14, y);
    y += 6;
    drawLine(y + 1, 0, 0, 0);
    y += 12;

    // Column headers
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(120);
    pdf.text("Vendor", 20, y);
    pdf.text("Total Amount", 185, y, { align: "right" });
    pdf.setTextColor(0);
    y += 8;

    // Vendor rows
    Object.entries(vendorTotals).forEach(([vendor, amount]) => {
      checkNewPage(9);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "normal");
      pdf.text(String(vendor),  20,  y);
      pdf.text(`Rs.${amount}`,  185, y, { align: "right" });
      y += 9;
    });

    y += 4;
    checkNewPage(20);
    drawLine(y);
    y += 8;

    // Vendor Total — after all vendors
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Vendor Total :", 20, y);
    pdf.text(`Rs.${vendorGrandTotal}`, 185, y, { align: "right" });

    pdf.save(`Settlement_Report_${fromDate}_to_${toDate}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold mb-6">Settlement Report</h1>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block mb-2 font-medium">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Preview Report</h2>

        {/* Date blocks — each with Day Total inside */}
        {Object.keys(groupedEntries)
          .sort()
          .map((date) => {
            const dayTotal = groupedEntries[date].reduce(
              (sum, entry) => sum + entry.amount,
              0
            );
            return (
              <div key={date} className="mb-6">
                <h3 className="text-xl font-bold mb-3">{date}</h3>

                <div className="overflow-x-auto">
                  <table
                    className="border-collapse"
                    style={{
                      width: "900px",
                      lineHeight: "1.8"
                    }}
                  >
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th style={{ width: "180px" }}>Vendor</th>
                        <th style={{ width: "220px" }}>Item</th>
                        <th style={{ width: "120px" }}>Weight</th>
                        <th style={{ width: "120px" }}>Rate</th>
                        <th style={{ width: "120px" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedEntries[date].map((entry) => (
                        <tr key={entry.id}>
                          <td>{entry.vendor}</td>
                          <td>{entry.item}</td>
                          <td>{entry.weight} kg</td>
                          <td>Rs.{entry.rate}</td>
                          <td>Rs.{entry.amount}</td>
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

        {/* Daily Total — immediately after all dates */}
        <div className="border-t-2 border-gray-400 mt-4 pt-4 mb-10">
          <h3 className="font-bold text-lg">
            Daily Total : ₹{dailyTotal}
          </h3>
        </div>

        {/* Vendor Settlement Summary */}
        <h2 className="text-2xl font-bold mb-4">Vendor Settlement Summary</h2>

        {Object.entries(vendorTotals).map(([vendor, amount]) => (
          <div key={vendor} className="flex justify-between mb-2">
            <span>{vendor}</span>
            <span>₹{amount}</span>
          </div>
        ))}

        {/* Vendor Total — after all vendors, no matched statement */}
        <div className="border-t mt-4 pt-4">
          <h3 className="font-bold">Vendor Total : ₹{vendorGrandTotal}</h3>
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

export default Reports;