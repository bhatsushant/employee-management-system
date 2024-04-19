import validator from "validator";
import moment from "moment";

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
}

export function isPasswordValid(password: string) {
  const passwordRegex =
    /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throwError(
      ErrorCode.BAD_REQUEST,
      "Error: Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
    );
  }
}

export function isPhoneValid(phone: string) {
  const phoneRegex =
    /^(?:\(\d{3}\)\s*\d{4}\s*\d{3}|\(\d{3}\)\s*\d{3}-\d{4}|\d{10})$/;
  if (!phoneRegex.test(phone)) {
    throwError(ErrorCode.BAD_REQUEST, "Error: Invalid phone format.");
  }
}

export function isDateValid(date: string) {
  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    throwError(ErrorCode.BAD_REQUEST, "Error: Invalid date format.");
  }
}

export function isNumberValid(num: number, variableName: string) {
  if (isNaN(num)) {
    throwError(
      ErrorCode.BAD_REQUEST,
      `Error: ${variableName} || "Provided variable"} is not a number.`
    );
  }
}

export const throwError = (
  code = 500,
  message = "Error: Internal server error"
) => {
  throw { code, message };
};
