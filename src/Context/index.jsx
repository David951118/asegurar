import { createContext, useState, useEffect } from "react";

export const AsegurarContext = createContext();

export const AsegurarProvider = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 769);
  const [infoUser, setInfoUser] = useState({});

  const handleWhatsAppClick = (message) => {
    const phoneNumber = "573155870498";
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

    window.open(whatsappUrl, "_blank");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 769);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AsegurarContext.Provider
      value={{
        isDesktop,
        setIsDesktop,
        handleWhatsAppClick,
        infoUser,
        setInfoUser,
      }}
    >
      {children}
    </AsegurarContext.Provider>
  );
};
