using Microsoft.AspNetCore.Mvc;

namespace OrderDemo.Web.Controllers;

public class OrdersController : Controller
{
    public IActionResult Index() => View();
}
