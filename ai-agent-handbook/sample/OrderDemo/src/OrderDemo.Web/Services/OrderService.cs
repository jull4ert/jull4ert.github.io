using OrderDemo.Web.Models;

namespace OrderDemo.Web.Services;

public class OrderService(IOrderRepository repository)
{
    public IReadOnlyList<Order> List(int departmentId, OrderStatus? status = null)
    {
        var query = repository.GetAll().Where(o => o.DepartmentId == departmentId);

        if (status.HasValue)
        {
            query = query.Where(o => o.Status == status.Value);
        }

        return query.OrderByDescending(o => o.CreatedAt).ToList();
    }

    public CancelResult Cancel(int orderId, int departmentId)
    {
        var order = repository.Get(orderId);
        if (order is null || order.DepartmentId != departmentId)
        {
            return CancelResult.Fail("找不到訂單");
        }

        if (order.Status == OrderStatus.Cancelled)
        {
            return CancelResult.Fail("訂單已取消");
        }

        order.Status = OrderStatus.Cancelled;
        repository.Update(order);
        return CancelResult.Ok();
    }
}
