# OrderDemo：練習用範例專案

給「AI Agent 開發手冊」動手練習使用的小專案。**專案內刻意留有缺陷與缺漏**，用來練習和 agent 協作；請不要把它當成正式程式碼的範本。

## 技術
- ASP.NET Core MVC（.NET 8）：同一個專案內提供 MVC 頁面與 JSON API
- 前端：Vue 3（以 CDN 載入，無需 Node 建置）；純函式放在 `wwwroot/js/order-utils.js`
- 測試：xUnit（後端）、Node 內建測試執行器（前端純函式）
- 資料：記憶體內假資料，無資料庫

## 需求
- .NET 8 SDK
- Node.js 20 以上（只有跑前端純函式測試才需要）
- git

## 常用指令
```
dotnet build
dotnet test
dotnet run --project src/OrderDemo.Web      # 開啟 http://localhost:5000/Orders（實際連接埠看輸出）
node --test                                 # 前端純函式測試（自動找 *.test.js）
```

## 結構
```
src/OrderDemo.Web/
  Controllers/OrdersController.cs         MVC 頁面
  Controllers/Api/OrdersApiController.cs  JSON API
  Services/OrderService.cs                商業邏輯
  Data/InMemoryOrderRepository.cs         假資料
  Models/                                 Order、OrderStatus
  Views/Orders/Index.cshtml               Vue 掛載的頁面
  wwwroot/js/                             Vue 應用與工具函式
tests/OrderDemo.Tests/                    xUnit
tests/js/                                 前端純函式測試
docs/specs/                               練習用規格
docs/labs/                                練習用素材
```

## 練習
見手冊的「動手練習」區。建議每個練習都在新的 git 分支上進行。
