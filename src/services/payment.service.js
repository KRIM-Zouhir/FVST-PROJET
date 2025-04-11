import api from "./api";

const createPayment = (data) => {
  return api.post("/payments", data);
};

export { createPayment };