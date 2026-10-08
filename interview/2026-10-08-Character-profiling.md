# 2026-10-08 人物側寫

## 一、整體定位

> **中高階 .NET / Full Stack Developer**，偏企業系統、API、微服務與系統整合，同時具備 DevOps、Cloud、Database 與 AI/LLM 架構思維。

| 項目 | 說明 |
|---|---|
| 技術角色 | Senior .NET Full Stack / Solution Developer，明顯偏 Backend / Architecture |
| 能力概括 | 企業系統開發 + 架構設計 + 系統整合 + DevOps + 自動化 |
| 前端定位 | 企業系統型 Full Stack，非前端框架導向的 Frontend Engineer |
| 運維定位 | Application Developer + 部署 / K8s 維運能力，非純 DevOps Engineer |
| 目前方向 | 企業系統 + LLM / AI Architecture（與原技術棧高度銜接） |

---

## 二、技能熟悉度總覽

### 1. 程式語言

| 技術 | 熟悉度 | 判斷依據 |
|---|---|---|
| C# | ⭐⭐⭐⭐⭐ | ASP.NET Core、EF Core、Middleware、DI、Attribute、HttpClient、GraphQL |
| SQL | ⭐⭐⭐⭐⭐ | MSSQL / PostgreSQL、UPDATE、JOIN、Migration、Index、Transaction |
| jQuery | ⭐⭐⭐⭐⭐ | UI / AJAX / Plugin / DOM 操作 |
| Batch / BAT | ⭐⭐⭐⭐⭐ | 多支 Windows 自動化腳本 |
| JSON | ⭐⭐⭐⭐⭐ | API、Postman、Dynamic Object、設定檔 |
| JavaScript | ⭐⭐⭐⭐ | jQuery、AJAX、Postman Script、ES Module、前端元件 |
| HTML / CSS | ⭐⭐⭐⭐ | Bootstrap、Swagger UI、自訂 UI |
| YAML | ⭐⭐⭐⭐ | Docker / Kubernetes / Helm / Azure 部署 |

### 2. 各領域熟悉度

<table>
<thead><tr><th>分類</th><th>領域</th><th>熟悉度</th></tr></thead>
<tbody>
<tr><td rowspan="5"><b>後端</b></td><td>C# / .NET</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>ASP.NET Core</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>EF Core</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>REST API</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td>GraphQL</td><td>⭐⭐⭐</td></tr>
<tr><td rowspan="2"><b>前端 / 元件</b></td><td>jQuery / Bootstrap</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>JavaScript</td><td>⭐⭐⭐⭐</td></tr>
<tr><td rowspan="1"><b>資料庫</b></td><td>SQL Server</td><td>⭐⭐⭐⭐⭐</td></tr>
<tr><td rowspan="4"><b>架構</b></td><td>Microservices</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>Distributed System</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>Redis / Cache</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>RabbitMQ / Service Bus</td><td>⭐⭐⭐</td></tr>
<tr><td rowspan="4"><b>DevOps</b></td><td>Docker</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>Kubernetes / AKS</td><td>⭐⭐⭐</td></tr>
<tr><td>Git / CI/CD</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>IIS / Windows</td><td>⭐⭐⭐⭐</td></tr>
<tr><td rowspan="2"><b>雲端</b></td><td>Azure</td><td>⭐⭐⭐⭐</td></tr>
<tr><td>AWS</td><td>⭐⭐～⭐⭐⭐</td></tr>
<tr><td rowspan="3"><b>AI</b></td><td>AI / LLM Architecture</td><td>⭐⭐⭐（快速成長中）</td></tr>
<tr><td>Prompt Engineering</td><td>⭐⭐⭐</td></tr>
<tr><td>RAG / Vector DB</td><td>⭐⭐～⭐⭐⭐</td></tr>
</tbody>
</table>

---

## 三、後端與架構

### 3. .NET / ASP.NET Core（最核心領域）

