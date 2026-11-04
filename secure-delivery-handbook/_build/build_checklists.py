# -*- coding: utf-8 -*-
"""
產生 04-checklists/ 的彙整頁。

用法（在專案根目錄 secure-delivery-handbook/ 執行）：
    python _build/build_checklists.py

運作：
  1. 從 03-lifecycle、02-software、01-hardware 的頁面抽出所有 <ul class="check"> 項目（來源頁是唯一維護處）。
  2. 依階段／技術領域重新排版成 04-checklists/ 下的彙整頁（請勿直接編輯這些頁面）。
  3. 重新產生 assets/sitemap.js 中的 04-checklists 區段，並在來源頁加上回連。
需要 Python 3 與 Node.js（用來讀 sitemap.js）。可重複執行（idempotent）。
"""
import os, re, sys, json, subprocess, html as H

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
os.chdir(ROOT)
OUT = "04-checklists/"
BEGIN, END = "// BEGIN 04-checklists（由 _build/build_checklists.py 產生）", "// END 04-checklists"

# ---------------------------------------------------------------- sitemap
def load_sitemap():
    js = ("global.window={};require('./assets/sitemap.js');"
          "console.log(JSON.stringify(window.SITEMAP))")
    return json.loads(subprocess.check_output(["node", "-e", js], text=True, encoding="utf-8"))

SM = load_sitemap()

def title_of(k): return SM[k]["t"] if k in SM else k
def file_of(k): return k + "index.html" if k.endswith("/") else k

def pages_under(dirkey):
    """依站內地圖順序，列出資料夾下所有已完成的頁面（先 index，再子項）。"""
    res = [dirkey]
    for c in SM.get(dirkey, {}).get("c", []):
        if SM.get(c, {}).get("p"): continue
        res += pages_under(c) if c.endswith("/") else [c]
    return res

# ---------------------------------------------------------------- 抽取
def strip_tags(s): return re.sub(r"<[^>]+>", "", s).strip()

def extract(key):
    t = open(file_of(key), encoding="utf-8").read()
    main = t[t.index("<main"):]
    sections, cur = [], "（未分類）"
    for m in re.finditer(r'<h2[^>]*>(.*?)</h2>|<ul class="check">(.*?)</ul>', main, re.S):
        if m.group(1) is not None:
            cur = strip_tags(m.group(1))
        else:
            items = [i.strip() for i in re.findall(r'<li><label><input type="checkbox">\s*(.*?)</label></li>', m.group(2), re.S)]
            if items: sections.append((cur, items))
    return sections

def collect(dirkey):
    """回傳 [(來源key, 標題, [(小節, [項目])])]，略過沒有清單的頁面。"""
    out = []
    for k in pages_under(dirkey):
        secs = extract(k)
        if secs: out.append((k, title_of(k), secs))
    return out

def count(blocks): return sum(len(i) for _, _, secs in blocks for _, i in secs)

# ---------------------------------------------------------------- 版面
def page(path, title, sub, body, desc, reg):
    reg.append((path[:-10] if path.endswith("index.html") else path, title, desc))
    rel = "../" * path.count("/")
    out = """<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>%s｜資安交付手冊</title>
<link rel="stylesheet" href="%sassets/style.css">
</head>
<body>
<header>
  <nav id="crumb" aria-label="麵包屑"></nav>
  <h1>%s</h1>
  <p class="sub">%s</p>
</header>
<main class="page">
%s
</main>
<footer></footer>
<script src="%sassets/sitemap.js"></script>
<script src="%sassets/nav.js"></script>
</body>
</html>
""" % (title, rel, title, sub, body, rel, rel)
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, "w", encoding="utf-8", newline="\n").write(out)

def h2(t, id=None): return "<h2%s>%s</h2>" % (' id="%s"' % id if id else "", t)
def note(t): return '<div class="note">%s</div>' % t
def chk(items): return '<ul class="check">%s</ul>' % "".join('<li><label><input type="checkbox"> %s</label></li>' % i for i in items)
def tbl(head, rows):
    return "<table><tr>%s</tr>%s</table>" % ("".join("<th>%s</th>" % c for c in head),
        "".join("<tr>%s</tr>" % "".join("<td>%s</td>" % c for c in r) for r in rows))
