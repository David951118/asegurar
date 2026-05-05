import React, { useEffect } from "react";
import "./App.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useRoutes, BrowserRouter, useLocation } from "react-router-dom";
import { AsegurarProvider } from "./Context"; //Contexto de la aplicacion, sirve para tranferir info entre componentes
import { AuthProvider } from "./Context/AuthContext";
import { InventarioAuthProvider } from "./Context/InventarioAuthContext";
import { ThemeProvider } from "./Context/ThemeContext";
import Home from "../src/Pages/Home";
import AboutUs from "./Pages/AboutUs";
import Contact from "./Pages/Contact";
import Services from "./Pages/Services";
import Blog from "./Pages/Blog";
import Legality from "./Pages/Legality";
import LogCelvi from "./Pages/LogCelvi";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import Pse from "./Pages/Pse";
import Rndc from "./Pages/Rndc";
import DashboardRndc from "./Pages/Rndc/Dashboard";
import Pesv from "./Pages/Pesv/index";
import Login from "./Components/PSEform/login";
import Portal from "./Pages/Pse/Portal";
import Navbar from "./Pages/Navbar";
import Footer from "./Components/footer";
import OopsPage from "./Pages/oops";
import WhatsAppButton from "./Components/whatsapButon";
import Ubicacion from "./Pages/Ubicacion";
import UbicacionDetalle from "./Pages/Ubicacion/UbicacionDetalle";
import AdminDashboard from "./Pages/Admin";
import AdminLogin from "./Pages/Admin/login";
import Adminusers from "./Pages/Admin/usuarios";
import Placas from "./Pages/Admin/placas";
import RecoveryPortal from "./Pages/Admin/RecoveryPortal";
import ChangePassword from "./Pages/Admin/ChangePasswrod";
import PrivateRoute from "./Components/privateRoute";
import SessionTimeoutModal from "./Components/SessionTimeoutModal";
import InventarioLogin from "./Pages/Inventario";
import InventarioDashboard from "./Pages/Inventario/Dashboard";
import ActividadesList from "./Pages/Inventario/Actividades";
import ActividadForm from "./Pages/Inventario/ActividadForm";
import ActividadDetalle from "./Pages/Inventario/ActividadDetalle";
import Devueltos from "./Pages/Inventario/Devueltos";
import Equipos from "./Pages/Inventario/Equipos";
import EquipoForm from "./Pages/Inventario/EquipoForm";
import EquipoDetalle from "./Pages/Inventario/EquipoDetalle";
import InventarioCentral from "./Pages/Inventario/InventarioCentral";
import TrasladoEquipos from "./Pages/Inventario/TrasladoEquipos";
import MarcasModelos from "./Pages/Inventario/catalogos/MarcasModelos";
import Ciudades from "./Pages/Inventario/catalogos/Ciudades";
import Tecnicos from "./Pages/Inventario/catalogos/Tecnicos";
import ReporteGeneral from "./Pages/Inventario/reportes/General";
import Movimientos from "./Pages/Inventario/reportes/Movimientos";
import InventarioPorCiudad from "./Pages/Inventario/reportes/InventarioPorCiudad";

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/acercadenosotros", element: <AboutUs /> },
    { path: "/contacto", element: <Contact /> },
    { path: "/servicios", element: <Services /> },
    { path: "/blog", element: <Blog /> },
    { path: "/legalidad", element: <Legality /> },
    { path: "/cellvi", element: <LogCelvi /> },
    { path: "/portaldepagos", element: <Pse /> },
    // { path: "/portaldepagos/wompi", element: <Login /> },
    // { path: "/portaldepagos/wompi/portal", element: <Portal /> },
    // { path: "/admin-login", element: <AdminLogin /> },
    // { path: "/recuperar-contrasena", element: <RecoveryPortal /> },
    // { path: "/cambiar-contrasena", element: <ChangePassword /> },
    // { path: "/admin", element: <PrivateRoute element={<AdminDashboard />} /> },
    // {
    //   path: "/admin/users",
    //   element: <PrivateRoute element={<Adminusers />} />,
    // },
    // { path: "/admin/placas", element: <PrivateRoute element={<Placas />} /> },
    { path: "/ubicacion", element: <Ubicacion /> },
    { path: "/ubicacion/:coords", element: <UbicacionDetalle /> },
    { path: "/politica-de-privacidad", element: <PrivacyPolicy /> },
    { path: "/rndc", element: <Rndc /> },
    { path: "/rndc/dashboard", element: <DashboardRndc /> },
    { path: "/pesv", element: <Pesv /> },
    { path: "/inventario", element: <InventarioLogin /> },
    { path: "/inventario/dashboard", element: <InventarioDashboard /> },
    { path: "/inventario/equipos", element: <Equipos /> },
    { path: "/inventario/equipos/nuevo", element: <EquipoForm /> },
    { path: "/inventario/equipos/inventario-central", element: <InventarioCentral /> },
    { path: "/inventario/equipos/traslado", element: <TrasladoEquipos /> },
    { path: "/inventario/equipos/:id", element: <EquipoDetalle /> },
    { path: "/inventario/equipos/:id/editar", element: <EquipoForm /> },
    { path: "/inventario/actividades", element: <ActividadesList /> },
    { path: "/inventario/actividades/nueva", element: <ActividadForm /> },
    { path: "/inventario/actividades/:id", element: <ActividadDetalle /> },
    { path: "/inventario/catalogos/marcas-modelos", element: <MarcasModelos /> },
    { path: "/inventario/catalogos/ciudades", element: <Ciudades /> },
    { path: "/inventario/catalogos/tecnicos", element: <Tecnicos /> },
    { path: "/inventario/reportes/general", element: <ReporteGeneral /> },
    { path: "/inventario/reportes/movimientos", element: <Movimientos /> },
    { path: "/inventario/reportes/inventario-por-ciudad", element: <InventarioPorCiudad /> },
    { path: "/inventario/devueltos", element: <Devueltos /> },
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
    <ThemeProvider>
    <AsegurarProvider>
      <AuthProvider>
      <InventarioAuthProvider>
        <BrowserRouter>
          <PrimeReactProvider>
            <ScrollToTop />
            <Navbar />
            <AppRoutes />
            <SessionTimeoutModal />
            <Footer />
            <WhatsAppButton />
          </PrimeReactProvider>
        </BrowserRouter>
      </InventarioAuthProvider>
      </AuthProvider>
    </AsegurarProvider>
    </ThemeProvider>
  );
};

export default App;