| 類別 | 內容 |
|---|---|
| 版本 | .NET 6 / 8 / 9，關注 .NET 10 |
| 框架 | ASP.NET Core MVC、Web API |
| 核心機制 | Dependency Injection、Middleware、Filters / Attributes、Model Binding、Configuration、Options Pattern |
| HTTP 相關 | IHttpContextAccessor、IHttpClientFactory |
| 關注的架構議題 | 共用 Middleware、ApiAccessMonitoringAttribute、Controller / GraphQL 共用監控、Identity Header propagation、Named HttpClient、Handler、Service Layer、Shared Module |
| 評價 | 問題層次已非「怎麼用」，而是「怎麼抽象化、共用化、避免耦合」，架構設計相當熟 |

### 4. ORM / 資料庫

| 類別 | 內容 |
|---|---|
| EF Core 版本 | EF Core 6 / 8 |
| EF Core 實務 | Migration、ApplyConfigurationsFromAssembly、`IEntityTypeConfiguration<T>`、Composite Unique Index、Enum → String、HiLo、Migration Class Library、EF Tools / Runtime 版本不一致、Transaction、DbContext、LINQ |
| EF Core 層次 | 關注「大型專案如何組織」，而非單純 CRUD |
| SQL Server（主力） | JOIN、UPDATE FROM、SELECT → UPDATE、Transaction、Index / Constraint、Migration、DateTimeOffset、Timezone（+00:00 → +08:00） |
| 進階議題 | 高併發、Distributed Lock、DB-based Lock、多 Service / 多 Pod、OrganizationId / Multi-Tenant 資料 |
| PostgreSQL | 具備實務經驗 / 架構需求 |

### 5. Web API 與系統整合

| 類別 | 內容 |
|---|---|
| 技術 | REST API、HTTP GET / POST、HttpClient、IHttpClientFactory、Named HttpClient、DelegatingHandler、Middleware、Header propagation、JSON、Authentication / Identity Header |
| 文件 / 測試工具 | Swagger / OpenAPI、Postman |
| 典型架構 | `Controller → Middleware / Filter → Service → HttpClient → Other Service` |
| 身分傳遞 | `IdentityInfo → HTTP Header → Service A → Service B` |
| 評價 | 典型企業微服務整合思維 |

### 6. Microservices / GraphQL / 訊息佇列

| 主題 | 內容 | 評價 |
|---|---|---|
| Microservices | 多服務、Service-to-Service HTTP、Identity propagation、Middleware、Shared Module、Multi-DB、Multi-Tenant、Kubernetes Pod、API Gateway 概念 | 有實際維護 / 開發微服務系統的經驗 |
| GraphQL | HotChocolate、Query Resolver、DataLoader、DataAdapterViewModel、Dynamic Object / JSON、Resolver 監控、Controller / GraphQL 共用架構 | 系統應為 REST + GraphQL 並存 |
| Message Queue | RabbitMQ、Azure Service Bus；Service 間通訊、非同步處理、Queue、Event、Retry、Background Processing | 具一定 Event-driven architecture 經驗 |

### 7. 快取與分散式系統

| 主題 | 內容 | 評價 |
|---|---|---|
| Cache | Redis、IMemoryCache；自製 `PersonProfileHelper`（`GetOrAddAsync<T>()`、`QueryOrAddListAsync<T>()`、`SemaphoreSlim`） | 思考 Cache Miss 時避免大量 Request 同時打 DB（Cache Stampede / Concurrent Request / Lock） |
| Distributed Lock | 以 DB Table（OrganizationId、Name、ExpireTime）實作；考量多 Pod / 多 Service / 多 DB、Retry、Wait、Expiration、高併發；比較 DB Table Lock vs SQL Server `sp_getapplock` | 最能代表技術程度的一塊，屬典型 Distributed System Engineering |
| Background Job | Hangfire：Background / Scheduled Job、Retry、Job Dashboard、Server | 有實際使用 / 設計需求 |

---

## 四、前端與工具

### 8. Frontend

