using Microsoft.AspNetCore.Mvc;

namespace TicketDesk.Web.Controllers;

public class TicketsController : Controller
{
    public IActionResult Index() => View();
}
