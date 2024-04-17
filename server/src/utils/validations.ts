import validator from "validator";

export const ErrorCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export function isEmail(email: string) {
  if (!validator.isEmail(email)) {
    throwError(ErrorCode.BAD_REQUEST, "Error: Email not valid.");
  }
  return "Valid email";
}

export function isStringEmpty(string: string, variableName: string) {
  if (!string.trim() || string.length < 1) {
    throwError(
      ErrorCode.BAD_REQUEST,
      `Error: Empty string passed for ${variableName || "provided variable"}.`
    );
  }
  return "String is not empty";
}

export function isPasswordValid(password: string) {
  const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    throwError(
      ErrorCode.BAD_REQUEST,
      "Error: Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
    );
  }
  return "Valid password";
}

export function isPhoneValid(phone: string) {
  const phoneRegex = /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/;
  if (!phoneRegex.test(phone)) {
    throwError(ErrorCode.BAD_REQUEST, "Error: Invalid phone format.");
  }
  return "Valid phone number";
}

export function isDateValid(date: string) {
  if (!validator.isDate(date)) {
    throwError(ErrorCode.BAD_REQUEST, "Error: Invalid date format.");
  }
  return "Valid date";
}

export function isNumberValid(num: number, variableName: string) {
  if (isNaN(num)) {
    throwError(
      ErrorCode.BAD_REQUEST,
      `Error: ${variableName || "Provided variable"} is not a number.`
    );
  }
  return "Valid number";
}

export const throwError = (
  code = 500,
  message = "Error: Internal server error"
) => {
  throw { code, message };
};
