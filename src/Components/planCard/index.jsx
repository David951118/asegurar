import React, {useContext} from "react";
import { AsegurarContext } from "../../Context";

const PlanCard = ({ title, description, image, mensaje }) => {
  const { handleWhatsAppClick } = useContext(AsegurarContext);  
  return (
    <div className="card mb-3 mx-auto" style={{ maxWidth: '540px' }}>
      <div className="row g-0">
        <div className="col-md-4">
          <img src={image} alt={title} className="img-fluid rounded-start" style={{ height: '100%' }} />
        </div>
        <div className="col-md-8 text-center">
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">
              {description}
            </p>
            <button className="btn btn-primary" onClick={() => handleWhatsAppClick(mensaje)}>Quiero saber mas</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;