using TicketDesk.Web.Models;

namespace TicketDesk.Web.Services;

/// <summary>
/// 分流的核心：遮罩個資 → 呼叫模型 → 驗證輸出 → 套用規則 → 寫稽核紀錄。
/// 設計原則：模型只「建議」，是否需要人處理由這裡的確定性規則決定。
/// </summary>
public class TriageService(ILlmClient llm, IAuditLog audit, TimeProvider clock)
{
    /// <summary>信心低於此值就交給人。數字是示範值，真實專案要依評測結果與業務風險調整。</summary>
    public const double MinConfidence = 0.7;

    public async Task<TriageResult> TriageAsync(Ticket ticket, string actor, CancellationToken ct = default)
    {
        var flags = new List<string>();
        var masked = PiiMasker.Mask(ticket.Body);

        if (InjectionDetector.LooksLikeInjection(ticket.Subject + " " + ticket.Body))
        {
            flags.Add("possible-injection");
        }

        LlmTriage raw;
        try
        {
            raw = await llm.TriageAsync(ticket.Subject, masked, ct);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            flags.Add("llm-error");
            var failed = new TriageResult
            {
                Category = Categories.Other,
                Priority = Priorities.Normal,
                NeedsHuman = true,
                Reason = "模型呼叫失敗，改由人處理",
                Flags = flags
            };
            WriteAudit(ticket, actor, failed);
            return failed;
        }

        var result = Validate(raw, flags);
        WriteAudit(ticket, actor, result);
        return result;
    }

    private static TriageResult Validate(LlmTriage raw, List<string> flags)
    {
        var category = raw.Category;
        if (!Categories.All.Contains(category))
        {
            flags.Add("invalid-category");
            category = Categories.Other;
        }

        var priority = raw.Priority;
        if (!Priorities.All.Contains(priority))
        {
            flags.Add("invalid-priority");
            priority = Priorities.Normal;
        }

        var confidence = double.IsNaN(raw.Confidence) ? 0 : Math.Clamp(raw.Confidence, 0, 1);
        var draft = (raw.DraftReply ?? "").Trim();
        if (draft.Length > 600)
        {
            draft = draft[..600];
            flags.Add("draft-truncated");
        }

        // 是否需要人：由規則決定，不由模型決定
        var needsHuman =
            flags.Contains("possible-injection") ||
            flags.Contains("invalid-category") ||
            confidence < MinConfidence ||
            category == Categories.Complaint ||
            category == Categories.Other ||
            priority == Priorities.High;

        return new TriageResult
        {
            Category = category,
            Priority = priority,
            Confidence = confidence,
            DraftReply = draft,
            Reason = raw.Reason ?? "",
            NeedsHuman = needsHuman,
            Flags = flags
        };
    }

    private void WriteAudit(Ticket ticket, string actor, TriageResult r) =>
        audit.Write(new AuditEntry(
            clock.GetUtcNow(), actor, "triage", ticket.Id,
            $"category={r.Category}; priority={r.Priority}; confidence={r.Confidence:0.00}; needsHuman={r.NeedsHuman}; flags={string.Join(',', r.Flags)}"));
}
