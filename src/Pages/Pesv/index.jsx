import React from "react";
import Title from "../../Components/title";
import BackgroundGradient from "../../Components/background";

export default function PesvPage() {
  return (
    <BackgroundGradient color1="#ffffff" color2="#f0f2f5">
      <div className="container p-4">
        <Title item={{ title: "Pesv", level: "h1", color: "#333" }} />
        <p>Bienvenido a PESV</p>
      </div>
    </BackgroundGradient>
  );
}
