// 名詞表（單一資料來源）：縮寫 → 全名、中文、簡介。
// 1) 內容頁：每個縮寫在頁面「第一次出現」時加上虛線底線與提示（滑鼠停留），頁底自動列出「本頁名詞」。
// 2) 名詞表頁（glossary.html）：由本資料產生，可搜尋。
// 新增名詞：在 DATA 加一行 [縮寫, 英文全名, 中文, 簡介, [別名…]]。別名也會被辨識（區分大小寫）。
(function () {
  var DATA = [
    // ---- 基本觀念 ----
    ["CIA", "Confidentiality, Integrity, Availability", "機密性、完整性、可用性", "資訊安全的三個基本目標：只有被授權者看得到、資料不被未授權竄改、需要時可以使用。（此處的 CIA 不是美國中央情報局）"],
    ["IR", "Incident Response", "事故應變", "發生資安事件時，偵測、遏止、根除、復原並檢討的一整套作法。"],
    ["RCA", "Root Cause Analysis", "根本原因分析", "追查事故背後真正的原因（流程或系統層面），而不只是表面現象，才能避免重複發生。"],
    ["PoC", "Proof of Concept", "概念驗證", "用最小的程式或步驟證明漏洞確實存在、可被重現。"],
    ["IOC", "Indicator of Compromise", "入侵指標", "代表系統可能已被入侵的線索，例如惡意 IP、網域、檔案雜湊值。"],
    ["APT", "Advanced Persistent Threat", "進階持續性威脅", "有組織、有資源、長期潛伏的針對性攻擊，常見於政府與關鍵基礎設施。"],
    ["RACI", "Responsible, Accountable, Consulted, Informed", "執行、最終負責、被諮詢、被告知", "分配責任的表格：每項工作標明誰執行(R)、誰最終負責(A)、誰被諮詢(C)、誰被告知(I)。"],
    ["NDA", "Non-Disclosure Agreement", "保密協議", "雙方約定對取得的機密資訊不得洩漏或挪作他用的合約。"],
    ["EOL", "End of Life", "停止支援", "軟體或硬體不再提供更新與安全修補的狀態，繼續使用風險高。"],
    ["DevOps", "Development and Operations", "開發維運一體", "讓開發與維運協作、以自動化交付軟體的作法。"],
    ["DevSecOps", "Development, Security and Operations", "開發、資安、維運一體", "把安全檢查（掃描、審查）內建在開發與部署流程中，而不是最後才做。"],
    ["CI", "Continuous Integration", "持續整合", "每次程式碼變更都自動建置與測試，及早發現問題。"],
    ["CD", "Continuous Delivery / Deployment", "持續交付／部署", "把通過測試的變更自動（或半自動）送到測試或正式環境。"],
    ["IaC", "Infrastructure as Code", "基礎設施即程式碼", "用程式碼描述與管理伺服器、網路等設定，使其可審查、可重現。"],
    ["CLI", "Command-Line Interface", "命令列介面", "以文字指令操作軟體的介面。"],
    ["PR", "Pull Request", "合併請求", "請其他人審查並合併程式碼變更的流程，是程式碼審查的主要入口。"],
    ["OS", "Operating System", "作業系統", "管理硬體與軟體資源的基礎軟體，如 Windows、Linux。"],
    ["CS", "Cheat Sheet", "速查表", "OWASP 提供的主題式實作指引（Cheat Sheet Series）。"],
    // ---- 攻擊與弱點 ----
    ["DDoS", "Distributed Denial of Service", "分散式阻斷服務攻擊", "攻擊者操控大量來源同時送出大量請求或流量，耗盡頻寬或運算資源，使正常使用者無法使用服務。常用 CDN、WAF 與流量清洗服務防護。", ["DoS"]],
    ["XSS", "Cross-Site Scripting", "跨站腳本攻擊", "把惡意腳本注入網頁，使其在其他使用者的瀏覽器中執行，可竊取登入狀態或竄改畫面。主要靠輸出編碼與 CSP 防禦。"],
    ["CSRF", "Cross-Site Request Forgery", "跨站請求偽造", "誘使已登入的使用者在不知情下送出非本意的請求（如改密碼、轉帳）。以 CSRF Token、SameSite Cookie 防禦。", ["XSRF"]],
    ["SSRF", "Server-Side Request Forgery", "伺服器端請求偽造", "誘使伺服器代替攻擊者去存取內部網路或雲端中繼資料等原本無法直接連到的資源。"],
    ["SQLi", "SQL Injection", "SQL 注入", "把惡意 SQL 語法塞進輸入，使資料庫執行非預期的查詢。以參數化查詢防禦。"],
    ["IDOR", "Insecure Direct Object Reference", "不安全的直接物件參照", "只靠可猜測的 ID 存取資料而沒檢查權限，使用者改個編號就看到別人的資料。屬於授權缺陷。"],
    ["BOLA", "Broken Object Level Authorization", "物件層級授權失效", "API 沒有逐筆檢查使用者是否有權存取該物件，等同 API 版的 IDOR，為 OWASP API Top 10 首位。"],
    ["BFLA", "Broken Function Level Authorization", "功能層級授權失效", "一般使用者能呼叫只有管理者才該用的 API 功能。"],
    ["CRLF", "Carriage Return Line Feed", "歸位與換行字元", "HTTP 標頭以此分行；若輸入未過濾，攻擊者可注入換行偽造標頭（CRLF 注入）。"],
    ["CAPTCHA", "Completely Automated Public Turing test to tell Computers and Humans Apart", "人機辨識測試", "要求使用者通過挑戰以區分真人與自動化程式，用來減緩暴力破解與濫用。"],
    ["SEO", "Search Engine Optimization", "搜尋引擎最佳化", "提升網站在搜尋結果排名的作法；攻擊者也會入侵網站植入垃圾內容（SEO 垃圾）。"],
    ["CVE", "Common Vulnerabilities and Exposures", "通用漏洞與暴露", "公開漏洞的標準編號（如 CVE-2024-12345），方便各方引用同一個漏洞。"],
    ["CVSS", "Common Vulnerability Scoring System", "通用漏洞評分系統", "以 0–10 分表示漏洞嚴重度（低、中、高、嚴重），常用來決定修補優先順序與時限。"],
    ["CWE", "Common Weakness Enumeration", "通用弱點列舉", "軟體弱點的分類編號（如 CWE-79 為 XSS），說明「哪一類」缺陷，而 CVE 是「哪一個」漏洞。"],
    ["KEV", "Known Exploited Vulnerabilities", "已知遭利用漏洞", "CISA 維護的清單，列出已確認被實際攻擊使用的漏洞，應優先修補。"],
    ["GHSA", "GitHub Security Advisory", "GitHub 安全公告", "GitHub 發布的漏洞公告資料庫，涵蓋各語言套件。"],
    ["OSV", "Open Source Vulnerabilities", "開源漏洞資料庫", "Google 維運的開源套件漏洞資料庫與格式，可用 osv-scanner 比對專案相依套件。"],
    ["STRIDE", "Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege", "STRIDE 威脅分類", "威脅建模常用的六類威脅：偽冒、竄改、否認、資訊洩漏、阻斷服務、提權。"],
    ["ATT&CK", "Adversarial Tactics, Techniques, and Common Knowledge", "對抗戰術與技術知識庫", "MITRE 整理的攻擊者戰術與技術矩陣，用於威脅建模與偵測規則設計。"],
    // ---- 標準與組織 ----
    ["OWASP", "Open Worldwide Application Security Project", "開放全球應用程式安全計畫", "非營利社群，提供 Top 10、ASVS、Cheat Sheet 等免費的應用程式安全資源。"],
    ["NIST", "National Institute of Standards and Technology", "美國國家標準與技術研究院", "發布資安框架與指引（CSF、SP 800 系列），國際廣泛引用。"],
    ["CIS", "Center for Internet Security", "網際網路安全中心", "發布 CIS Controls 與各種系統的 Benchmarks（組態基準）。"],
    ["CISA", "Cybersecurity and Infrastructure Security Agency", "美國網路安全暨基礎設施安全局", "美國政府機構，提供漏洞清單（KEV）、事故應變手冊與指引。"],
    ["ISO", "International Organization for Standardization", "國際標準化組織", "制定國際標準，其中 ISO/IEC 27001 為資訊安全管理體系標準。"],
    ["IEC", "International Electrotechnical Commission", "國際電工委員會", "與 ISO 共同制定 ISO/IEC 27001 等資訊技術標準。"],
    ["CNS", "Chinese National Standards", "中華民國國家標準", "台灣的國家標準；CNS 27001 對應 ISO/IEC 27001。"],
    ["PCI DSS", "Payment Card Industry Data Security Standard", "支付卡產業資料安全標準", "儲存、處理、傳輸信用卡資料的實體必須遵循的安全要求。", ["PCI", "DSS"]],
    ["SSC", "Security Standards Council", "（PCI）安全標準委員會", "PCI SSC，負責制定與維護 PCI DSS 等支付卡安全標準的組織。"],
    ["GDPR", "General Data Protection Regulation", "一般資料保護規則", "歐盟的個資保護法規，對處理歐盟居民個資者有域外效力，罰則嚴格。"],
    ["EDPB", "European Data Protection Board", "歐洲資料保護委員會", "歐盟的個資保護主管機關協調組織，發布 GDPR 解釋指引。"],
    ["SANS", "SysAdmin, Audit, Network, and Security Institute", "SANS 研究所", "資安培訓與研究機構，其事故處理手冊被廣泛引用。"],
    ["MITRE", "MITRE Corporation", "MITRE 公司", "非營利研究機構，維護 CVE、CWE 與 ATT&CK。"],
    ["FIRST", "Forum of Incident Response and Security Teams", "事故應變與安全團隊論壇", "全球資安事故應變團隊的國際組織，也是 CVSS 的維護者。"],
    ["CSA", "Cloud Security Alliance", "雲端安全聯盟", "提供雲端安全指引與 CAIQ 問卷。"],
    ["CAIQ", "Consensus Assessments Initiative Questionnaire", "共識評估問卷", "CSA 的標準資安問卷，用來評估雲端服務供應商。"],
    ["CERT", "Computer Emergency Response Team", "電腦緊急應變小組", "負責協調資安事件通報與處理的團隊。"],
    ["CSRC", "Computer Security Resource Center", "電腦安全資源中心", "NIST 的資安出版品與資源網站（csrc.nist.gov）。"],
    ["DBIR", "Data Breach Investigations Report", "資料外洩調查報告", "Verizon 每年發布的資料外洩統計報告。"],
    ["MDN", "Mozilla Developer Network", "Mozilla 開發者網路", "Mozilla 維護的 Web 技術文件，是瀏覽器行為與標頭的常用參考。"],
    ["RFC", "Request for Comments", "徵求意見稿", "網際網路協定與規範的正式文件系列（如 RFC 3227 證據收集）。"],
    ["ASVS", "Application Security Verification Standard", "應用程式安全驗證標準", "OWASP 的安全需求清單，分 L1／L2／L3 三個驗證等級，可作為設計與測試的依據。"],
    ["SAMM", "Software Assurance Maturity Model", "軟體保證成熟度模型", "OWASP 用來評估與改善組織軟體安全實務成熟度的模型。"],
    ["WSTG", "Web Security Testing Guide", "網站安全測試指南", "OWASP 的網站滲透測試方法與項目指引。"],
    ["MASVS", "Mobile Application Security Verification Standard", "行動應用程式安全驗證標準", "OWASP 針對行動 App 的安全驗證標準。"],
    ["SCVS", "Software Component Verification Standard", "軟體元件驗證標準", "OWASP 針對軟體元件與供應鏈安全的驗證標準。"],
    ["SSDF", "Secure Software Development Framework", "安全軟體開發框架", "NIST SP 800-218，描述安全開發的實務，分 PO、PS、PW、RV 四組。"],
    ["PO", "Prepare the Organization", "準備組織", "SSDF 四組實務之一：建立人員、流程、工具等安全開發的基礎。"],
    ["PS", "Protect the Software", "保護軟體", "SSDF 四組實務之一：保護程式碼與發行物不被竄改。"],
    ["PW", "Produce Well-Secured Software", "產出安全的軟體", "SSDF 四組實務之一：設計、開發、審查與測試時的安全作法。"],
    ["RV", "Respond to Vulnerabilities", "回應漏洞", "SSDF 四組實務之一：識別並修補漏洞、分析根因。"],
    ["CSF", "Cybersecurity Framework", "網路安全框架", "NIST CSF 2.0：以治理、識別、保護、偵測、回應、復原六項功能組織資安工作。"],
    ["SP", "Special Publication", "特別出版品", "NIST 的技術指引系列（如 SP 800-61 事故應變），800 系列專門談資安。"],
    ["ISMS", "Information Security Management System", "資訊安全管理系統", "ISO/IEC 27001 要求建立的管理體系：政策、風險管理、控制措施與持續改善。"],
    ["PDCA", "Plan-Do-Check-Act", "計畫－執行－查核－行動", "持續改善的循環，ISO 管理體系的基本運作方式。"],
    ["SoA", "Statement of Applicability", "適用性聲明", "ISO/IEC 27001 文件，說明哪些控制措施適用、是否已實施及理由。"],
    ["PTES", "Penetration Testing Execution Standard", "滲透測試執行標準", "描述滲透測試各階段的方法論。"],
    ["SLSA", "Supply-chain Levels for Software Artifacts", "軟體產出物供應鏈等級", "評估與提升軟體建置供應鏈完整性的框架（讀作 salsa）。"],
    ["FIPS", "Federal Information Processing Standards", "聯邦資訊處理標準", "美國政府標準，其中 FIPS 140 規範密碼模組驗證。"],
    ["IG1", "Implementation Group 1", "實施群組 1", "CIS Controls 的基礎防護子集，適合資源有限的小型組織。", ["IG2", "IG3"]],
    // ---- 網路與通訊 ----
    ["API", "Application Programming Interface", "應用程式介面", "程式之間互相呼叫功能與資料的介面，網站前後端與第三方整合都靠它。"],
    ["REST", "Representational State Transfer", "表現層狀態轉移", "常見的 Web API 風格，以 HTTP 方法操作資源。"],
    ["RPC", "Remote Procedure Call", "遠端程序呼叫", "呼叫遠端服務像呼叫本機函式的通訊方式（如 gRPC）。"],
    ["HTTP", "HyperText Transfer Protocol", "超文字傳輸協定", "瀏覽器與伺服器通訊的協定，明文傳輸。"],
    ["HTTPS", "HTTP Secure", "安全超文字傳輸協定", "在 HTTP 上加上 TLS 加密，保護傳輸內容不被竊聽與竄改。"],
    ["TLS", "Transport Layer Security", "傳輸層安全性", "加密網路傳輸的協定，HTTPS 的基礎，應停用舊版（SSLv3、TLS 1.0／1.1）。"],
    ["SSL", "Secure Sockets Layer", "安全通訊協定層", "TLS 的前身，已不安全；現在常以 SSL 泛稱憑證與加密連線。", ["SSLv3"]],
    ["HSTS", "HTTP Strict Transport Security", "HTTP 嚴格傳輸安全", "透過標頭要求瀏覽器日後只用 HTTPS 連線，防止降級攻擊。"],
    ["CSP", "Content Security Policy", "內容安全政策", "用標頭限制頁面可載入與執行的資源來源，是防禦 XSS 的重要縱深措施。"],
    ["CORS", "Cross-Origin Resource Sharing", "跨來源資源共用", "規範網頁可否向不同來源的伺服器發送請求；設太寬會讓他站讀取你的資料。"],
    ["SRI", "Subresource Integrity", "子資源完整性", "在載入第三方腳本時附上雜湊值，內容被竄改瀏覽器就拒絕執行。"],
    ["HttpOnly", "HttpOnly cookie attribute", "HttpOnly 屬性", "Cookie 屬性：使 JavaScript 讀不到該 Cookie，降低 XSS 竊取工作階段的風險。"],
    ["SameSite", "SameSite cookie attribute", "SameSite 屬性", "Cookie 屬性：限制跨站請求是否附帶 Cookie，可防禦大部分 CSRF。"],
    ["MIME", "Multipurpose Internet Mail Extensions", "多用途網際網路郵件擴充", "用來標示內容類型（Content-Type）；錯誤的類型判斷會造成安全問題。"],
    ["URL", "Uniform Resource Locator", "統一資源定位符", "網址。"],
    ["DNS", "Domain Name System", "網域名稱系統", "把網域名稱轉成 IP 位址；DNS 帳號被盜可導致整站被劫持。"],
    ["IP", "Internet Protocol (address)", "網際網路協定（位址）", "網路上裝置的位址，常用於封鎖、限流與稽核。"],
    ["ISP", "Internet Service Provider", "網際網路服務提供者", "提供上網服務的業者。"],
    ["CDN", "Content Delivery Network", "內容傳遞網路", "把內容快取在全球節點加速存取，並可吸收 DDoS 流量、隱藏原站。"],
    ["WAF", "Web Application Firewall", "網頁應用程式防火牆", "位於網站前面，過濾惡意 HTTP 請求（注入、XSS、機器人）的防火牆。"],
    ["IPS", "Intrusion Prevention System", "入侵防禦系統", "偵測並主動阻擋可疑網路行為的設備或服務。"],
    ["VPN", "Virtual Private Network", "虛擬私人網路", "在公共網路上建立加密通道，讓遠端人員安全連回內部網路。"],
    ["ZTNA", "Zero Trust Network Access", "零信任網路存取", "不因為在內網就信任，而是依身分、裝置狀態逐一授權存取特定應用。"],
    ["IPsec", "Internet Protocol Security", "網際網路協定安全", "在 IP 層加密與認證的協定組，常用於站對站 VPN。", ["IKEv2"]],
    ["VLAN", "Virtual Local Area Network", "虛擬區域網路", "在同一實體網路中邏輯切分出多個隔離網段。"],
    ["DMZ", "Demilitarized Zone", "非軍事區", "介於外網與內網之間的隔離區，放置對外服務的主機。"],
    ["VPC", "Virtual Private Cloud", "虛擬私有雲", "雲端中邏輯隔離的專屬網路。"],
    ["SSH", "Secure Shell", "安全外殼協定", "加密的遠端登入與檔案傳輸協定；建議用金鑰驗證並限制來源。", ["OpenSSH"]],
    ["RDP", "Remote Desktop Protocol", "遠端桌面協定", "Windows 遠端桌面；直接暴露在網際網路是勒索軟體的常見入口。"],
    ["NLA", "Network Level Authentication", "網路層級驗證", "RDP 的功能：先驗證使用者才建立遠端桌面連線，減少攻擊面。"],
    ["FTP", "File Transfer Protocol", "檔案傳輸協定", "明文傳輸的舊協定，應改用 SFTP 或 FTPS。"],
    ["LDAP", "Lightweight Directory Access Protocol", "輕量目錄存取協定", "查詢與驗證目錄服務（如 Active Directory）的協定；需防範 LDAP 注入。"],
    ["SMBv1", "Server Message Block version 1", "SMB 第一版", "舊版檔案共享協定，有嚴重漏洞，應停用。"],
    ["JSON", "JavaScript Object Notation", "JavaScript 物件表示法", "常用的資料交換格式。"],
    ["HTML", "HyperText Markup Language", "超文字標記語言", "網頁的結構語言。"],
    ["DOM", "Document Object Model", "文件物件模型", "瀏覽器把網頁表示為樹狀結構的介面；DOM 型 XSS 就是在此被操縱。"],
    ["AJAX", "Asynchronous JavaScript and XML", "非同步 JavaScript 與 XML", "網頁在背景向伺服器取資料而不重新整理的技術。"],
    ["SPA", "Single-Page Application", "單頁應用程式", "只載入一次頁面，後續以 API 更新畫面的前端架構。"],
    ["TTL", "Time To Live", "存活時間", "資料（如 DNS 記錄、快取、權杖）可被保留的時間長度。"],
    // ---- 身分與密碼學 ----
    ["IAM", "Identity and Access Management", "身分與存取管理", "管理誰能以什麼身分、存取哪些資源的機制與政策。"],
    ["MFA", "Multi-Factor Authentication", "多因素驗證", "除密碼外再要求第二種憑證（如動態碼、安全金鑰），能阻擋多數帳號盜用。"],
    ["SSO", "Single Sign-On", "單一登入", "登入一次即可使用多個系統。"],
    ["RBAC", "Role-Based Access Control", "角色為基礎的存取控制", "依角色分配權限的授權模型。"],
    ["ABAC", "Attribute-Based Access Control", "屬性為基礎的存取控制", "依使用者、資源、環境屬性動態判斷授權的模型，比 RBAC 更細緻。"],
    ["JWT", "JSON Web Token", "JSON 網路權杖", "帶有簽章、可攜帶身分與權限聲明的權杖；需驗證簽章與到期，不應存放機敏資料。"],
    ["OAuth", "Open Authorization", "開放授權", "讓第三方在不取得密碼的前提下，取得有限存取權的授權協定。"],
    ["OIDC", "OpenID Connect", "OpenID Connect", "建立在 OAuth 2.0 之上的身分驗證協定。"],
    ["LAPS", "Local Administrator Password Solution", "本機管理員密碼解決方案", "為每台電腦自動產生並輪替獨一無二的本機管理員密碼。"],
    ["SHA", "Secure Hash Algorithm", "安全雜湊演算法", "雜湊函式家族（如 SHA-256）；單純 SHA 不適合直接儲存密碼，需用專用的密碼雜湊。", ["SHA256", "MD5"]],
    ["HMAC", "Hash-based Message Authentication Code", "雜湊訊息驗證碼", "以密鑰與雜湊函式產生，用於驗證訊息完整性與來源。"],
    ["PBKDF2", "Password-Based Key Derivation Function 2", "以密碼為基礎的金鑰衍生函式 2", "刻意放慢的密碼雜湊方式，以迭代次數提高暴力破解成本。"],
    ["Argon2", "Argon2 password hashing", "Argon2 密碼雜湊", "密碼雜湊競賽的優勝演算法，同時耗用記憶體與運算，建議用於新系統（Argon2id）。", ["Argon2id"]],
    ["ECDHE", "Elliptic-Curve Diffie-Hellman Ephemeral", "橢圓曲線臨時迪菲-赫爾曼", "TLS 的金鑰交換方式，提供前向保密：金鑰日後外洩也無法解開過去的流量。"],
    ["CA", "Certificate Authority", "憑證授權中心", "簽發並背書數位憑證的機構。"],
    ["CVV", "Card Verification Value", "信用卡驗證碼", "卡片背面的驗證碼；PCI DSS 禁止在授權後儲存。"],
    ["TPM", "Trusted Platform Module", "信賴平台模組", "主機板上儲存金鑰的安全晶片，用於磁碟加密與開機完整性。"],
    ["UEFI", "Unified Extensible Firmware Interface", "統一可延伸韌體介面", "取代 BIOS 的開機韌體，支援安全啟動（Secure Boot）。"],
    ["BIOS", "Basic Input/Output System", "基本輸入輸出系統", "傳統的開機韌體；應設密碼並保持更新。"],
    ["BMC", "Baseboard Management Controller", "基板管理控制器", "伺服器內獨立的遠端管理晶片（如 iDRAC、iLO），其管理介面不可暴露於網際網路。", ["IPMI"]],
    ["LUKS", "Linux Unified Key Setup", "Linux 統一金鑰設定", "Linux 的標準磁碟加密格式。"],
    ["MDM", "Mobile Device Management", "行動裝置管理", "集中管理與設定筆電、手機的政策、加密與遠端清除。"],
    ["BYOD", "Bring Your Own Device", "自帶裝置", "員工使用個人裝置處理公務，需要額外的管控。"],
    ["EDR", "Endpoint Detection and Response", "端點偵測與回應", "持續監控端點行為、偵測並隔離威脅的資安工具。"],
    ["SIEM", "Security Information and Event Management", "資安資訊與事件管理", "集中收集並關聯分析各處日誌，產生告警的系統。"],
    ["SOC", "Security Operations Center", "資安監控中心", "專責 24x7 監控與處理資安告警的團隊或單位。"],
    ["UPS", "Uninterruptible Power Supply", "不斷電系統", "停電時暫時供電，讓設備能正常關機或切換發電機。"],
    ["RAID", "Redundant Array of Independent Disks", "容錯式磁碟陣列", "用多顆硬碟提高可用性或效能；RAID 不是備份。"],
    ["SSD", "Solid-State Drive", "固態硬碟", "以快閃記憶體儲存的硬碟；報廢時需用適合的方法清除資料。"],
    ["USB", "Universal Serial Bus", "通用序列匯流排", "常見的外接介面；隨身碟是資料外洩與惡意程式的入口。"],
    ["CPU", "Central Processing Unit", "中央處理器", "電腦的運算核心。"],
    // ---- 測試與供應鏈 ----
    ["SAST", "Static Application Security Testing", "靜態應用程式安全測試", "不執行程式，直接分析原始碼找出弱點；適合早期、整合在 CI。"],
    ["DAST", "Dynamic Application Security Testing", "動態應用程式安全測試", "對運行中的網站模擬攻擊，從外部找出弱點。"],
    ["IAST", "Interactive Application Security Testing", "互動式應用程式安全測試", "在應用程式運行時以內部探針觀察，結合 SAST 與 DAST 的優點。"],
    ["SCA", "Software Composition Analysis", "軟體組成分析", "盤點專案使用的第三方套件並比對已知漏洞與授權。"],
    ["SBOM", "Software Bill of Materials", "軟體物料清單", "列出軟體包含哪些元件與版本的清單（常見格式 CycloneDX、SPDX），用於快速判斷受漏洞影響範圍。", ["CycloneDX", "SPDX"]],
    ["ORM", "Object-Relational Mapping", "物件關聯對映", "用物件操作資料庫的程式庫（如 EF、Hibernate），預設使用參數化查詢，但原生 SQL 仍需小心。"],
    ["SQL", "Structured Query Language", "結構化查詢語言", "關聯式資料庫的查詢語言。"],
    ["NoSQL", "Not only SQL", "非關聯式資料庫", "如 MongoDB 的資料庫類型；同樣有注入風險。"],
    ["DDL", "Data Definition Language", "資料定義語言", "CREATE、ALTER、DROP 等修改資料庫結構的語法。"],
    ["DML", "Data Manipulation Language", "資料操作語言", "SELECT、INSERT、UPDATE、DELETE 等操作資料的語法。"],
    ["DBA", "Database Administrator", "資料庫管理員", "負責資料庫維運與權限的人員。"],
    ["DTO", "Data Transfer Object", "資料傳輸物件", "只含需要傳輸欄位的物件；可避免意外暴露內部欄位或被大量賦值。"],
    ["EF", "Entity Framework", "Entity Framework", ".NET 的 ORM 框架。"],
    ["PDO", "PHP Data Objects", "PHP 資料物件", "PHP 的資料庫存取介面，支援參數化查詢。"],
    ["S3", "Simple Storage Service", "簡單儲存服務", "AWS 的物件儲存服務；儲存桶公開設定錯誤是常見外洩原因。"],
    ["AWS", "Amazon Web Services", "亞馬遜雲端服務", "主流的雲端平台之一。"],
    ["GCP", "Google Cloud Platform", "Google 雲端平台", "Google 的雲端服務。"],
    ["IaaS", "Infrastructure as a Service", "基礎設施即服務", "雲端提供虛擬主機與網路，作業系統以上由使用者負責。"],
    ["PaaS", "Platform as a Service", "平台即服務", "雲端提供執行平台，使用者只管程式與資料。"],
    ["SaaS", "Software as a Service", "軟體即服務", "雲端直接提供完整應用，使用者只管帳號與資料。"],
    // ---- 營運與合約 ----
    ["SLA", "Service Level Agreement", "服務水準協議", "對客戶的合約承諾（可用性、回應時間等）及未達成時的補償。"],
    ["SLO", "Service Level Objective", "服務水準目標", "內部設定的服務目標（如每月 99.9% 可用），通常比 SLA 嚴格以留緩衝。"],
    ["SLI", "Service Level Indicator", "服務水準指標", "實際量測到的數值（如成功請求比例、延遲），用來判斷是否達成 SLO。"],
    ["SRE", "Site Reliability Engineering", "網站可靠性工程", "Google 提出的以工程方法維運服務可靠性的作法。"],
    ["RTO", "Recovery Time Objective", "復原時間目標", "災難發生後，服務最長可接受多久內恢復。"],
    ["RPO", "Recovery Point Objective", "復原點目標", "最多可接受遺失多長時間內的資料，決定備份頻率。"],
    ["DR", "Disaster Recovery", "災難復原", "發生重大災害時，恢復系統與資料的計畫與能力。"],
    ["TIA", "Telecommunications Industry Association", "電信產業協會", "TIA-942 為資料中心的基礎設施標準（Tier 分級）。"]
  ];

  var MAP = {}, ENTRIES = [], keys = [];
  DATA.forEach(function (r) {
    var e = { k: r[0], en: r[1], zh: r[2], d: r[3], alias: r[4] || [] };
    ENTRIES.push(e); MAP[e.k] = e; keys.push(e.k);
    e.alias.forEach(function (a) { MAP[a] = e; keys.push(a); });
  });
  window.GLOSSARY = ENTRIES;
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function tip(e) { return e.k + "：" + e.en + "（" + e.zh + "）— " + e.d; }

  // ---- 名詞表頁 ----
  var list = document.getElementById("glossary-list");
  if (list) {
    var q = el("input"); q.type = "search"; q.placeholder = "搜尋縮寫、英文或中文…"; q.className = "gl-q"; q.setAttribute("aria-label", "搜尋名詞");
    var cnt = el("p", "sub");
    var wrap = el("div", "tw"), tb = el("table"), head = el("tr");
    ["縮寫", "全名", "中文", "簡介"].forEach(function (h) { head.appendChild(el("th", "", h)); });
    tb.appendChild(head);
    var rows = ENTRIES.slice().sort(function (a, b) { return a.k.toLowerCase() < b.k.toLowerCase() ? -1 : 1; }).map(function (e) {
      var tr = el("tr"); tr.id = "t-" + e.k.replace(/[^A-Za-z0-9]/g, "_");
      var c0 = el("td"); c0.appendChild(el("b", "", e.k)); if (e.alias.length) c0.appendChild(el("div", "sub", "又稱 " + e.alias.join("、")));
      tr.appendChild(c0); tr.appendChild(el("td", "", e.en)); tr.appendChild(el("td", "", e.zh)); tr.appendChild(el("td", "", e.d));
      tr._s = (e.k + " " + e.alias.join(" ") + " " + e.en + " " + e.zh + " " + e.d).toLowerCase();
      tb.appendChild(tr); return tr;
    });
    wrap.appendChild(tb); list.appendChild(q); list.appendChild(cnt); list.appendChild(wrap);
    function filt() { var s = q.value.trim().toLowerCase(), n = 0; rows.forEach(function (r) { var ok = !s || r._s.indexOf(s) >= 0; r.hidden = !ok; if (ok) n++; }); cnt.textContent = "共 " + n + " 個名詞"; }
    q.addEventListener("input", filt); filt();
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) { t.classList.add("hit"); t.scrollIntoView(); } }
    return;
  }

  // ---- 內容頁：標註首次出現 + 頁底「本頁名詞」----
  var main = document.querySelector("main"); if (!main) return;
  keys.sort(function (a, b) { return b.length - a.length; });
  var re = new RegExp("(^|[^A-Za-z0-9_-])(" + keys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")(?![A-Za-z0-9_])", "g");
  var SKIP = "pre,code,script,style,textarea,abbr,h1,h2,h3,h4,.tech,.clbar,.cl-print,#crumb,#children,.terms,.techbar,input,button,select,option,label.noabbr";
  var seen = {}, order = [];
  var walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      if (!n.nodeValue || !/[A-Z]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      var p = n.parentNode; if (p && p.closest && p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(function (n) {
    var s = n.nodeValue, last = 0, frag = null, m; re.lastIndex = 0;
    while ((m = re.exec(s))) {
      var e = MAP[m[2]]; if (!e || seen[e.k]) continue;
      seen[e.k] = 1; order.push(e);
      var st = m.index + m[1].length;
      if (!frag) frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode(s.slice(last, st)));
      var ab = el("abbr", "ab", m[2]); ab.title = tip(e); frag.appendChild(ab);
      last = st + m[2].length;
    }
    if (frag) { frag.appendChild(document.createTextNode(s.slice(last))); n.parentNode.replaceChild(frag, n); }
  });
  if (!order.length) return;
  var root = (function () { var s = document.querySelector('script[src$="assets/glossary.js"]'); return s ? s.getAttribute("src").replace(/assets\/glossary\.js$/, "") : ""; })();
  var box = el("section", "terms"), det = el("details"), sm = el("summary", "", "本頁名詞（" + order.length + "）");
  det.open = order.length <= 12; det.appendChild(sm);
  order.forEach(function (e) {
    var d = el("div", "term"), h = el("div", "th");
    h.appendChild(el("b", "", e.k)); h.appendChild(el("span", "", e.en + "・" + e.zh));
    d.appendChild(h); d.appendChild(el("p", "", e.d)); det.appendChild(d);
  });
  var more = el("p", "sub"), a = el("a", "", "查看完整名詞表"); a.href = root + "00-overview/glossary.html"; more.appendChild(a); det.appendChild(more);
  box.appendChild(det);
  var refs = main.querySelector("section.refs");
  if (refs) main.insertBefore(box, refs); else main.appendChild(box);
})();
