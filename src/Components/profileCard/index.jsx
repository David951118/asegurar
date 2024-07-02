import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";

// export default function ProfileCard({ cards }) {
//   const [flippedCards, setFlippedCards] = useState(cards.map(() => false));

//   const handleFlip = (index) => {
//     setFlippedCards((prevFlippedCards) => {
//       const newFlippedCards = [...prevFlippedCards];
//       newFlippedCards[index] = !newFlippedCards[index];
//       return newFlippedCards;
//     });
//   };

//   const handleEmailClick = (email) => {
//     window.location.href = `mailto:${email}`;
//   };

//   return (
//     <div className="body--card-profile">
//       <div className="container-fuild">
//         <div className="row justify-content-center mx-auto pt-4">
//           {cards.slice(0, 4).map((card, index) => (
//             <label
//               key={index}
//               id={card.name}
//               className="col-md-3 text-center justify-content-center"
//             >
//               <div
//                 className={`profile--card ${
//                   flippedCards[index] ? "flipped" : ""
//                 }`}
//               >
//                 <div className="profile--card-inner">
//                   <div
//                     className="profile--card-front custom-pointer"
//                     onClick={() => handleFlip(index)}
//                   >
//                     <header>
//                       <img src={card.foto} alt={card.name} />
//                     </header>
//                     <p className="h2 p--profile">{card.name}</p>
//                     <p className="h3 p--profile ">{card.cargo}</p>
//                     <div className="flip-arrow--front">
//                       <div className="flip-arrow custom-pointer">
//                         <FontAwesomeIcon icon={faArrowAltCircleRight} />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="profile--card-back text-center">
//                     <header>
//                       <p className="h2 p--profile">Acerca de mi</p>
//                     </header>
//                     <p className="h5 p--profile">{card.descript}</p>
//                     <p
//                       className="h6 custom-pointer"
//                       onClick={() => handleEmailClick(card.email)}
//                     >
//                       {card.email}
//                     </p>
//                     <div className="flip-arrow--back">
//                       <div
//                         className="flip-arrow custom-pointer"
//                         onClick={() => handleFlip(index)}
//                       >
//                         <FontAwesomeIcon icon={faArrowAltCircleLeft} />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </label>
//           ))}
//         </div>
//         <div className="row justify-content-center mx-auto">
//           {cards.slice(4, 8).map((card, index) => (
//             <label
//               key={index}
//               id={card.name}
//               className="col-md-3 text-center justify-content-center"
//             >
//               <div
//                 className={`profile--card ${
//                   flippedCards[index + 4] ? "flipped" : ""
//                 }`}
//               >
//                 <div className="profile--card-inner">
//                   <div
//                     className="profile--card-front custom-pointer"
//                     onClick={() => handleFlip(index + 4)}
//                   >
//                     <header>
//                       <img src={card.foto} alt={card.name} />
//                     </header>
//                     <p className="h2 p--profile">{card.name}</p>
//                     <p className="h3 p--profile ">{card.cargo}</p>
//                     <div className="flip-arrow--front">
//                       <div className="flip-arrow custom-pointer">
//                         <FontAwesomeIcon icon={faArrowAltCircleRight} />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="profile--card-back text-center">
//                     <header>
//                       <p className="h2 p--profile">Acerca de mi</p>
//                     </header>
//                     <p className="h5 p--profile">{card.descript}</p>
//                     <p
//                       className="h6 custom-pointer"
//                       onClick={() => handleEmailClick(card.email)}
//                     >
//                       {card.email}
//                     </p>
//                     <div className="flip-arrow--back">
//                       <div
//                         className="flip-arrow custom-pointer"
//                         onClick={() => handleFlip(index + 4)}
//                       >
//                         <FontAwesomeIcon icon={faArrowAltCircleLeft} />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </label>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
export default function ProfileCard({ cards }) {
  const [flippedCards, setFlippedCards] = useState(cards.map(() => false));

  const handleFlip = (index) => {
    setFlippedCards((prevFlippedCards) => {
      const newFlippedCards = [...prevFlippedCards];
      newFlippedCards[index] = !newFlippedCards[index];
      return newFlippedCards;
    });
  };

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="body--card-profile continer-lg">
      <div className="row justify-content-center mx-auto pt-4">
        {cards.slice(0, 3).map((card, index) => (
          <label
            key={index}
            id={card.name}
            className="col-md-4 text-center justify-content-center"
          >
            <div
              className={`profile--card ${
                flippedCards[index] ? "flipped" : ""
              }`}
            >
              <div className="profile--card-inner">
                <div
                  className="profile--card-front custom-pointer"
                  onClick={() => handleFlip(index)}
                >
                  <header>
                    <img src={card.foto} alt={card.name} />
                  </header>
                  <p className="h2 p--profile">{card.name}</p>
                  <p className="h3 p--profile ">{card.cargo}</p>
                  <div className="flip-arrow--front">
                    <div className="flip-arrow custom-pointer">
                      <FontAwesomeIcon icon={faArrowAltCircleRight} />
                    </div>
                  </div>
                </div>
                <div className="profile--card-back text-center">
                  <header>
                    <p className="h2 p--profile">Acerca de mi</p>
                  </header>
                  <p className="h5 p--profile">{card.descript}</p>
                  <p
                    className="h6 custom-pointer"
                    onClick={() => handleEmailClick(card.email)}
                  >
                    {card.email}
                  </p>
                  <div className="flip-arrow--back">
                    <div
                      className="flip-arrow custom-pointer"
                      onClick={() => handleFlip(index)}
                    >
                      <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
      <div className="row justify-content-center mx-auto">
        {cards.slice(3, 6).map((card, index) => (
          <label
            key={index}
            id={card.name}
            className="col-md-4 text-center justify-content-center"
          >
            <div
              className={`profile--card ${
                flippedCards[index + 3] ? "flipped" : ""
              }`}
            >
              <div className="profile--card-inner">
                <div
                  className="profile--card-front custom-pointer"
                  onClick={() => handleFlip(index + 3)}
                >
                  <header>
                    <img src={card.foto} alt={card.name} />
                  </header>
                  <p className="h2 p--profile">{card.name}</p>
                  <p className="h3 p--profile ">{card.cargo}</p>
                  <div className="flip-arrow--front">
                    <div className="flip-arrow custom-pointer">
                      <FontAwesomeIcon icon={faArrowAltCircleRight} />
                    </div>
                  </div>
                </div>
                <div className="profile--card-back text-center m-3">
                  <header>
                    <p className="h2 p--profile">Acerca de mi</p>
                  </header>
                  <p className="h5 p--profile">{card.descript}</p>
                  <p
                    className="h6 custom-pointer"
                    onClick={() => handleEmailClick(card.email)}
                  >
                    {card.email}
                  </p>
                  <div className="flip-arrow--back">
                    <div
                      className="flip-arrow custom-pointer"
                      onClick={() => handleFlip(index + 3)}
                    >
                      <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
      <div className="row justify-content-center mx-auto">
        {cards.slice(6, 9).map((card, index) => (
          <label
            key={index}
            id={card.name}
            className="col-md-4 text-center justify-content-center"
          >
            <div
              className={`profile--card ${
                flippedCards[index + 6] ? "flipped" : ""
              }`}
            >
              <div className="profile--card-inner">
                <div
                  className="profile--card-front custom-pointer"
                  onClick={() => handleFlip(index + 6)}
                >
                  <header>
                    <img src={card.foto} alt={card.name} />
                  </header>
                  <p className="h2 p--profile">{card.name}</p>
                  <p className="h3 p--profile ">{card.cargo}</p>
                  <div className="flip-arrow--front">
                    <div className="flip-arrow custom-pointer">
                      <FontAwesomeIcon icon={faArrowAltCircleRight} />
                    </div>
                  </div>
                </div>
                <div className="profile--card-back text-center">
                  <header>
                    <p className="h2 p--profile">Acerca de mi</p>
                  </header>
                  <p className="h5 p--profile">{card.descript}</p>
                  <p
                    className="h6 custom-pointer"
                    onClick={() => handleEmailClick(card.email)}
                  >
                    {card.email}
                  </p>
                  <div className="flip-arrow--back">
                    <div
                      className="flip-arrow custom-pointer"
                      onClick={() => handleFlip(index + 6)}
                    >
                      <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
