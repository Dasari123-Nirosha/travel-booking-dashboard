export const isRequired = (value) => {
  return value !== undefined && value !== null && String(value).trim() !== "";
};

export const isValidEmail = (email) => {
  if (!email) return false;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
};

export const isValidPhone = (phone) => {
  if (!phone) return false;

  const phonePattern = /^[+]?[0-9\s-]{10,15}$/;

  return phonePattern.test(phone);
};

export const isPositiveNumber = (value) => {
  return Number(value) > 0;
};

export const validateBooking = (booking) => {
  const errors = {};

  if (!isRequired(booking.customer)) {
    errors.customer = "Customer name is required";
  }

  if (!isRequired(booking.destination)) {
    errors.destination = "Destination is required";
  }

  if (!isRequired(booking.tripDate)) {
    errors.tripDate = "Trip date is required";
  }

  if (!isPositiveNumber(booking.amount)) {
    errors.amount = "Amount must be greater than 0";
  }

  return errors;
};

export const validateCustomer = (customer) => {
  const errors = {};

  if (!isRequired(customer.name)) {
    errors.name = "Customer name is required";
  }

  if (!isValidEmail(customer.email)) {
    errors.email = "Enter a valid email address";
  }

  if (customer.phone && !isValidPhone(customer.phone)) {
    errors.phone = "Enter a valid phone number";
  }

  return errors;
};

export const validateDestination = (destination) => {
  const errors = {};

  if (!isRequired(destination.name)) {
    errors.name = "Destination name is required";
  }

  if (!isRequired(destination.country)) {
    errors.country = "Country is required";
  }

  if (!isPositiveNumber(destination.price)) {
    errors.price = "Price must be greater than 0";
  }

  return errors;
};