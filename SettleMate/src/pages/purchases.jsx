import { useNavigate } from "react-router-dom";

function Purchases() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-2 text-green-600">
          Purchases
        </h1>

        <p className="text-gray-600 mb-8">
          Manage purchase entries and reports.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div
            onClick={() => navigate("/add-entry")}
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-2">
              Add Entry
            </h2>

            <p className="text-gray-500">
              Add daily purchase entries.
            </p>
          </div>

          <div
            onClick={() => navigate("/vendor-summary")}
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-2">
              Vendor Summary
            </h2>

            <p className="text-gray-500">
              View vendor-wise details.
            </p>
          </div>

          <div
            onClick={() => navigate("/weekly-summary")}
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-2">
              Weekly Summary
            </h2>

            <p className="text-gray-500">
              View purchases between dates.
            </p>
          </div>

          <div
            onClick={() => navigate("/reports")}
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-2">
              Reports
            </h2>

            <p className="text-gray-500">
              Preview settlement reports.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Purchases;