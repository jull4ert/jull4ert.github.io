using OrderDemo.Web.Models;

namespace OrderDemo.Web.Services;

public interface IOrderRepository
{
    IReadOnlyList<Order> GetAll();

    Order? Get(int id);

    void Update(Order order);
}
