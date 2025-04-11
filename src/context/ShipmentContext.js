import React, { createContext, useState } from "react";

const ShipmentContext = createContext();

const ShipmentProvider = ({ children }) => {
  const [shipments, setShipments] = useState([]);

  const addShipment = (shipment) => {
    setShipments([...shipments, shipment]);
  };

  return (
    <ShipmentContext.Provider value={{ shipments, addShipment }}>
      {children}
    </ShipmentContext.Provider>
  );
};

export { ShipmentContext, ShipmentProvider };