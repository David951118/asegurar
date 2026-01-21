import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import RndcService from "../Services/rndcApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("rndc_token"),
  );
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  const logout = useCallback(async () => {
    await RndcService.logout();
    setIsAuthenticated(false);
    setShowRenewalModal(false);
    window.location.href = "/"; // Redirigir a home o login
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const renewSession = async () => {
    try {
      await RndcService.refreshToken();
      setShowRenewalModal(false);
    } catch (error) {
      console.error("Error renovando sesión", error);
      logout();
    }
  };

  // Verificar estado del token periódicamente
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkToken = () => {
      const expiresAtStr = localStorage.getItem("rndc_token_expires");
      if (!expiresAtStr) return;

      const expiresAt = new Date(expiresAtStr).getTime();
      const now = Date.now();
      const timeRemaining = expiresAt - now;

      // Si quedan menos de 5 minutos (300000ms), mostrar alerta
      if (timeRemaining < 300000 && timeRemaining > 0) {
        if (!showRenewalModal) {
          setShowRenewalModal(true);
        }
      }
      // Si ya expiró
      else if (timeRemaining <= 0) {
        logout();
      }
    };

    const interval = setInterval(checkToken, 60000); // Check cada minuto
    checkToken(); // Check inmediato

    return () => clearInterval(interval);
  }, [isAuthenticated, showRenewalModal, logout]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, showRenewalModal, renewSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
