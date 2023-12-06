import React from "react";

const BackgroundGradient = ({ color1, color2, children }) => {
    const gradientStyle = {
        background: `linear-gradient(to top left, ${color1}, ${color2})`,
        width: "100%",
      };

  return (
    <div className="position-relative" style={gradientStyle}>
      {children}
    </div>
  );
};

export default BackgroundGradient;