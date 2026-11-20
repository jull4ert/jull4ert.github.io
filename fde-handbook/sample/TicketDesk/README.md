# TicketDesk：客服來信 AI 分流（FDE 練習專案）

這是 `fde-handbook` 的練習專案：一個 ASP.NET Core MVC（.NET 8）＋ Vue 3 的小系統，前後端在同一個專案。
情境是「客服來信先由 AI 分類、擬回覆草稿，人工核可後才送出」。

它刻意做得很小，目的是讓你練習 FDE 導入 AI 時真正會碰到的事：個資遮罩、驗證模型輸出、
該交給人的規則、稽核紀錄、評測集、提示注入。**不是**可直接上線的產品。

## 預設不需要金鑰

預設使用 `FakeLlmClient`（關鍵字規則的替身），結果每次一樣、不花錢、不連網。
它故意有弱點（多意圖會分錯、會照來信內的 `category=` 指示走），用來模擬真實模型會犯的錯。

## 執行

```
dotnet test TicketDesk.sln
dotnet run --project src/TicketDesk.Web
```

打開終端機顯示的網址（例如 http://localhost:5000）。

## 結構

| 位置 | 用途 |
|---|---|
| `Services/TriageService.cs` | 核心：遮罩 → 呼叫模型 → 驗證 → 規則（要不要交給人）→ 稽核 |
| `Services/PiiMasker.cs` | 送模型前遮罩 email、手機、卡號、身分證 |
| `Services/InjectionDetector.cs` | 粗略偵測來信中的指令式文字（可被繞過，只是第一道） |
| `Services/FakeLlmClient.cs` | 可重現的替身 |
| `Services/RocDate.cs` | 民國年日期轉換（無法判斷就回報，不猜） |
| `Services/AnthropicLlmClient.cs` | 真實模型的接法（選用，**未用真實金鑰實測**） |
| `Controllers/Api/TicketsApiController.cs` | 列表、分流、核可、稽核、串流示範 API |
| `evals/triage-dev.json`、`triage-holdout.json` | 評測集：開發集與保留集 |
| `tests/` | xUnit：遮罩、分流規則、民國年、評測（共 26 個） |
| `docs/discovery/interview-notes.md` | 虛構的訪談紀錄（Lab 2） |
| `docs/legacy/tickets-export.csv` | 舊系統匯出檔範例，含壞資料（Lab 6） |

## 使用真實模型（選用）

```
set TICKETDESK_LLM=anthropic
set ANTHROPIC_API_KEY=你的金鑰
dotnet run --project src/TicketDesk.Web
```

金鑰只放環境變數，不要寫進程式或提交到 git。送出的內容已先遮罩，但請依你所在組織的資料政策決定能不能這樣做。
換成真實模型後，請重新跑你自己的評測集，不要沿用替身的數字。

## 練習題

專案刻意保留了幾個缺口，對應手冊 `12-cases-labs/` 的 Lab 3 到 Lab 6：保留集的資安缺口、遮罩與注入偵測的盲點、核可只靠畫面、舊資料匯入。
參考解答在手冊的 Lab 頁面中；基準專案不含解答。

## 這個專案刻意不做的事

- 沒有登入與權限（操作者是固定字串）；真實專案必須接身分系統。
- 資料只在記憶體，重啟就消失；沒有資料庫。
- 沒有真的寄信；「核可送出」只更新狀態並寫稽核。
- 稽核紀錄只在記憶體；真實專案要寫入不可竄改的儲存。
