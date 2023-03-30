import React from "react";

const Footer = () => {};

export default Footer;

function caesarCypher(string, number) {
  const newString = string
    .split("")
    .map((char) => {
      const charCode = char.charCodeAt(0);
      if (charCode >= 65 && charCode <= 90) {
        return String.fromCharCode(((charCode - 65 + number) % 26) + 65);
      } else if (charCode >= 97 && charCode <= 122) {
        return String.fromCharCode(((charCode - 97 + number) % 26) + 97);
      } else {
        return char;
      }
    })
    .join("");

  return newString;
}
