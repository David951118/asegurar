import React, { useEffect } from "react";
import "./App.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useRoutes, BrowserRouter, useLocation } from "react-router-dom";
import { AsegurarProvider } from "./Context"; //Contexto de la aplicacion, sirve para tranferir info entre componentes
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
import Placas from "./Pages/Admin/placas";
import WhatsAppButton from "./Components/whatsapButon";
import Ubicacion from "./Pages/Ubicacion";
import UbicacionDetalle from "./Pages/Ubicacion/UbicacionDetalle";

const AppRoutes = () => {
  let routes = useRoutes([
    //aqui se realiza el enrutamiento de la aplicacion y la llamda de las vistas
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
    { path: "/admin/placas", element: <Placas /> },
    { path: "/ubicacion", element: <Ubicacion /> },
    { path: "/ubicacion/:coords", element: <UbicacionDetalle /> },
    { path: "/*", element: <OopsPage /> },
  ]);

  return routes;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Verificar si window y window.scrollTo están definidos
    if (typeof window !== "undefined" && window.scrollTo) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <AsegurarProvider>
      <BrowserRouter>
        <PrimeReactProvider>
          <ScrollToTop />
          <Navbar />
          <AppRoutes />
          <WhatsAppButton />
        </PrimeReactProvider>
      </BrowserRouter>
    </AsegurarProvider>
  );
};

export default App;
