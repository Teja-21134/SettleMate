import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-4xl font-bold text-green-600">
            SettleMate
          </h1>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("settlemateToken");
              localStorage.removeItem("loggedInUser");
              navigate("/");
            }}
            className="rounded-lg bg-white px-4 py-2 text-gray-700 shadow hover:bg-gray-50"
          >
            Log out
          </button>
        </div>

        <p className="text-gray-600 mb-8">
          Vendor & Customer Settlement Management System
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div
            onClick={() => navigate("/purchases")}
            className="bg-white rounded-xl shadow p-10 cursor-pointer hover:shadow-xl transition"
          >
            <h2 className="text-3xl font-semibold mb-3">
              Purchases
            </h2>

            <p className="text-gray-500">
              Manage purchase entries and reports.
            </p>
          </div>

          <div
            onClick={() => navigate("/customers")}
            className="bg-white rounded-xl shadow p-10 cursor-pointer hover:shadow-xl transition"
          >
            <h2 className="text-3xl font-semibold mb-3">
              Customers
            </h2>

            <p className="text-gray-500">
              Manage customer sales and reports.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;