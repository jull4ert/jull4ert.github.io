namespace TicketDesk.Web.Services;

/// <summary>模型回傳的原始分流結果。注意：它是「不可信的輸入」，必須經過 TriageService 驗證。</summary>
public record LlmTriage(string Category, string Priority, double Confidence, string DraftReply, string Reason);

public interface ILlmClient
{
    Task<LlmTriage> TriageAsync(string subject, string maskedBody, CancellationToken ct = default);
}
