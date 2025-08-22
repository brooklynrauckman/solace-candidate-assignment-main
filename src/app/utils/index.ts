export const formatPhoneNumber = (phoneNumber: number): string => {
  const phoneStr = phoneNumber.toString();
  if (phoneStr.length === 10) {
    return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(
      6
    )}`;
  }
  return phoneStr;
};
