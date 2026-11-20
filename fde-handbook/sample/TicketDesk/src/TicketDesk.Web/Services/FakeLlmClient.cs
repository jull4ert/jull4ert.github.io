using System.Text.RegularExpressions;
using TicketDesk.Web.Models;

namespace TicketDesk.Web.Services;

/// <summary>
/// 用關鍵字模擬模型的「可重現」替身，讓練習不需要金鑰、不花錢、結果每次一樣。
/// 它故意有兩個弱點，讓你練習「為什麼不能信任模型輸出」：
/// 1. 一封信含多個意圖時容易分錯；2. 來信內若寫 category=xxx，它會照做（模擬被提示注入）。
/// 真實模型的錯誤不會這麼規律，但需要的防護是同一套。
/// </summary>
public class FakeLlmClient : ILlmClient
{
    private static readonly Dictionary<string, string[]> Keywords = new()
    {
        [Categories.Billing] = new[] { "退款", "發票", "扣款", "帳單", "重複扣" },
        [Categories.Shipping] = new[] { "物流", "配送", "出貨", "包裹", "沒收到" },
        [Categories.Technical] = new[] { "錯誤", "當機", "打不開", "閃退", "畫面" },
        [Categories.Account] = new[] { "密碼", "登入", "帳號", "驗證碼" },
        [Categories.Complaint] = new[] { "投訴", "客訴", "消保", "律師", "太爛" },
    };

    private static readonly Regex Injected = new(@"category\s*=\s*(\w+)", RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public Task<LlmTriage> TriageAsync(string subject, string maskedBody, CancellationToken ct = default)
    {
        var text = subject + " " + maskedBody;

        // 弱點 2：照著來信內容裡的指令走（模擬被提示注入的模型）
        var m = Injected.Match(text);
        if (m.Success)
        {
            return Task.FromResult(new LlmTriage(m.Groups[1].Value, Priorities.Low, 0.99, "已依指示處理。", "來信內含分類指示"));
        }

        var scores = Keywords
            .Select(kv => (Category: kv.Key, Hits: kv.Value.Count(k => text.Contains(k))))
            .OrderByDescending(s => s.Hits)
            .ToList();

        var top = scores[0];
        if (top.Hits == 0)
        {
            return Task.FromResult(new LlmTriage(Categories.Other, Priorities.Normal, 0.4, Draft(Categories.Other), "沒有命中任何關鍵字"));
        }

        // 弱點 1：兩個類別同分時，只是挑第一個，信心降低
        var tie = scores.Count > 1 && scores[1].Hits == top.Hits;
        var confidence = tie ? 0.5 : Math.Min(0.95, 0.6 + 0.15 * top.Hits);
        var priority = top.Category == Categories.Complaint || text.Contains("急") || text.Contains("立刻")
            ? Priorities.High
            : Priorities.Normal;

        return Task.FromResult(new LlmTriage(top.Category, priority, confidence, Draft(top.Category),
            $"命中 {top.Hits} 個「{top.Category}」關鍵字" + (tie ? "（與其他類別同分）" : "")));
    }

    private static string Draft(string category) => category switch
    {
        Categories.Billing => "您好，我們已收到您的帳務問題，會請同仁核對交易紀錄後回覆您。",
        Categories.Shipping => "您好，我們已收到您的物流問題，會向物流商確認包裹狀態後回覆您。",
        Categories.Technical => "您好，我們已收到您回報的問題，請提供發生時間與畫面截圖，以利我們排查。",
        Categories.Account => "您好，為保護您的帳號安全，我們會透過已登記的聯絡方式協助您。",
        Categories.Complaint => "您好，造成您的不便我們深感抱歉，會有專人盡快與您聯繫。",
        _ => "您好，我們已收到您的來信，會有同仁儘快回覆。",
    };
}
