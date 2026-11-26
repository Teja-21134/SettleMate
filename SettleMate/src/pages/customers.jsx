import { useNavigate } from "react-router-dom";

function Customers() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-2 text-green-600">
          Customers
        </h1>

        <p className="text-gray-600 mb-8">
          Manage customer accounts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div
            onClick={() => navigate("/customer/satyavamma")}
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-2">
              Satyavamma
            </h2>

            <p className="text-gray-500">
              Open customer dashboard.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-2">
              + Add Customer
            </h2>

            <p className="text-gray-500">
              Coming Soon
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Customers;  