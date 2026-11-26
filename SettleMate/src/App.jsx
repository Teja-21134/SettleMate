import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

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

function RequireAuth() {
  return sessionStorage.getItem("settlemateToken") ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/add-entry" element={<AddEntry />} />
          <Route path="/vendor-summary" element={<VendorSummary />} />
          <Route path="/weekly-summary" element={<WeeklySummary />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/customers" element={<Customers />} />
          <Route
            path="/customer/satyavamma"
            element={<CustomerDashboard />}
          />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;