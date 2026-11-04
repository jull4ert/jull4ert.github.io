// 勾選清單互動：進度、依「專案」記住勾選狀態（localStorage）、重設、列印。
// 勾選以「項目文字」為鍵，所以同一句話出現在不同頁面（例如彙整頁與來源頁）會同步。
(function () {
  var boxes = [].slice.call(document.querySelectorAll("main ul.check input[type=checkbox]"));
  if (!boxes.length) return;

  var KEY = "sec-kb-check", PKEY = "sec-kb-project", DEFAULT = "預設專案";
  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

  var data = load(KEY, null);
  if (!data || !data.projects) { data = { projects: {} }; data.projects[DEFAULT] = {}; }
  var cur = load(PKEY, DEFAULT);
  if (!data.projects[cur]) cur = Object.keys(data.projects)[0] || DEFAULT;
  if (!data.projects[cur]) data.projects[cur] = {};

  var items = boxes.map(function (b) {
    var lab = b.closest("label");
    return { box: b, id: hash((lab ? lab.textContent : "").replace(/\s+/g, " ").trim()) };
  });

  // 工具列
  var bar = el("div", "clbar");
  bar.setAttribute("role", "group"); bar.setAttribute("aria-label", "檢查清單工具");
  var lbl = el("label", "", "專案 ");
  var sel = el("select"); lbl.appendChild(sel);
  var addBtn = el("button", "", "＋新專案"); addBtn.type = "button";
  var renBtn = el("button", "", "改名"); renBtn.type = "button"; renBtn.title = "重新命名目前專案";
  var delBtn = el("button", "", "刪除專案"); delBtn.type = "button"; delBtn.title = "刪除目前專案及其所有勾選紀錄";
  var prog = el("progress"); prog.max = items.length;
  var txt = el("span", "cltxt");
  var rst = el("button", "", "重設本頁"); rst.type = "button";
  var prt = el("button", "", "列印"); prt.type = "button";
  [lbl, addBtn, renBtn, delBtn, prog, txt, rst, prt].forEach(function (n) { bar.appendChild(n); });
  var printHead = el("div", "cl-print");

  function fillSelect() {
    sel.innerHTML = "";
    Object.keys(data.projects).forEach(function (n) { var o = el("option", "", n); o.value = n; if (n === cur) o.selected = true; sel.appendChild(o); });
  }
  function refresh() {
    var st = data.projects[cur], done = 0;
    items.forEach(function (it) { var on = !!st[it.id]; it.box.checked = on; if (on) done++; });
    prog.value = done; txt.textContent = "已完成 " + done + " / " + items.length;
    printHead.textContent = "專案：" + cur + "　　日期：" + new Date().toISOString().slice(0, 10) + "　　進度：" + done + " / " + items.length;
  }
  items.forEach(function (it) {
    it.box.addEventListener("change", function () {
      var st = data.projects[cur]; if (it.box.checked) st[it.id] = 1; else delete st[it.id];
      save(KEY, data); refresh();
    });
  });
  sel.onchange = function () { cur = sel.value; save(PKEY, cur); refresh(); };
  addBtn.onclick = function () {
    var n = (window.prompt("新專案名稱") || "").trim();
    if (!n) return;
    if (!data.projects[n]) data.projects[n] = {};
    cur = n; save(KEY, data); save(PKEY, cur); fillSelect(); refresh();
  };
  renBtn.onclick = function () {
    var n = (window.prompt("將專案「" + cur + "」改名為：", cur) || "").trim();
    if (!n || n === cur) return;
    if (data.projects[n]) { window.alert("已有同名專案「" + n + "」，請換一個名稱。"); return; }
    // 保持原本的排列順序
    var np = {}; Object.keys(data.projects).forEach(function (k) { np[k === cur ? n : k] = data.projects[k]; });
    data.projects = np; cur = n; save(KEY, data); save(PKEY, cur); fillSelect(); refresh();
  };
  delBtn.onclick = function () {
    var n = Object.keys(data.projects[cur]).length;
    if (!window.confirm("確定刪除專案「" + cur + "」？其中共有 " + n + " 筆勾選紀錄會一併刪除，且無法復原。")) return;
    delete data.projects[cur];
    var rest = Object.keys(data.projects);
    if (!rest.length) { data.projects[DEFAULT] = {}; rest = [DEFAULT]; }
    cur = rest[0]; save(KEY, data); save(PKEY, cur); fillSelect(); refresh();
  };
  rst.onclick = function () {
    if (!window.confirm("確定重設本頁在「" + cur + "」的所有勾選？")) return;
    items.forEach(function (it) { delete data.projects[cur][it.id]; });
    save(KEY, data); refresh();
  };
  prt.onclick = function () { refresh(); window.print(); };
  window.addEventListener("beforeprint", refresh);

  var main = document.querySelector("main");
  main.insertBefore(printHead, main.firstChild);
  main.insertBefore(bar, main.firstChild);
  fillSelect(); refresh();
})();
