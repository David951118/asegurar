import React from "react";
import BackgroundGradient from "../../Components/background";
import Footer from "../../Components/footer";
import imageDescription from "../../Assets/Foto Portada/1.jpg";
import { MDBAccordion, MDBAccordionItem } from "mdb-react-ui-kit";

export default function Legality() {
  let info = {
    title: "Legalidad",
    titleDescription:
      "Aqui podrás encontrar nuestras políticas de tratamiento de datos.",
  };
  const imageHeaderStyle = {
    height: "auto",
  };

  return (
    <div>
      <BackgroundGradient color1="#fff" color2="#fff">
        <div className="w-100">
          <div>
            <img
              src={imageDescription}
              alt="Quienes_somos"
              style={imageHeaderStyle}
              className="img-fluid"
            />
          </div>
          <div className="p-3 container justify-content-center">
            <div className="p-lg-5 mx-auto text-center row">
              <h1 className="display-3 fw-bold text-center">{info.title}</h1>
              <h3 className="fw-normal text-muted mb-3 text-center">
                {info.titleDescription}
              </h3>
            </div>
          </div>
          <div className="container">
            <MDBAccordion initialActive={1}>
              <MDBAccordionItem collapseId={1} headerTitle="Accordion Item #1">
                <strong>This is the first item's accordion body.</strong> It is
                shown by default, until the collapse plugin adds the appropriate
                classes that we use to style each element. These classes control
                the overall appearance, as well as the showing and hiding via
                CSS transitions. You can modify any of this with custom CSS or
                overriding our default variables. It's also worth noting that
                just about any HTML can go within the{" "}
                <code>.accordion-body</code>, though the transition does limit
                overflow.
              </MDBAccordionItem>
              <MDBAccordionItem collapseId={2} headerTitle="Accordion Item #2">
                <strong>This is the second item's accordion body.</strong> It is
                hidden by default, until the collapse plugin adds the
                appropriate classes that we use to style each element. These
                classes control the overall appearance, as well as the showing
                and hiding via CSS transitions. You can modify any of this with
                custom CSS or overriding our default variables. It's also worth
                noting that just about any HTML can go within the{" "}
                <code>.accordion-body</code>, though the transition does limit
                overflow.
              </MDBAccordionItem>
              <MDBAccordionItem collapseId={3} headerTitle="Accordion Item #3">
                <strong>This is the third item's accordion body.</strong> It is
                hidden by default, until the collapse plugin adds the
                appropriate classes that we use to style each element. These
                classes control the overall appearance, as well as the showing
                and hiding via CSS transitions. You can modify any of this with
                custom CSS or overriding our default variables. It's also worth
                noting that just about any HTML can go within the{" "}
                <code>.accordion-body</code>, though the transition does limit
                overflow.
              </MDBAccordionItem>
            </MDBAccordion>
          </div>
        </div>
      </BackgroundGradient>
      <Footer />
    </div>
  );
}
