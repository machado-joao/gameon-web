const getError = (e) =>
  e.response && e.response.data && e.response.data.message
    ? e.response.data.message
    : e.message;

export { getError };
