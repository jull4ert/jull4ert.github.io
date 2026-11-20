using Microsoft.AspNetCore.Mvc;
using TicketDesk.Web.Data;
using TicketDesk.Web.Models;
using TicketDesk.Web.Services;

namespace TicketDesk.Web.Controllers.Api;

[ApiController]
[Route("api")]
public class TicketsApiController(ITicketStore store, TriageService triage, IAuditLog audit, TimeProvider clock) : ControllerBase
{
    // 示範用固定身分。真實專案必須接公司的身分系統（見手冊 05 整合企業系統）。
    private const string Actor = "demo-user";

    public record ApproveRequest(string? Reply);

    [HttpGet("tickets")]
    public IActionResult List() => Ok(store.All());

    [HttpPost("tickets/{id:int}/triage")]
    public async Task<IActionResult> Triage(int id, CancellationToken ct)
    {
        var ticket = store.Get(id);
        if (ticket is null)
        {
            return NotFound();
        }

        ticket.Triage = await triage.TriageAsync(ticket, Actor, ct);
        ticket.Status = TicketStatus.Triaged;
        return Ok(ticket);
    }

    /// <summary>人工核可後才「送出」（此示範不會真的寄信）。模型建議不能繞過這一步。</summary>
    [HttpPost("tickets/{id:int}/approve")]
    public IActionResult Approve(int id, [FromBody] ApproveRequest request)
    {
        var ticket = store.Get(id);
        if (ticket is null)
        {
            return NotFound();
        }

        if (ticket.Triage is null)
        {
            return BadRequest(new { error = "尚未分流，不能核可" });
        }

        if (string.IsNullOrWhiteSpace(request.Reply))
        {
            return BadRequest(new { error = "回覆內容不能是空的" });
        }

        var edited = request.Reply.Trim() != ticket.Triage.DraftReply;
        ticket.FinalReply = request.Reply.Trim();
        ticket.Status = TicketStatus.Replied;
        audit.Write(new AuditEntry(clock.GetUtcNow(), Actor, "approve", ticket.Id, $"edited={edited}; needsHuman={ticket.Triage.NeedsHuman}"));
        return Ok(ticket);
    }

    /// <summary>
    /// 示範「串流到前端」：把已產生的草稿分段以 Server-Sent Events 送出。
    /// 注意：這是模擬串流（草稿已經產生完畢）。真實的模型串流是由模型 API 逐段回傳，再由後端轉送，
    /// 驗證與規則仍須在完整輸出後執行，見手冊 04 的說明。
    /// </summary>
    [HttpGet("tickets/{id:int}/draft-stream")]
    public async Task DraftStream(int id, CancellationToken ct)
    {
        var ticket = store.Get(id);
        if (ticket?.Triage is null)
        {
            Response.StatusCode = StatusCodes.Status404NotFound;
            return;
        }

        Response.ContentType = "text/event-stream";
        Response.Headers.CacheControl = "no-cache";

        var text = ticket.Triage.DraftReply;
        for (var i = 0; i < text.Length; i += 4)
        {
            var chunk = text.Substring(i, Math.Min(4, text.Length - i));
            await Response.WriteAsync($"data: {System.Text.Json.JsonSerializer.Serialize(chunk)}\n\n", ct);
            await Response.Body.FlushAsync(ct);
            await Task.Delay(30, ct);
        }

        await Response.WriteAsync("event: done\ndata: {}\n\n", ct);
    }

    [HttpGet("audit")]
    public IActionResult Audit() => Ok(audit.All());
}
