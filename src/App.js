import BusinessInfo from "./pages/BusinessInfo";
import "bootstrap/dist/css/bootstrap.min.css";
import BillReprint from "./pages/BillReprint";
import BillHistory from "./pages/BillHistory";
import { AuthPage } from "./pages/AuthPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GenerateInvoice from "./pages/GenerateInvoice";
import { Header } from "./pages/component/Header";

function App() {
  const links = [
    {
      label: "Generate Bill",
      route: "/generate-bill",
      component: <GenerateInvoice />,
      sidebar: true,
    },
    {
      label: "Register Business",
      route: "/register-business",
      component: <BusinessInfo />,
      sidebar: false,
    },
    {
      label: "Bill Reprint",
      route: "/bill/:invoiceNumber",
      component: <BillReprint />,
      sidebar: false,
    },
    {
      label: "Bill History",
      route: "/bill-history",
      component: <BillHistory />,
      sidebar: true,
    },
    {
      label: "Auth",
      route: "/auth",
      component: <AuthPage />,
      sidebar: false,
    },
  ];

  return (
    <div className="App">
      <Router>
        <Header tabs={links.filter((e) => e.sidebar === true)} user="" />
        <Routes>
          {links.map((link) => {
            return (
              <Route
                key={link.route}
                path={link.route}
                element={link.component}
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
