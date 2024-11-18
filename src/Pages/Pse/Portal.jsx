import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { useLocation } from "react-router-dom";
import PagoWompi from "../../Components/pagoWompi";
import { format } from "date-fns";

const Portal = () => {
  const location = useLocation();
  const user = location.state?.user;
  const [pagos, setPagos] = useState([]);
  const [pagosPendientes, setPagosPendientes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPagos, setSelectedPagos] = useState([]);
  const [showPagoWompi, setShowPagoWompi] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    obtenerListaPagos();
  }, [token]);

 const obtenerListaPagos = async () => {
   try {
     const response = await fetch(
       `http://localhost:4000/api/v1/pagos/byCedula/${user[0].idCard}`,
       {
         method: "GET",
         headers: {
           Authorization: `Bearer ${token}`,
         },
       }
     );

     if (response.ok) {
       const data = await response.json();
       const fechaActual = new Date();
       const mesActual = fechaActual.getMonth();
       const añoActual = fechaActual.getFullYear();

       // Crear listas separadas para pagos pendientes y atrasados
       const pagosPendientes = [];
       const pagosAtrasados = [];

       data.forEach((pago) => {
         console.log(pago)
         const fechaCorte = new Date(pago.fechaCorte);
         const fechaPago = pago.fechaPago;
         const placa = pago.plate.plate;

         // Revisar si el pago es atrasado
         if (!fechaPago && fechaCorte < fechaActual) {
           pagosAtrasados.push({
             ...pago,
             estado: "Atrasado",
           });
         }
         // Revisar si el pago es pendiente del mes actual
         else if (
           !fechaPago &&
           fechaCorte.getMonth() === mesActual &&
           fechaCorte.getFullYear() === añoActual
         ) {
           pagosPendientes.push({
             ...pago,
             estado: "Pendiente",
           });
         }
       });

       // Guardar los pagos pendientes y atrasados en el estado
       setPagos([...pagosPendientes, ...pagosAtrasados]);
     } else if (response.status === 401) {
       setErrorMessage("Sin pagos pendientes.");
     } else {
       console.error("Error en la autenticación, código:", response.status);
       setErrorMessage("Error en la autenticación.");
     }
   } catch (error) {
     console.error("Error:", error);
     setErrorMessage("Hubo un error con la solicitud.");
   }
 };

  const iniciarPago = async () => {
    try {
      const total = calcularTotal();
      const response = await fetch(
        "http://localhost:4000/api/v1/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerId: user[0].id,
            totalAmount: total,
            pagos: selectedPagos.map((pago) => ({
              pagoId: pago.id, // Cambiamos "id" por "pagoId"
            })),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        handlePago(total, data.referenceCode, data.integritySignature);
      } else {
        console.error("Error al iniciar el pago:", response.status);
        setErrorMessage("Error al iniciar el pago.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setErrorMessage("Hubo un error al iniciar el pago.");
    }
  };

  const handlePago = (amount_in_cents, reference, signatureIntegrity) => {
    // Actualiza el estado con los datos de pago
    setPaymentData({
      total: amount_in_cents,
      reference,
      signatureIntegrity,
    });

    // Muestra el componente de pago
    setShowPagoWompi(true);
  };

  const calcularNumeroCuota = (fechaCorte, pagos, placa) => {
    // Filtra los pagos de la placa específica y los ordena por fecha de corte
    const pagosDePlaca = pagos
      .filter((pago) => pago.placa === placa)
      .sort((a, b) => new Date(a.fechaCorte) - new Date(b.fechaCorte));

    // Encuentra la posición del pago actual en la lista ordenada de pagos de la placa
    const index = pagosDePlaca.findIndex(
      (pago) =>
        new Date(pago.fechaCorte).getTime() === new Date(fechaCorte).getTime()
    );

    // El número de cuota es el índice + 1 (ya que es base 0) de la lista de pagos de la placa
    const numeroCuota = index + 1;
    const totalCuotas = pagosDePlaca.length;

    return `Cuota ${numeroCuota} de ${totalCuotas}`;
  };

  // Calcula el total de los pagos seleccionados
  const calcularTotal = () => {
    return selectedPagos.reduce((acc, pago) => acc + pago.valor, 0);
  };

  // Columna personalizada para mostrar el estado del pago
  const estadoPagoTemplate = (rowData) => {
    const fechaCorte = new Date(rowData.fechaCorte);
    const fechaActual = new Date();
    return fechaCorte < fechaActual ? "Pago Atrasado" : "Pago Próximo";
  };

  return (
    <div className="container-md mt-5 border">
      <div className="text-center">
        <p className="h2 p-4">Bienvenido {user[0].name}</p>
        <p className="h5">
          Selecciona los pagos que deseas efectuar. Solo aparecerán los pagos
          pendientes y atrasados.
        </p>
      </div>
      <div className="card">
        <h3 className="">Pagos Pendientes</h3>
        <DataTable
          value={pagos}
          selection={selectedPagos}
          onSelectionChange={(e) => setSelectedPagos(e.value)}
          dataKey="id"
          paginator
          rows={5}
          responsiveLayout="scroll"
        >
          <Column field="plate.plate" header="Placa" />
          <Column
            field="cuota"
            header="Cuota"
            body={(rowData) =>
              calcularNumeroCuota(rowData.fechaCorte, pagos, rowData.placa)
            }
          />
          <Column field="valor" header="Valor" />
          <Column
            field="fechaCorte"
            header="Fecha Corte"
            body={(rowData) =>
              format(new Date(rowData.fechaCorte), "dd-MM-yyyy")
            }
          />
          <Column header="Estado" body={estadoPagoTemplate} />
          <Column
            header=""
            field="Seleccionar"
            selectionMode="multiple"
            headerStyle={{ width: "3em" }}
          />
        </DataTable>
        <div className="m-4 row flex">
          <div className="col-md-8">
            <h4>Total a Pagar: ${calcularTotal()}</h4>
          </div>

          <div className="col-md-4" onClick={iniciarPago}>
            <button className="waybox-button">
              Paga con
              <strong> Wompi</strong>
            </button>
          </div>
        </div>
      </div>
      {showPagoWompi && (
        <PagoWompi
          total={paymentData.total}
          reference={paymentData.reference}
          signatureIntegrity={paymentData.signatureIntegrity}
        />
      )}
    </div>
  );
};

export default Portal;
