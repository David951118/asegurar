import React, { createContext, useState, useContext, useCallback } from "react";
import RndcService from "../Services/rndcApi";

const InventarioAuthContext = createContext();

export const InventarioAuthProvider = ({ children }) => {
  const [isInventarioAuth, setIsInventarioAuth] = useState(
    !!localStorage.getItem("inv_token")
  );

  const loginInventario = useCallback(async (username, password) => {
    const result = await RndcService.login(username, password);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const hasAdminRole = result.roles && result.roles.includes("ROLE_ADMIN");
    if (!hasAdminRole) {
      // Limpiar token que guardó RndcService ya que no tiene el rol
      localStorage.removeItem("rndc_token");
      localStorage.removeItem("rndc_user");
      localStorage.removeItem("rndc_token_expires");
      return {
        success: false,
        error: "Acceso restringido. Solo administradores pueden ingresar.",
      };
    }

    // Guardar copia bajo claves propias del inventario
    localStorage.setItem("inv_token", result.token);
    localStorage.setItem(
      "inv_user",
      JSON.stringify({ username: result.username, persona: result.persona, roles: result.roles })
    );

    setIsInventarioAuth(true);
    return { success: true };
  }, []);

  const logoutInventario = useCallback(() => {
    localStorage.removeItem("inv_token");
    localStorage.removeItem("inv_user");
    setIsInventarioAuth(false);
  }, []);

  return (
    <InventarioAuthContext.Provider
      value={{ isInventarioAuth, loginInventario, logoutInventario }}
    >
      {children}
    </InventarioAuthContext.Provider>
  );
};

export const useInventarioAuth = () => useContext(InventarioAuthContext);