AUTO = note("本頁由腳本從各來源頁面<b>自動彙整</b>，請到來源頁修改內容（點小節旁的「來源」）。勾選狀態依「專案」記錄在你的瀏覽器中，不會上傳。")

def aggregate_body(blocks, rel):
    parts = [AUTO]
    for k, t, secs in blocks:
        src = '<a class="cl-src" href="%s%s">來源 ↗</a>' % (rel, file_of(k))
        parts.append(h2(H.escape(t) + src))
        for sec, items in secs:
            if len(secs) > 1 or sec not in ("檢查清單",):
                parts.append('<h3 class="cl-sec">%s</h3>' % H.escape(sec))
            parts.append(chk(items))
    return "".join(parts)

REG = []

# ---------------------------------------------------------------- 生命週期彙整
LC = "03-lifecycle/"
stages = [c for c in SM[LC]["c"] if not SM[c].get("p")]
lc_rows = []
for sk in stages:
    blocks = collect(sk)
    name = SM[sk]["t"]; slug = sk.split("/")[1]
    path = OUT + "lifecycle/%s.html" % slug
    page(path, name + "檢查清單", "彙整「%s」階段的所有檢查項目（含子頁面），可勾選與列印。" % name,
         aggregate_body(blocks, "../../"), "共 %d 項" % count(blocks), REG)
    lc_rows.append(('<a href="./%s.html">%s</a>' % (slug, name), str(count(blocks)), str(len(blocks)), SM[sk].get("d", "")))
page(OUT + "lifecycle/index.html", "依生命週期階段", "每個階段一份彙整清單；各階段的「出口條件」是進入下一階段的關卡。",
     tbl(["階段", "項目數", "來源頁數", "內容"], lc_rows) +
     note("上線前請依序完成：<a href=\"./pre-release.html\">上線前檢查</a> → <a href=\"./go-live.html\">上線當下</a>。"),
     "七個階段各一份", REG)

# ---------------------------------------------------------------- 技術領域彙整
def tech_pages(root, fname, title, sub):
    areas = [c for c in SM[root]["c"] if c.endswith("/") and not SM[c].get("p")]
    parts, toc = [AUTO], []
    total = 0
    for a in areas:
        blocks = collect(a)
        if not blocks: continue
        n = count(blocks); total += n
        aid = a.rstrip("/").split("/")[-1]
        toc.append('<a href="#%s">%s（%d）</a>' % (aid, H.escape(title_of(a)), n))
        parts.append(h2(H.escape(title_of(a)), aid))
        for k, t, secs in blocks:
            src = '<a class="cl-src" href="../../%s">來源 ↗</a>' % file_of(k)
            parts.append("<h3>%s%s</h3>" % (H.escape(t), src))
            for sec, items in secs:
                if sec != "檢查清單": parts.append('<h3 class="cl-sec">%s</h3>' % H.escape(sec))
                parts.append(chk(items))
    parts.insert(1, "<p>快速跳轉：" + " ｜ ".join(toc) + "</p>")
    page(OUT + "technical/" + fname, title, sub, "".join(parts), "共 %d 項" % total, REG)
    return total

sw = tech_pages("02-software/", "software.html", "軟體與應用程式檢查清單", "前端、後端、驗證授權、API、資料庫、平台、DevOps、日誌的檢查項目彙整。")
hw = tech_pages("01-hardware/", "hardware.html", "硬體與基礎設施檢查清單", "實體、伺服器、網路、終端、雲端、備份與災難復原的檢查項目彙整。")
page(OUT + "technical/index.html", "依技術領域", "不分階段，直接依技術領域檢查。",
     tbl(["領域", "項目數"], [['<a href="./software.html">軟體與應用程式</a>', str(sw)], ['<a href="./hardware.html">硬體與基礎設施</a>', str(hw)]]),
     "軟體與硬體各一份", REG)

