/* eslint-disable prettier/prettier */
// const generateOTP = async (digits = 4) =>{
//     const val = Math.floor(1000 + Math.random() * 9000);
//     return val;
// }

const generateOTP = async (digits = 4) => {
  const max = Math.pow(10, digits) - 1;
  const min = Math.pow(10, digits - 1);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const emailPattern = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
// const emailPattern = new RegExp('^[a-z0-9._]+@[a-z0-9.-]+\\.[a-z]{2,}$');
// const phonePattern = new RegExp('[0-9]{10}');
const phonePattern = /^[0-9]{11}$/;

const generateSlug = async () => {
    const val = Math.floor(1000 + Math.random() * 9000);
    return val.toString();
}

export {generateOTP, emailPattern, phonePattern, generateSlug}

