import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";

import Purchases from "./pages/purchases";
import Customers from "./pages/customers";
import CustomerDashboard from "./pages/customerDashboard";

import AddEntry from "./pages/AddEntry";
import VendorSummary from "./pages/VendorSummary";
import WeeklySummary from "./pages/WeeklySummary";
import Reports from "./pages/Reports";

import SatyavammaAddEntry from "./pages/SatyavammaAddEntry";
import SatyavammaWeeklySummary from "./pages/SatyavammaWeeklySummary";
import SatyavammaReports from "./pages/SatyavammaReports";

// import AddCustomer from "./pages/AddCustomer";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Purchases */}

        <Route
          path="/purchases"
          element={<Purchases />}
        />

        <Route
          path="/add-entry"
          element={<AddEntry />}
        />

        <Route
          path="/vendor-summary"
          element={<VendorSummary />}
        />

        <Route
          path="/weekly-summary"
          element={<WeeklySummary />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        {/* Customers */}

        <Route
          path="/customers"
          element={<Customers />}
        />

        <Route
          path="/customer/satyavamma"
          element={<CustomerDashboard />}
        />

        {/* Satyavamma */}

        <Route
          path="/satyavamma/add-entry"
          element={<SatyavammaAddEntry />}
        />

        <Route
          path="/satyavamma/weekly-summary"
          element={<SatyavammaWeeklySummary />}
        />

        <Route
          path="/satyavamma/reports"
          element={<SatyavammaReports />}
        />

 


      </Routes>
    </BrowserRouter>
  );
}

export default App;