# ---------------------------------------------------------------- 手寫：定期維運
page(OUT + "recurring.html", "定期維運檢查表", "依頻率分組的例行工作；每個週期開始前按「重設本頁」重新勾選。",
 note("週期與工作內容的依據見 <a href=\"../03-lifecycle/operations/index.html\">上線後營運</a>。") +
 h2("每日") + chk(["檢視告警與異常登入", "檢視依賴漏洞自動掃描結果", "確認備份作業成功", "確認監控與日誌收集正常"]) +
 h2("每週") + chk(["評估廠商安全公告與新漏洞（含 CISA KEV）", "處理待修補項目並更新進度", "檢視 WAF 與存取日誌的異常趨勢", "確認憑證到期日（未來 30 天內）"]) +
 h2("每月") + chk(["執行弱點掃描並處理結果", "盤點帳號與權限（離職、停用、閒置帳號）", "提交修補進度報告", "檢視雲端公開資源與過度授權", "確認各系統時間同步與日誌保存空間"]) +
 h2("每季") + chk(["執行備份還原演練並記錄實際耗時（RTO）", "複查 TLS 與安全標頭設定", "檢討日誌與告警規則（誤報與漏報）", "審閱防火牆與安全群組規則並清理過期項目", "桌面推演事故應變流程"]) +
 h2("每年") + chk(["滲透測試（依風險分級）並完成複測", "事故應變演練", "災難復原演練（依服務等級）", "整體資安檢討與風險評鑑更新", "金鑰與憑證輪替檢查", "供應商與雲端商的驗證報告查證", "人員資安教育訓練", "合約與責任分界表更新"]),
 "每日／週／月／季／年", REG)

# ---------------------------------------------------------------- 手寫：帳號權限
page(OUT + "accounts.html", "人員帳號與權限檢查表", "新進、異動、離職三種情境的帳號與權限處理。",
 note("離職檢查是最常漏掉的環節，建議由人資通知觸發，並留存逐項確認紀錄。相關說明見 <a href=\"../03-lifecycle/handover/index.html\">交付與終止</a>。") +
 h2("新進人員") + chk(["建立個人帳號（不共用），依角色給最小權限", "啟用多因素驗證（MFA）", "簽署保密協議與資安政策", "裝置符合筆電安全基準（全碟加密、更新、端點防護）", "完成資安教育訓練", "加入資產清單與權限清冊"]) +
 h2("職務異動") + chk(["移除舊角色專屬的權限", "依新職務重新授權並經主管核可", "重新審查對正式環境與客戶資料的存取", "更新權限清冊"]) +
 h2("離職或合作終止") + chk(["當日停用單一登入／目錄帳號", "停用 VPN 與遠端連線帳號", "移除版本控制、CI/CD、監控與協作工具的權限", "移除雲端主控台與 IAM 權限，撤銷其存取金鑰", "移除資料庫與伺服器帳號（含 SSH 金鑰）", "重設其知悉的共用帳號與服務帳號密碼", "輪替其接觸過的 API 金鑰、Token、憑證", "檢查第三方服務（金流、簡訊、郵件、網域、DNS、CDN）的管理者身分並轉移", "收回裝置與外接媒體並遠端抹除", "移轉其郵件、共享資料夾與文件的擁有權", "留存逐項確認紀錄與日期"]) +
 h2("定期") + chk(["每月盤點閒置帳號與過度授權", "每季由資料擁有者確認權限仍合理"]),
 "新進、異動、離職", REG)

