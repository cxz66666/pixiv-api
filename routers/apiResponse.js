const Ok = (option) => {
  return {
    status: "ok",
    data: option,
  };
};

const Err = (option) => {
  return {
    status: "error",
    data: option,
  };
};

module.exports = {
  Ok,
  Err,
};
