export const getError = (error, res) => {
  let message = "Something went wrong";
  switch (error.code) {
    case "P2002":
      message = `${capitalize(
        error?.meta?.target?.toString() || ""
      )} already exists`;
      break;
    default:
      break;
  }
  console.log("error", error);
  return res.status(500).json({ success: false, msg: message });
};

function capitalize(str = "") {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}
