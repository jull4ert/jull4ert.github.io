using TicketDesk.Web.Services;

namespace TicketDesk.Tests;

public class RocDateTests
{
    [Theory]
    [InlineData("113/11/05", 2024, 11, 5)]
    [InlineData("113-1-9", 2024, 1, 9)]
    [InlineData("1131105", 2024, 11, 5)]
    [InlineData("99/12/31", 2010, 12, 31)]
    public void Parses_valid_roc_dates(string text, int y, int m, int d)
    {
        Assert.True(RocDate.TryParse(text, out var date));
        Assert.Equal(new DateOnly(y, m, d), date);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    [InlineData("113/13/01")]
    [InlineData("113/02/30")]
    [InlineData("昨天")]
    [InlineData("2024/11/05 14:00")]
    public void Rejects_ambiguous_or_invalid_text_instead_of_guessing(string? text)
    {
        Assert.False(RocDate.TryParse(text, out _));
    }
}
