const successResponse = (res, data, status = 200) => {
  return res.status(status).json({ success: true, data });
};

const errorResponse = (res, message, status = 400, errors = []) => {
  return res.status(status).json({ success: false, message, errors });
};

module.exports = { successResponse, errorResponse };
