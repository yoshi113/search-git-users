export const formatNumber = n => {
  if (!n) return '0';
  if (n < 1000) return `${n}`;
  if (n < 10000) return `${Math.round(n / 100) / 10}k`;
  if (n < 1000000) return `${Math.round(n / 1000)}k`;
  if (n < 10000000) return `${Math.round(n / 100000) / 10}k`;
  return `${Math.round(n / 1000000)}m`;
};

export const vaildEmail = str => {
  if (!str) return false;
  const re = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  return re.test(str);
};
