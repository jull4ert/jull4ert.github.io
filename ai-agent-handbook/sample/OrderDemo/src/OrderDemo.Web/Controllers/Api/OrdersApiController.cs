using Microsoft.AspNetCore.Mvc;
using OrderDemo.Web.Models;
using OrderDemo.Web.Services;

namespace OrderDemo.Web.Controllers.Api;

[ApiController]
[Route("api/orders")]
public class OrdersApiController(OrderService service) : ControllerBase
{
    [HttpGet]
    public IActionResult Get([FromQuery] int departmentId, [FromQuery] OrderStatus? status)
    {
        return Ok(service.List(departmentId, status));
    }

    [HttpPost("{id}/cancel")]
    public IActionResult Cancel(int id, [FromQuery] int departmentId)
    {
        var result = service.Cancel(id, departmentId);
        return result.Success ? NoContent() : BadRequest(new { error = result.Error });
    }
}
