import { API_URL } from "../config";

const NETWORK_ERROR = {
  data: null,
  error: {
    code: "ERR_CONNECTION_REFUSED",
    message: "Server connection failed.",
  },
};

/*
	Why NETWORK_ERROR in catch?
	The Promise returned from fetch() won't reject on HTTP error status even if the response is an HTTP 404 or 500. 
	Instead, as soon as the server responds with headers, the Promise will resolve normally (with the ok property 
	of the response set to false if the response isn't in the range 200–299), and it will only reject on network 
	failure or if anything prevented the request from completing.
*/

const api = {
  async get(url) {
    try {
      const response = await fetch(API_URL + url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseJSON = await response.json();
      if (!responseJSON.data && !responseJSON.error) {
        return { data: responseJSON };
      } else {
        return responseJSON;
      }
    } catch (err) {
      console.error("[API.GET]", err);
      return NETWORK_ERROR;
    }
  },
  async post(url, data) {
    try {
      const response = await fetch(API_URL + url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (err) {
      console.error("[API.POST]", err);
      return NETWORK_ERROR;
    }
  },
  async patch(url, data) {
    try {
      const response = await fetch(API_URL + url, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (err) {
      console.error("[API.PATCH]", err);
      return NETWORK_ERROR;
    }
  },
  async delete(url) {
    try {
      const response = await fetch(API_URL + url, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    } catch (err) {
      console.error("[API.DELETE]", err);
      return NETWORK_ERROR;
    }
  },
  // async postPhoto(url, photo, contentType) {
  //   const res = await axios.put(url, photo, {
  //     headers: {
  //       "Content-Type": contentType,
  //     },
  //   });
  //   return { data: res.data };
  // },
};

export { api };
