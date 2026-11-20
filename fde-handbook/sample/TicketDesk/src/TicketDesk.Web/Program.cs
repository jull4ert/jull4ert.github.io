using System.Text.Json.Serialization;
using TicketDesk.Web.Data;
using TicketDesk.Web.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllersWithViews()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<ITicketStore, InMemoryTicketStore>();
builder.Services.AddSingleton<IAuditLog, InMemoryAuditLog>();
builder.Services.AddScoped<TriageService>();

// 預設用可重現的替身；只有明確設定環境變數時才會呼叫真實模型。
var apiKey = Environment.GetEnvironmentVariable("ANTHROPIC_API_KEY");
if (Environment.GetEnvironmentVariable("TICKETDESK_LLM") == "anthropic" && !string.IsNullOrWhiteSpace(apiKey))
{
    var model = Environment.GetEnvironmentVariable("TICKETDESK_MODEL") ?? "claude-haiku-5-5";
    builder.Services.AddHttpClient<ILlmClient, AnthropicLlmClient>((http, _) =>
        new AnthropicLlmClient(http, apiKey, model));
}
else
{
    builder.Services.AddSingleton<ILlmClient, FakeLlmClient>();
}

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Tickets}/{action=Index}/{id?}");

app.Run();

public partial class Program;
