namespace TicketDesk.Web.Services;

/// <summary>稽核紀錄只存「發生了什麼」，不存來信原文與個資。</summary>
public record AuditEntry(DateTimeOffset At, string Actor, string Action, int TicketId, string Detail);

public interface IAuditLog
{
    void Write(AuditEntry entry);
    IReadOnlyList<AuditEntry> All();
}

public class InMemoryAuditLog : IAuditLog
{
    private readonly List<AuditEntry> _entries = new();
    private readonly object _lock = new();

    public void Write(AuditEntry entry)
    {
        lock (_lock)
        {
            _entries.Add(entry);
        }
    }

    public IReadOnlyList<AuditEntry> All()
    {
        lock (_lock)
        {
            return _entries.ToList();
        }
    }
}
