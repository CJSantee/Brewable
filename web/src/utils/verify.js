const verifyEmail = (email) => {
  const emailRegex = /\w+@\w+\.\w{2,}/g;
  return emailRegex.test(email) ? email : null;
};

const verifyPhone = (phone) => {
  if (!phone) {
    return null;
  }
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

module.exports = {
  verifyEmail,
  verifyPhone,
};
