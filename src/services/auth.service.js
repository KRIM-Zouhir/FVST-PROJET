import api from "./api";

const register = (email, password, firstName, lastName, phone, role) => {
  return api.post("/auth/signup", {
    email,
    password,
    first_name: firstName,
    last_name: lastName,
    phone,
    role,
  });
};

const login = (email, password) => {
  return api.post("/auth/signin", {
    email,
    password,
  });
};

export { register, login };