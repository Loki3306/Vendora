// @module shared | Vendora v1.0 | SPIT Mini Project AY 2026-27
function parsePagination(query = {}) {
  const requestedPage = Number.parseInt(query.page, 10);
  const requestedLimit = Number.parseInt(query.limit, 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit = Math.min(
    Number.isFinite(requestedLimit) && requestedLimit > 0 ? requestedLimit : 20,
    100,
  );
  return { limit, offset: (page - 1) * limit, page };
}

module.exports = { parsePagination };
