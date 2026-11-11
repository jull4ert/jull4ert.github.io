(function (root) {
  var statusMap = {
    Draft: "草稿",
    Submitted: "已送出",
    Shipped: "已出貨",
    Cancelled: "已取消"
  };

  function statusText(status) {
    return statusMap[status] || status;
  }

  function formatDate(iso) {
    return iso.substring(0, 10);
  }

  root.OrderUtils = { statusText: statusText, formatDate: formatDate };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = root.OrderUtils;
  }
})(typeof window !== "undefined" ? window : globalThis);
