const verifyNameLength = (name) => {
  return name.length >= 8;
}

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\d{11,13}$/;
  return phoneRegex.test(phoneNumber);
};

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const isValidAddress = (address) => {
  const addressRegex = /^[A-Za-z0-9\s,.'-]{5,}$/;
  return addressRegex.test(address) && address.trim().split(/\s+/).length >= 2;
};


// Exporta um objeto contendo todas as funções de validação
export default {
  verifyNameLength,
  isValidEmail,
  isValidPhoneNumber,
  isValidAddress,
  isValidPassword
};
