import api from "./api";

const createShipment = (data) => {
  return api.post("/shipments", data);
};

const getShipmentById = (id) => {
  return api.get(`/shipments/${id}`);
};

export { createShipment, getShipmentById };