import api from "./api";

const getAllRelayPoints = () => {
  return api.get("/relay-points");
};

export { getAllRelayPoints };