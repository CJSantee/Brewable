import axios from "axios";
import { API_URL } from "../config";

// Returns headers with JWT auth token
// TODO: store token with Cookies instead of localstorage to preserve after page refresh
function authHeaders() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.access_token) {
    return {
      headers: {
        Authorization: user.access_token,
      },
    };
  } else {
    return {};
  }
}

const verifyEmail = (email) => {
  const emailRegex = /\w+@\w+\.\w{2,}/g;
  return emailRegex.test(email) ? email : null;
};

const verifyPhone = (phone) => {
  let verifiedPhone;
  // US Numbers only
  const strippedPhone = phone.replace(/[^0-9]/g, "");
  if (strippedPhone.length === 11) {
    verifiedPhone = `+${strippedPhone}`;
  } else if (strippedPhone.length === 10) {
    verifiedPhone = `+1${strippedPhone}`;
  } else {
    verifiedPhone = null;
  }
  return verifiedPhone;
};

const authProvider = {
  isAuthenticated: false,
  register(formValues, success, fail) {
    const { first_name, last_name, email, phone, password } = formValues;
    const body = {
      user: {
        first_name,
        last_name,
        email: verifyEmail(email),
        phone: verifyPhone(phone),
        password,
      },
    };
    axios
      .post(API_URL + "/users", body)
      .then((res) => {
        const parseRes = res.data;
        if (parseRes.access_token) {
          localStorage.setItem("user", JSON.stringify(parseRes));
          authProvider.isAuthenticated = true;
          success(parseRes);
        } else {
          alert(JSON.stringify(parseRes));
        }
      })
      .catch((err) => {
        const { response } = err;
        fail(response.data);
      });
  },
  login(formValues, callback) {
    const email = verifyEmail(formValues.userIdentifier);
    const phone = verifyPhone(formValues.userIdentifier);
    const { password } = formValues;

    const body = {
      email,
      phone,
      password,
    };

    axios
      .post(API_URL + "/login", body)
      .then((res) => {
        const parseRes = res.data;
        if (parseRes.access_token) {
          localStorage.setItem("user", JSON.stringify(parseRes));
          authProvider.isAuthenticated = true;
          callback(parseRes);
        } else {
          alert(JSON.stringify(parseRes));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  signout(callback) {
    localStorage.removeItem("user");
    authProvider.isAuthenticated = false;
    callback();
  },
};

export { authHeaders, authProvider };
