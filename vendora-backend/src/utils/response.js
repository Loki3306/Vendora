// @module shared | Vendora v1.0 | SPIT Mini Project AY 2026-27
function sendSuccess(res, data, message = 'Success', status = 200, pagination = null) {
  const payload = { success: true, message, data };
  if (pagination) payload.pagination = pagination;
  return res.status(status).json(payload);
}

function sendError(res, message, status = 500, errorCode = 'INTERNAL_ERROR', data = null) {
  return res.status(status).json({
    success: false,
    message,
    errorCode,
    data,
  });
}

module.exports = { sendSuccess, sendError };
