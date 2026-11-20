using System.Text.RegularExpressions;

namespace TicketDesk.Web.Services;

/// <summary>送給模型之前，先遮罩個資。這是「資料最小化」的最簡單版本。</summary>
public static class PiiMasker
{
    // 順序很重要：先處理最長的卡號，避免手機規則吃掉卡號的前 10 碼。
    private static readonly (Regex Pattern, string Token)[] Rules =
    {
        (new Regex(@"\b(?:\d[ -]?){13,16}\b", RegexOptions.Compiled), "[CARD]"),
        (new Regex(@"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", RegexOptions.Compiled), "[EMAIL]"),
        (new Regex(@"\b09\d{2}-?\d{3}-?\d{3}\b", RegexOptions.Compiled), "[PHONE]"),
        (new Regex(@"\b[A-Z][12]\d{8}\b", RegexOptions.Compiled), "[ID]"),
    };

    public static string Mask(string text)
    {
        if (string.IsNullOrEmpty(text))
        {
            return text;
        }

        foreach (var (pattern, token) in Rules)
        {
            text = pattern.Replace(text, token);
        }

        return text;
    }
}
