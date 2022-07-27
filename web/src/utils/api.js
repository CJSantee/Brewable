import axios from "axios";
import { API_URL } from "../config";
import { authHeaders } from "./auth";

const api = {
  get(url, data_callback, headers_callback) {
    axios
      .get(API_URL + url, authHeaders())
      .then((res) => {
        data_callback(res.data);
        headers_callback && headers_callback(res.headers);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  post(url, data, callback) {
    axios
      .post(API_URL + url, data, authHeaders())
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  patch(url, data, callback) {
    axios
      .patch(API_URL + url, data, authHeaders())
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  delete(url, callback, data) {
    axios
      .delete(API_URL + url, { ...authHeaders(), data: data })
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

export { api };
