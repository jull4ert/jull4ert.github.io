using System.Text.RegularExpressions;

namespace TicketDesk.Web.Services;

/// <summary>
/// 粗略偵測「像是在對模型下指令」的來信內容。
/// 這只是第一道、可被繞過的防線；真正的防線是：不讓模型輸出直接產生副作用，且一律驗證輸出。
/// </summary>
public static class InjectionDetector
{
    private static readonly Regex[] Patterns =
    {
        new(@"忽略(以上|先前|之前)", RegexOptions.Compiled),
        new(@"ignore\s+(all\s+)?(the\s+)?(previous|above)", RegexOptions.Compiled | RegexOptions.IgnoreCase),
        new(@"system\s*prompt", RegexOptions.Compiled | RegexOptions.IgnoreCase),
        new(@"你現在是", RegexOptions.Compiled),
        new(@"category\s*=", RegexOptions.Compiled | RegexOptions.IgnoreCase),
    };

    public static bool LooksLikeInjection(string text) =>
        !string.IsNullOrEmpty(text) && Patterns.Any(p => p.IsMatch(text));
}
