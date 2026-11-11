const test = require("node:test");
const assert = require("node:assert");
const { statusText, formatDate } = require("../../src/OrderDemo.Web/wwwroot/js/order-utils.js");

test("statusText 轉成中文", () => {
  assert.strictEqual(statusText("Shipped"), "已出貨");
});

test("statusText 遇到未知狀態回傳原值", () => {
  assert.strictEqual(statusText("Unknown"), "Unknown");
});

test("formatDate 取日期部分", () => {
  assert.strictEqual(formatDate("2026-10-01T01:30:00Z").length, 10);
});
