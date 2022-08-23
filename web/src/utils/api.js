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
  async post(url, data) {
    const res = await axios.post(API_URL + url, data, {
      withCredentials: true,
    });
    return { data: res.data };
  },
  async patch(url, data) {
    try {
      const res = await axios.patch(API_URL + url, data, {
        withCredentials: true,
      });
      return { data: res.data, ok: true };
    } catch (err) {
      return { data: err.response.data, ok: false };
    }
  },
  async postPhoto(url, photo, contentType) {
    const res = await axios.put(url, photo, {
      headers: {
        "Content-Type": contentType,
      },
    });
    return { data: res.data };
  },
};

export { api };
