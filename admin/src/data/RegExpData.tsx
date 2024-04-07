const diacritice = "ĂăÂâÎîȘșȚé";
const diacritice_mari = "ĂÂÎȘȚÉ";

// Form Validation
// export const nameRegExp = `^[A-Za-z${diacritice}][A-Za-z0-9${diacritice},.\"'\\(\\) \\-&]*$`;
// export const addressRegExp = `^[A-Za-z0-9${diacritice}][A-Za-z0-9${diacritice},.\"'\\(\\) \\-&]*$`;
export const tagRegExp = `^[A-Z${diacritice_mari}][A-Za-z${diacritice} \\-&]*$`;
export const idRegExp = "^[0-9a-fA-F]{24}$";
export const phoneRegExp =
  "^(\\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?([0-9]{3}){2}$";
export const latitudeRegExp =
  "^(\\+|-)?(?:90(?:(?:\\.0{1,15})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,15})?))$";
export const longitudeRegExp =
  "^(\\+|-)?(?:180(?:(?:\\.0{1,15})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,15})?))$";

// export const nameRegExpTitle =
//   "Name should start with a letter. Allowed characters: a-z A-Z 0-9 ,.\"'() -&";
// export const addressRegExpTitle =
//   "Name shouldn't start with a symbol. Allowed characters: a-z A-Z 0-9 ,.\"'() -&/";
export const tagRegExpTitle =
  "Name should start with a capital letter. Allowed characters: a-z A-Z -&";
export const idRegExpTitle = "Please enter a valid id";
export const phoneRegExpTitle =
  "Please enter a valid RO phone number (no spaces allowed)";
export const latitudeRegExpTitle = "Invalid latitude coordinates";
export const longitudeRegExpTitle = "Invalid longitude coordinates";