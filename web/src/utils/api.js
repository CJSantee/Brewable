import { API_URL } from "../config";

const NETWORK_ERROR = {
  data: null,
  error: {
    code: "ERR_CONNECTION_REFUSED",
    message: "Server connection failed.",
  },
  success: false,
};

/*
	Why NETWORK_ERROR in catch?
	The Promise returned from fetch() won't reject on HTTP error status even if the response is an HTTP 404 or 500. 
	Instead, as soon as the server responds with headers, the Promise will resolve normally (with the ok property 
	of the response set to false if the response isn't in the range 200–299), and it will only reject on network 
	failure or if anything prevented the request from completing.
*/

/**
 * @description calls JavaScript fetch()
 * @param {string} url
 * @param {object} options
 * @returns
 */
async function callFetch(url, options = {}) {
  const { method = "GET", body = {}, headers } = options;

  const params = {
    method,
    credentials: "include",
    body: method === "GET" ? undefined : JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  let response;
  try {
    response = await fetch(`${API_URL}${url}`, params);
  } catch (err) {
    return NETWORK_ERROR;
  }

  const responseData = await response.json();

  return {
    data: responseData.error ? null : responseData,
    error: responseData.error,
    success: response.ok,
  };
}

const api = {
  async get(url) {
    return callFetch(url);
  },
  async post(url, data) {
    return callFetch(url, { method: "POST", body: data });
  },
  async patch(url, data) {
    return callFetch(url, { method: "PATCH", body: data });
  },
  async delete(url) {
    return callFetch(url, { method: "DELETE" });
  },
};

export default api;
