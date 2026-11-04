// 麵包屑 + 同層切換 + 自動子項目清單。純靜態，可於 file:// 與 GitHub Pages 運作。
(function () {
  var S = window.SITEMAP || {};
  var root = document.currentScript.src.replace(/assets\/nav\.js.*$/, "");
  var rel = location.href.split(/[?#]/)[0];
  rel = rel.indexOf(root) === 0 ? decodeURIComponent(rel.slice(root.length)) : "";
  rel = rel.replace(/index\.html$/, "");
  var key = rel;

  function href(k) { return root + (k && k.slice(-1) === "/" ? k + "index.html" : k); }
  function title(k) { return S[k] ? S[k].t : k; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
  function parentOf(k) {
    if (!k) return null;
    var s = k.replace(/\/$/, "").split("/"); s.pop();
    return s.length ? s.join("/") + "/" : "";
  }

  // 由根到當前頁的鏈
  var chain = [], k = key;
  while (k !== null) { chain.unshift(k); k = parentOf(k); }

  var nav = document.getElementById("crumb");
  if (nav) {
    chain.forEach(function (ck, i) {
      var last = i === chain.length - 1;
      var item = el("span", "crumb-item");
      if (last) { item.appendChild(el("span", "crumb-cur", title(ck))); }
      else { var a = el("a", "", title(ck)); a.href = href(ck); item.appendChild(a); }
      // 同層切換選單（列出此節點父層的所有子項）
      var par = parentOf(ck);
      if (par !== null && S[par] && S[par].c && S[par].c.length > 1) {
        var btn = el("button", "crumb-sw", "▾"); btn.type = "button"; btn.title = "切換同層主題";
        var menu = el("ul", "crumb-menu"); menu.hidden = true;
        S[par].c.forEach(function (sk) {
          var li = el("li"); var info = S[sk] || { t: sk };
          if (info.p) li.appendChild(el("span", "plan", info.t + "（規劃中）"));
          else { var l = el("a", sk === ck ? "on" : "", info.t); l.href = href(sk); li.appendChild(l); }
          menu.appendChild(li);
        });
        btn.onclick = function (e) { e.stopPropagation(); var h = menu.hidden; closeAll(); menu.hidden = !h; };
        item.appendChild(btn); item.appendChild(menu);
      }
      nav.appendChild(item);
      if (!last) nav.appendChild(el("span", "crumb-sep", "›"));
    });
    document.addEventListener("click", closeAll);
  }
  function closeAll() { document.querySelectorAll(".crumb-menu").forEach(function (m) { m.hidden = true; }); }

  // 子項目清單：<div id="children"></div>
  var box = document.getElementById("children");
  if (box && S[key] && S[key].c) {
    var g = el("div", "grid");
    S[key].c.forEach(function (ck) {
      var info = S[ck] || { t: ck }, isDir = ck.slice(-1) === "/", n = (info.c || []).length;
      var card = el("div", "card");
      var h = el("h3");
      if (info.p) { h.textContent = info.t; h.appendChild(el("span", "tag", "規劃中")); }
      else { var a = el("a", "", info.t); a.href = href(ck); h.appendChild(a); if (isDir && n) h.appendChild(el("span", "tag", n + " 個子項")); }
      card.appendChild(h);
      if (info.d) card.appendChild(el("p", "", info.d));
      g.appendChild(card);
    });
    box.appendChild(g);
  }

  // RWD：表格包一層可橫向捲動的容器
  document.querySelectorAll("main table").forEach(function (t) {
    if (t.parentNode.className === "tw") return;
    var w = document.createElement("div"); w.className = "tw";
    t.parentNode.insertBefore(w, t); w.appendChild(t);
  });

  // 勾選清單互動（進度／專案／列印）：僅在有清單的頁面載入
  if (document.querySelector("main ul.check")) {
    var cs = document.createElement("script"); cs.src = root + "assets/checklist.js"; document.body.appendChild(cs);
  }

  // 「參考出處」的連結另開分頁；其餘連結（含子頁面、站內連結、內文中的外部連結）維持原分頁
  document.querySelectorAll(".refs a[href]").forEach(function (a) {
    a.target = "_blank"; a.rel = "noopener noreferrer";
  });

  // 名詞：縮寫提示與「本頁名詞」
  var gs = document.createElement("script"); gs.src = root + "assets/glossary.js"; document.body.appendChild(gs);
})();