| 類別 | 內容 |
|---|---|
| 主要技術 | jQuery（非常熟）、Bootstrap 5（大量使用）、jQuery UI 1.13.2（DatePicker、Dropdown、Custom UI） |
| 日期處理 | Day.js、ROC / 台灣日期、自訂 DateTimePicker |
| 自製元件 | `dateTimePickerTw`、`hierarchyThreeLayers`、`hierarchyTwoLayers`、`fileUploadUI`、`uiVerifier` |
| 評價 | 應有自己的 Frontend Shared Component / JS Utility Library |

### 9. API 文件與測試

| 工具 | 內容 | 評價 |
|---|---|---|
| Swagger / OpenAPI | 修改 Swagger UI、API Version、Endpoint、Dropdown、Token Check、自訂 UI、Download URL、Version URL（如 `/identity/swagger/index.html`、`/identity/swagger/V1.1-MinTai21/index.html`） | 能客製 Swagger UI / OpenAPI 導航與企業內部 API 文件系統 |
| Postman | Request、After Response Script、JavaScript、Console、JSON parsing、Sort、日期計算（如「最後更新時間」「幾分鐘前」） | 日常 API 開發工具之一 |

### 10. 文件、PDF、檔案與通知

| 類別 | 技術 | 內容 / 範疇 |
|---|---|---|
| Excel / Office | NPOI、MiniExcel、OpenXML、Telerik（RadFlowDocument、RadRichTextBox） | Excel 匯入匯出、資料處理、Office 文件操作、企業文件產生 / Office Automation |
| PDF / 瀏覽器 | PuppeteerSharp、WebView2、wkhtmltopdf | HTML → PDF、Browser Rendering、Automated Browser |
| 檔案傳輸 | FluentFTP | FTP / SFTP 類需求、檔案上傳下載、自動化檔案交換 |
| 推播通知 | Azure Notification Hubs、APNs（.p8）、FCM V1 | Device Token、Push Notification、Badge、NavigateType、NavigateKey、Custom Action；偏向直接 Device Token Push，而非單純 Broadcast |

### 11. 開發工具

| 類別 | 工具 |
|---|---|
| IDE / 編輯器 | Visual Studio 2022、VS Code |
| API 工具 | Postman、Swagger UI |
| 版本控制 | TortoiseGit、Git for Windows |
| 容器 / 排程 | Docker Desktop、Windows Task Scheduler |

### 12. 其他接觸過的技術

| 類別 | 技術 |
|---|---|
| 設計模式 / 函式庫 | MediatR、Autofac、Mapster |
| 多語系 | IStringLocalizer、Localization |
| 即時通訊 | SignalR |
| 通知 | Azure Notification Hubs、APNs、FCM |
| 檔案 / 文件 | FluentFTP、Telerik、PuppeteerSharp、WebView2、wkhtmltopdf |
| 基礎設施 | Redis、RabbitMQ、Azure Service Bus、Qdrant |

---

## 五、雲端與 DevOps

### 13. Cloud

| 平台 | 熟悉度 | 內容 |
|---|---|---|
| Azure | ⭐⭐⭐⭐（實際接觸程度高） | App Service、Container Registry（ACR，如 `ghg2acr.azurecr.io`）、AKS、Service Bus、Notification Hubs、Azure DevOps、Helm；AKS namespace: `qa`、nodeSelector |
| AWS | ⭐⭐～⭐⭐⭐（低於 Azure） | EC2；Public IP 於 Restart 後改變、AWS Hostname、固定 DNS / Host、與 App Service 類服務比較 |

### 14. 容器與 Kubernetes

| 主題 | 內容 | 評價 |
|---|---|---|
| Docker | Docker、Docker Compose；環境含 Qdrant、MSSQL、RabbitMQ、Redis、API Containers | 非看過教學而已，形成 `Dev Environment → Docker Compose → Multiple Services` |
| Kubernetes | AKS、Helm、Pod、namespace（qa）、nodeSelector（`ghg-pod: yes`） | 具 Application Developer + Deployment / K8s 維運能力 |

### 15. 部署、版控與自動化

