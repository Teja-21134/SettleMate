import { useNavigate } from "react-router-dom";

function CustomerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-2 text-green-600">
          Satyavamma
        </h1>

        <p className="text-gray-600 mb-8">
          Customer Sales Management
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div
            onClick={() =>
              navigate("/satyavamma/add-entry")
            }
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-2">
              Add Entry
            </h2>
          </div>

          <div
            onClick={() =>
              navigate("/satyavamma/weekly-summary")
            }
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-2">
              Weekly Summary
            </h2>
          </div>

          <div
            onClick={() =>
              navigate("/satyavamma/reports")
            }
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-2">
              Reports
            </h2>
          </div>

        </div>

      </div>
    </div>
  );
}

export default CustomerDashboard;