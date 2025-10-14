import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://http://127.0.0.1:8000'
});

class ApiService {
  async get(url, config = {}) {
    return axiosInstance.get(url, config);
  }

  async post(url, data, config = {}) {
    return axiosInstance.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return axiosInstance.put(url, data, config);
  }

  async delete(url, config = {}) {
    return axiosInstance.delete(url, config);
  }
}

export default new ApiService();