| 主題 | 內容 | 評價 |
|---|---|---|
| IIS / Windows Server | IIS、IIS Express、Windows Server、ASP.NET Core Hosting、Windows VM、Application Pool、Web Hosting；近期考慮半封閉環境、內部 GitLab CI/CD 部署至 IIS VM | 同時具備 Linux / Container + Windows / IIS 兩邊部署經驗 |
| Git / CI/CD | Git、TortoiseGit、Git for Windows、Azure DevOps、GitLab；規劃 `GitLab → CI/CD → IIS VM` | 不只版控，而是 Source Control + CI/CD |
| Windows Automation | BAT、Task Scheduler、PowerShell / CLI；UTF-8（`chcp 65001`）、JSON、HTTP POST、檔案讀寫、日期、`%COMPUTERNAME%` | 非典型亮點：習慣把每天重複的事自動化 |

**自動化流程範例**（`D:\temp\claude`、`D:\src\jobLog`）：

`BAT → Claude → Git Log → 工作整理 → JANDI`

---

## 六、AI / LLM

| 主題 | 內容 | 評價 |
|---|---|---|
| AI / LLM | Claude、LLM、Prompt Engineering、AI Model Integration、Qdrant | 最近快速增加的一塊 |
| 架構思維 | `Application → Service → AI / LLM Service → Model Provider`；思考各家 AI Model 是否可像 Persistence Layer 一樣抽換，以及 Prompt / Content 應放哪一層 | 已進入 LLM Application Architecture，而非僅呼叫 API |
| Vector DB | Docker 環境含 Qdrant；Vector Database、Embedding、Semantic Search、RAG | 正在建立實戰經驗，成熟度尚不及 C# / SQL |

---

## 七、技術架構圖

```text
                         ┌─────────────────────┐
                         │      AI / LLM       │
                         │ Prompt / RAG / LLM  │
                         │ Qdrant / Claude     │
                         └──────────┬──────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────┐
│                   Application                      │
│                                                    │
│       ASP.NET Core / MVC / Web API / GraphQL       │
│                                                    │
│    ┌─────────────── Service ────────────────┐      │
│    │ Business Logic / MediatR / Mapster     │      │
│    └─────────────────┬──────────────────────┘      │
│                      │                             │
└──────────────────────┼─────────────────────────────┘
                       │
          ┌────────────┼─────────────┐
          ▼            ▼             ▼
       EF Core      HttpClient     Cache
          │            │             │
          ▼            ▼             ▼
      SQL Server    Microservice   Redis
      PostgreSQL    REST / GraphQL  MemoryCache
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      RabbitMQ     Azure Service   SignalR
                      Bus

──────────────────────────────────────────────────────

              Infrastructure / DevOps

 Docker → Compose → ACR → AKS → Helm
    │                         │
    └──── Local Dev            └── Azure

 Git → Azure DevOps / GitLab → CI/CD → IIS / AKS

 Windows → BAT → Task Scheduler → Automation
```

---

## 八、三大個人特色

| # | 特色 | 表現 | 代表性思維 |
|---|---|---|---|
| 1 | 不只是「寫程式」 | 從「這段 C# 怎麼寫」一路問到分層、抽象、共用、多 Service / 多 Pod / 高併發 | 架構 / SA / Senior Developer 思維 |
| 2 | 重視「共用與抽換」 | Shared Module、Middleware、Handler、Service、Repository / Persistence、AI Model Provider；常想「未來換東西要不要整個重寫？」 | `Business Service → AI Abstraction → OpenAI / Claude / Gemini`，與 Persistence Layer 思維一致 |
| 3 | 強烈的工程自動化傾向 | 每天重複的事 → BAT → Task Scheduler → Git Log → Claude → 整理 → JANDI | 把重複工作流程化、自動化 |

---

## 九、總結

| 項目 | 內容 |
|---|---|
| 技術能力概括 | 企業系統開發 + 架構設計 + 系統整合 + DevOps + 自動化 |
| 未來方向 | 企業系統 + LLM / AI Architecture |
