import api from "./api";

const getUserProfile = () => {
  return api.get("/users/profile");
};

export { getUserProfile };