# ---------------------------------------------------------------- 手寫：驗收報告範本
def cell(txt=""): return '<td class="fill" contenteditable="true">%s</td>' % txt
page(OUT + "report-template.html", "客戶驗收用資安報告範本", "上線前交付客戶的資安報告骨架；可直接在頁面中編輯，再列印成 PDF。",
 note("頁面上灰色虛線的格子可直接點選輸入。<b>內容不會被儲存</b>，請列印成 PDF 或另存。以下為建議結構，請依合約調整。") +
 '<div class="report">' +
 h2("1. 基本資料") + "<table>" + "".join("<tr><th>%s</th>%s</tr>" % (a, cell()) for a in ["專案名稱", "系統名稱與版本", "環境（預備／正式）", "報告日期", "撰寫者", "客戶窗口", "風險等級（見風險分級）"]) + "</table>" +
 h2("2. 範圍") + "<table><tr><th>項目</th><th>內容</th></tr><tr><th>測試網域／IP</th>" + cell() + "</tr><tr><th>排除項目</th>" + cell() + "</tr><tr><th>測試時段</th>" + cell() + "</tr></table>" +
 h2("3. 執行摘要") + "<table><tr>" + cell("（以非技術語言說明整體風險狀態與是否建議上線）") + "</tr></table>" +
 h2("4. 檢查項目與結果") + "<table><tr><th>項目</th><th>工具／方法</th><th>結果（通過／有缺失）</th><th>報告編號</th></tr>" +
 "".join("<tr><th>%s</th>%s%s%s</tr>" % (a, cell(), cell(), cell()) for a in ["原始碼靜態分析（SAST）", "第三方依賴與 SBOM", "機敏資訊掃描", "TLS 設定", "HTTP 安全標頭與 Cookie", "弱點掃描", "滲透測試與複測", "備份與還原驗證"]) + "</table>" +
 h2("5. 弱點統計") + "<table><tr><th>嚴重度</th><th>發現</th><th>已修補</th><th>未修補（含風險接受）</th></tr>" +
 "".join("<tr><th>%s</th>%s%s%s</tr>" % (a, cell(), cell(), cell()) for a in ["嚴重", "高", "中", "低"]) + "</table>" +
 h2("6. 殘餘風險與風險接受") + "<table><tr><th>弱點描述與嚴重度</th><th>無法修補原因</th><th>補償措施</th><th>預計修補日</th><th>風險接受人</th></tr><tr>" + cell() * 5 + "</tr><tr>" + cell() * 5 + "</tr></table>" +
 h2("7. 結論") + "<table><tr>" + cell("（建議上線／附條件上線／不建議上線，及理由）") + "</tr></table>" +
 h2("8. 簽核") + "<table><tr><th>角色</th><th>姓名</th><th>簽名</th><th>日期</th></tr>" +
 "".join("<tr><th>%s</th>%s%s%s</tr>" % (a, cell(), cell(), cell()) for a in ["專案經理", "資安負責人", "客戶代表"]) + "</table></div>" +
 note("填寫時請對照：<a href=\"../03-lifecycle/pre-release/acceptance.html\">驗收與 Go/No-Go</a>、<a href=\"../03-lifecycle/pre-release/vulnerability-scan.html#severity\">嚴重度與處理時限</a>。"),
 "可編輯、可列印的報告骨架", REG)

# ---------------------------------------------------------------- 04 總覽
page(OUT + "index.html", "檢查清單", "把分散在各頁的檢查項目彙整成可勾選、可記錄、可列印的清單。",
 h2("怎麼用") + "<ol><li>選擇<b>專案</b>（頁面頂端的工具列，可新增多個專案）。</li><li>依情境開啟對應清單，逐項勾選；進度會自動計算。</li><li>需要留存時按<b>列印</b>（另存 PDF），抬頭會帶上專案名稱與日期。</li><li>勾選狀態只存在你的瀏覽器，換瀏覽器或清除資料就會消失；重要紀錄請列印保存。</li></ol>" +
 h2("清單") + "<div id=\"children\"></div>" +
 h2("內容來源與更新") + "<ul><li>階段與技術領域的清單由 <code>_build/build_checklists.py</code> 從來源頁面自動彙整，來源頁是唯一維護處。</li><li>新增或修改來源頁的檢查項目後，在專案根目錄執行 <code>python _build/build_checklists.py</code> 即可更新。</li><li>定期維運、人員帳號、報告範本為本區塊自有內容。</li></ul>" +
 note("勾選以項目文字為依據：來源頁與彙整頁的同一句項目會同步勾選；修改項目文字後，該項的舊勾選紀錄會失效。"),
 "階段、技術領域、定期、人員、報告範本", REG)

