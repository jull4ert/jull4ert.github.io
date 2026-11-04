// 技術分類篩選：頁面中以 <div class="tech" data-tech="key"> 包住各技術內容。
// 新增技術：在 TECHS 加一行（g = 分類群組，l = 顯示名稱），順序即顯示順序。
(function () {
  var GROUPS = { lang: "後端語言／框架", fe: "前端", db: "資料庫", srv: "網頁伺服器", ctr: "容器／編排", ci: "CI/CD", sec: "密鑰管理", os: "作業系統", cloud: "雲端平台", ep: "終端裝置", net: "網路／防火牆" };
  var TECHS = {
    dotnet:  { g: "lang", l: ".NET (C#)" },
    node:    { g: "lang", l: "Node.js" },
    java:    { g: "lang", l: "Java／Spring" },
    python:  { g: "lang", l: "Python" },
    php:     { g: "lang", l: "PHP／Laravel" },
    vanilla: { g: "fe", l: "原生 JS" },
    vue:     { g: "fe", l: "Vue" },
    react:   { g: "fe", l: "React" },
    angular: { g: "fe", l: "Angular" },
    mssql:   { g: "db", l: "SQL Server" },
    pgsql:   { g: "db", l: "PostgreSQL" },
    mysql:   { g: "db", l: "MySQL／MariaDB" },
    nginx:   { g: "srv", l: "Nginx" },
    iis:     { g: "srv", l: "IIS" },
    apache:  { g: "srv", l: "Apache" },
    docker:  { g: "ctr", l: "Docker" },
    k8s:     { g: "ctr", l: "Kubernetes" },
    gha:     { g: "ci", l: "GitHub Actions" },
    gitlab:  { g: "ci", l: "GitLab CI" },
    azdo:    { g: "ci", l: "Azure DevOps" },
    envfile: { g: "sec", l: "環境變數／.env" },
    vault:   { g: "sec", l: "HashiCorp Vault" },
    azkv:    { g: "sec", l: "Azure Key Vault" },
    awssm:   { g: "sec", l: "AWS Secrets Manager" },
    windows: { g: "os", l: "Windows Server" },
    linux:   { g: "os", l: "Linux" },
    aws:     { g: "cloud", l: "AWS" },
    azure:   { g: "cloud", l: "Azure" },
    gcp:     { g: "cloud", l: "Google Cloud" },
    epwin:   { g: "ep", l: "Windows" },
    epmac:   { g: "ep", l: "macOS" },
    eplinux: { g: "ep", l: "Linux" },
    nft:     { g: "net", l: "Linux nftables" },
    winfw:   { g: "net", l: "Windows 防火牆" }
  };
  var STORE = "sec-kb-tech";

  var blocks = Array.prototype.slice.call(document.querySelectorAll(".tech[data-tech]"));
  if (!blocks.length) return;

  var pref = {};
  try { pref = JSON.parse(localStorage.getItem(STORE) || "{}") || {}; } catch (e) { pref = {}; }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(pref)); } catch (e) {} }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

  // 本頁出現的技術，依 TECHS 順序分組
  var present = {};
  blocks.forEach(function (b) { present[b.getAttribute("data-tech")] = 1; });
  var byGroup = {};
  Object.keys(TECHS).forEach(function (k) {
    if (present[k]) (byGroup[TECHS[k].g] = byGroup[TECHS[k].g] || []).push(k);
  });

  // 每個區塊補上標題
  blocks.forEach(function (b) {
    var t = TECHS[b.getAttribute("data-tech")];
    if (t && !b.querySelector(".tech-h")) { var h = el("h4", "tech-h", t.l); b.insertBefore(h, b.firstChild); }
  });

  function active(g) { var v = pref[g]; return v && byGroup[g].indexOf(v) >= 0 ? v : "all"; }
  function apply() {
    blocks.forEach(function (b) {
      var k = b.getAttribute("data-tech"), t = TECHS[k];
      var a = t ? active(t.g) : "all";
      b.hidden = !(a === "all" || a === k);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".techbar .chip"), function (c) {
      c.setAttribute("aria-pressed", String(active(c.getAttribute("data-g")) === c.getAttribute("data-k")));
    });
  }

  var bar = el("div", "techbar");
  bar.setAttribute("role", "group"); bar.setAttribute("aria-label", "技術分類篩選");
  Object.keys(GROUPS).forEach(function (g) {
    if (!byGroup[g]) return;
    var row = el("div", "techrow"); row.appendChild(el("span", "techlabel", GROUPS[g]));
    var chips = el("span", "chips");
    ["all"].concat(byGroup[g]).forEach(function (k) {
      var c = el("button", "chip", k === "all" ? "全部" : TECHS[k].l);
      c.type = "button"; c.setAttribute("data-g", g); c.setAttribute("data-k", k);
      c.onclick = function () { pref[g] = k; save(); apply(); };
      chips.appendChild(c);
    });
    row.appendChild(chips); bar.appendChild(row);
  });
  var main = document.querySelector("main");
  var anchor = document.getElementById("tech-anchor");
  if (anchor) anchor.parentNode.insertBefore(bar, anchor); else main.insertBefore(bar, main.firstChild);
  apply();
})();
