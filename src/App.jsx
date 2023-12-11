import React, { useEffect } from "react";
import "./App.css";
import { useRoutes, BrowserRouter, useLocation } from "react-router-dom";
import { AsegurarProvider } from "./Context";
import Home from "../src/Pages/Home";
import AboutUs from "./Pages/AboutUs";
import Contact from "./Pages/Contact";
import Services from "./Pages/Services";
import Blog from "./Pages/Blog";
import Legality from "./Pages/Legality";
import LogCelvi from "./Pages/LogCelvi";
import Pse from "./Pages/Pse";
import Navbar from "./Pages/Navbar";
import AdminDashboard from "./Pages/Admin";
import AdminLogin from "./Pages/Admin/login";
import Adminusers from "./Pages/Admin/usuarios";
import OopsPage from "./Pages/oops";
import WhatsAppButton from "./Components/whatsapButon";

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home />, exact: true },
    { path: "/acercadenosotros", element: <AboutUs /> },
    { path: "/contacto", element: <Contact /> },
    { path: "/servicios", element: <Services /> },
    { path: "/blog", element: <Blog /> },
    { path: "/legalidad", element: <Legality /> },
    { path: "/cellvi", element: <LogCelvi /> },
    { path: "/portaldepagos", element: <Pse /> },
    { path: "/admin-login", element: <AdminLogin /> },
    { path: "/admin", element: <AdminDashboard /> },
    { path: "/admin/users", element: <Adminusers /> },
    { path: "/*", element: <OopsPage /> },
  ]);

  return routes;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Verificar si window y window.scrollTo están definidos
    if (typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <AsegurarProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <AppRoutes />
        <WhatsAppButton />
      </BrowserRouter>
    </AsegurarProvider>
  );
};

export default App;