# ---------------------------------------------------------------- 寫入 sitemap
def parent(k):
    s = k.rstrip("/").split("/"); s.pop()
    return "/".join(s) + "/" if s else ""
lines = []
for k, t, d in REG:
    kids = [kk for kk, _, _ in REG if parent(kk) == k and kk != k] if k.endswith("/") else []
    ent = '  "%s": { t: "%s", d: "%s"' % (k, t, d)
    if kids: ent += ", c: [%s]" % ", ".join('"%s"' % x for x in kids)
    lines.append(ent + " },")
block = BEGIN + "\n" + "\n".join(lines) + "\n" + END + "\n"

sp = "assets/sitemap.js"
s = open(sp, encoding="utf-8").read()
s = re.sub(r'  "04-checklists/": \{ t: "[^"]*", p: 1 \},\n', "", s)                 # 移除規劃中
s = re.sub(re.escape(BEGIN) + r".*?" + re.escape(END) + r"\n", "", s, flags=re.S)  # 移除舊區段
i = s.rindex("};")
head = s[:i].rstrip()
if not head.endswith(","): head += ","
s = head + "\n\n" + block + "};\n"
open(sp, "w", encoding="utf-8").write(s)

# ---------------------------------------------------------------- 來源頁回連
def add_ref(path, html_):
    c = open(path, encoding="utf-8").read()
    c = re.sub(r'<p id="cl-ref">.*?</p>\n?', "", c, flags=re.S)
    m = re.search(r'<section class="refs">', c)
    c = c[:m.start()] + html_ + "\n" + c[m.start():] if m else c.replace("</main>", html_ + "\n</main>", 1)
    open(path, "w", encoding="utf-8", newline="\n").write(c)

for sk in stages:
    slug = sk.split("/")[1]
    add_ref(file_of(sk), '<p id="cl-ref">📋 本階段彙整檢查清單：<a href="../../04-checklists/lifecycle/%s.html">%s檢查清單</a></p>' % (slug, SM[sk]["t"]))
add_ref("02-software/index.html", '<p id="cl-ref">📋 <a href="../04-checklists/technical/software.html">軟體與應用程式檢查清單（彙整）</a></p>')
add_ref("01-hardware/index.html", '<p id="cl-ref">📋 <a href="../04-checklists/technical/hardware.html">硬體與基礎設施檢查清單（彙整）</a></p>')

# ---------------------------------------------------------------- 首頁卡片
t = open("index.html", encoding="utf-8").read()
t = t.replace('<h3>04 檢查清單 <span class="tag">規劃中</span></h3>', '<h3><a href="./04-checklists/index.html">04 檢查清單</a> <span class="tag done">已完成</span></h3>')
for a, b in [("<li>上線前檢查表（可列印、可勾選）</li>", '<li><a href="./04-checklists/lifecycle/pre-release.html">上線前檢查表</a>（可列印、可勾選）</li>'),
             ("<li>每月/每季維運檢查表</li>", '<li><a href="./04-checklists/recurring.html">每月/每季維運檢查表</a></li>'),
             ("<li>新人/離職帳號權限檢查表</li>", '<li><a href="./04-checklists/accounts.html">新人/離職帳號權限檢查表</a></li>'),
             ("<li>客戶驗收用資安報告範本</li>", '<li><a href="./04-checklists/report-template.html">客戶驗收用資安報告範本</a></li>')]:
    t = t.replace(a, b)
open("index.html", "w", encoding="utf-8").write(t)

# ---------------------------------------------------------------- 檢查
bad = 0; n = 0
for dp, _, fs in os.walk("."):
    if "_build" in dp: continue
    for f in fs:
        if f.endswith(".html"):
            n += 1; fp = os.path.join(dp, f)
            for m in re.finditer(r'(?:href|src)="(\.[^"#]*)"', open(fp, encoding="utf-8").read()):
                if not os.path.exists(os.path.normpath(os.path.join(dp, m.group(1)))):
                    print("BROKEN", fp, m.group(1)); bad += 1
print("04-checklists：%d 頁；全站 %d 頁，壞連結 %d" % (len(REG), n, bad))
