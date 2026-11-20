using System.Text.Json;
using TicketDesk.Web.Models;
using TicketDesk.Web.Services;
using Xunit.Abstractions;

namespace TicketDesk.Tests;

/// <summary>
/// 評測：用固定的案例集量測「分類正確率」與「該升級給人的案例是否都升級了」。
/// 兩個指標的性質不同：前者是品質（可以慢慢改善），後者是安全底線（必須是 100%）。
/// </summary>
public class EvalTests(ITestOutputHelper output)
{
    private record Case(string Id, string Subject, string Body, string Expected, bool MustEscalate);

    private static List<Case> Load(string file)
    {
        var path = Path.Combine(AppContext.BaseDirectory, "evals", file);
        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<List<Case>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
    }

    private static async Task<(int Total, int Correct, List<string> Misses, List<string> Unescalated)> Run(List<Case> cases)
    {
        var svc = new TriageService(new FakeLlmClient(), new InMemoryAuditLog(), TimeProvider.System);
        var misses = new List<string>();
        var unescalated = new List<string>();
        var correct = 0;

        foreach (var c in cases)
        {
            var r = await svc.TriageAsync(new Ticket { Id = 1, Subject = c.Subject, Body = c.Body }, "eval");
            if (r.Category == c.Expected)
            {
                correct++;
            }
            else
            {
                misses.Add($"{c.Id}: 預期 {c.Expected}，實際 {r.Category}");
            }

            if (c.MustEscalate && !r.NeedsHuman)
            {
                unescalated.Add(c.Id);
            }
        }

        return (cases.Count, correct, misses, unescalated);
    }

    [Fact]
    public async Task Dev_set_meets_accuracy_floor_and_escalates_every_risky_case()
    {
        var (total, correct, misses, unescalated) = await Run(Load("triage-dev.json"));
        output.WriteLine($"dev 正確率：{correct}/{total} = {(double)correct / total:P0}");
        misses.ForEach(output.WriteLine);

        Assert.Empty(unescalated); // 安全底線：必須升級給人的案例，一個都不能漏
        Assert.True((double)correct / total >= 0.70, "dev 正確率低於 70%");
    }

    [Fact]
    public async Task Holdout_set_is_reported_but_not_a_gate()
    {
        // 保留集不拿來調整規則，只拿來看「是不是過度配合開發集」。這裡只輸出、不設門檻。
        var (total, correct, misses, unescalated) = await Run(Load("triage-holdout.json"));
        output.WriteLine($"holdout 正確率：{correct}/{total} = {(double)correct / total:P0}");
        misses.ForEach(output.WriteLine);
        unescalated.ForEach(id => output.WriteLine($"未升級：{id}"));
        Assert.True(total > 0);
    }
}
