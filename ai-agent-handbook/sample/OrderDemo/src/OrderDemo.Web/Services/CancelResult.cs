namespace OrderDemo.Web.Services;

public record CancelResult(bool Success, string? Error)
{
    public static CancelResult Ok() => new(true, null);

    public static CancelResult Fail(string error) => new(false, error);
}
