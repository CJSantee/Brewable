import axios from "axios";
import { API_URL } from "../config";

const api = {
  async get(url) {
    const res = await axios.get(API_URL + url, {
      withCredentials: true,
    });
    const { data } = res;
    let alerts = [];
    let errors = [];
    return { data, alerts, errors };
  },
  post(url, data, callback) {
    axios
      .post(API_URL + url, data)
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  patch(url, data, callback) {
    axios
      .patch(API_URL + url, data)
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  delete(url, callback, data) {
    axios
      .delete(API_URL + url, { data })
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

export { api };
