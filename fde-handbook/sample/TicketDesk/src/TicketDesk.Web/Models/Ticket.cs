namespace TicketDesk.Web.Models;

public enum TicketStatus
{
    New,
    Triaged,
    Replied
}

public class Ticket
{
    public int Id { get; set; }
    public string Customer { get; set; } = "";
    public string Subject { get; set; } = "";
    public string Body { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public TicketStatus Status { get; set; } = TicketStatus.New;
    public TriageResult? Triage { get; set; }
    public string? FinalReply { get; set; }
}

/// <summary>分流結果。NeedsHuman 為 true 時，必須由人處理，不可只靠草稿回覆。</summary>
public class TriageResult
{
    public string Category { get; set; } = Categories.Other;
    public string Priority { get; set; } = Priorities.Normal;
    public double Confidence { get; set; }
    public string DraftReply { get; set; } = "";
    public string Reason { get; set; } = "";
    public bool NeedsHuman { get; set; }
    public List<string> Flags { get; set; } = new();
}

public static class Categories
{
    public const string Billing = "billing";
    public const string Shipping = "shipping";
    public const string Technical = "technical";
    public const string Account = "account";
    public const string Complaint = "complaint";
    public const string Other = "other";

    public static readonly string[] All = { Billing, Shipping, Technical, Account, Complaint, Other };
}

public static class Priorities
{
    public const string Low = "low";
    public const string Normal = "normal";
    public const string High = "high";

    public static readonly string[] All = { Low, Normal, High };
}
