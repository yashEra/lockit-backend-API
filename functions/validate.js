const isEmpty = (data, fieldName) => {
    if (!data || data.trim() === '') {
      throw `${fieldName} cannot be empty`;
    }
  };
  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw 'Invalid email format';
    }
  };
  
  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw 'Invalid phone number format';
    }
  };
  
  const validateFields = (data) => {
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        switch (key) {
          case 'email':
            isValidEmail(data[key]);
            break;
          case 'phoneNumber':
            isValidPhoneNumber(data[key]);
            break;
          default:
            isEmpty(data[key], key);
        }
      }
    }
    return data; // Return the validated user object
  };
  
  module.exports = {
    isEmpty,
    isValidEmail,
    isValidPhoneNumber,
    validateFields,
  };