import Axios, { AxiosRequestConfig } from "axios";

const Http = Axios.create({
  baseURL: import.meta.env.VITE_IVAO_API_BASE_URL,
});

Http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.data?.message)
      return Promise.reject(new Error(error.response.data.message));

    return Promise.reject(error);
  }
);

type HttpInterface = <T>(config: AxiosRequestConfig) => Promise<T>;

export type HttpEntity = { [key: string]: any }

export default Http as HttpInterface;
