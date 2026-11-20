using TicketDesk.Web.Services;

namespace TicketDesk.Tests;

public class PiiMaskerTests
{
    [Fact]
    public void Masks_email()
    {
        Assert.Equal("請寄到 [EMAIL] 謝謝", PiiMasker.Mask("請寄到 abc@example.com 謝謝"));
    }

    [Fact]
    public void Masks_mobile_phone()
    {
        Assert.Equal("電話 [PHONE]", PiiMasker.Mask("電話 0912-345-678"));
    }

    [Fact]
    public void Masks_card_number_without_leaving_phone_fragment()
    {
        var masked = PiiMasker.Mask("卡號 4111 1111 1111 1111");
        Assert.Equal("卡號 [CARD]", masked);
    }

    [Fact]
    public void Masks_national_id()
    {
        Assert.Equal("身分證 [ID]", PiiMasker.Mask("身分證 A123456789"));
    }

    [Fact]
    public void Leaves_normal_text_unchanged()
    {
        Assert.Equal("包裹還沒收到", PiiMasker.Mask("包裹還沒收到"));
    }
}
