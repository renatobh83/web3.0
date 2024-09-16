import axios from "axios";
import { RefreshToken } from "./login";
import backendErrors from "./erros";

import { toast } from "sonner";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  // baseURL: "https://app2.pluslive.online/",
  timeout: 20000,
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const handlerError = (err: any) => {
  const errorMsg = err?.response?.data?.error;

  let error = "Ocorreu um erro não identificado.";
  if (errorMsg) {
    if (backendErrors[errorMsg]) {
      error = backendErrors[errorMsg];
    } else {
      error = err.response.data.error;
    }
  }
};

service.interceptors.request.use(
  (config) => {
    const tokenAuth = JSON.parse(localStorage.getItem("token"));
    const token = `Bearer ${tokenAuth}`;
    if (token) {
      // config.headers['Authorization'] = 'Bearer ' + token
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    // handlerError(error)
    Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response) => {
    const res = response;
    const status = res.status;

    if (status.toString().substr(0, 1) !== "2") {
      handlerError(res);
      return Promise.reject("error");
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 403 && !error.config._retry) {
      error.config._retry = true;
      RefreshToken().then((res) => {
        if (res.data) {
          localStorage.setItem("token", JSON.stringify(res.data.token));
        }
      });
    }
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("profile");
      localStorage.removeItem("userId");
      if (error.config.url.indexOf("logout") === -1) {
        handlerError(error);
        // setTimeout(() => {
        //   Router.push({
        //     name: "login",
        //   });
        // }, 2000);
      }
    } else if (error.response && error.response.status === 500) {
      handlerError(error);
    } else if (error.message.indexOf("timeout") > -1) {
      toast.info(`Processando informações de estatisticas ${error.message}`);
    } else {
      handlerError(error);
    }
    return Promise.reject(error.response);
  }
);
export default service;
