export const align = (number: number): string => {
  const str = number.toString();
  return " " + str + " ".repeat(11 - str.length);
};

export const align_username = (username: string): string => {
  const len = username.length;

  if (len <= 5) {
    return username + "@github.com";
  } else if (len <= 7) {
    return username + "@github";
  } else if (len <= 10) {
    return username + "@git";
  } else if (len > 16) {
    return username.slice(0, 17);
  } else {
    return username;
  }
};
