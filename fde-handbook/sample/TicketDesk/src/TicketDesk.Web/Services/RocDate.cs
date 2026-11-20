using System.Text.RegularExpressions;

namespace TicketDesk.Web.Services;

/// <summary>
/// 客戶資料常見的髒資料之一：民國年日期（例如 113/11/05、113-11-05、1131105）。
/// 把它統一轉成 DateOnly，無法判斷時回傳 false，而不是猜。
/// </summary>
public static class RocDate
{
    private static readonly Regex Slashed = new(@"^(\d{2,3})[/\-.](\d{1,2})[/\-.](\d{1,2})$", RegexOptions.Compiled);
    private static readonly Regex Compact = new(@"^(\d{3})(\d{2})(\d{2})$", RegexOptions.Compiled);

    public static bool TryParse(string? text, out DateOnly date)
    {
        date = default;
        if (string.IsNullOrWhiteSpace(text))
        {
            return false;
        }

        var s = text.Trim();
        var m = Slashed.Match(s);
        if (!m.Success)
        {
            m = Compact.Match(s);
        }

        if (!m.Success)
        {
            return false;
        }

        var year = int.Parse(m.Groups[1].Value) + 1911;
        var month = int.Parse(m.Groups[2].Value);
        var day = int.Parse(m.Groups[3].Value);

        if (month is < 1 or > 12 || day < 1 || day > DateTime.DaysInMonth(year, month))
        {
            return false;
        }

        date = new DateOnly(year, month, day);
        return true;
    }
}
