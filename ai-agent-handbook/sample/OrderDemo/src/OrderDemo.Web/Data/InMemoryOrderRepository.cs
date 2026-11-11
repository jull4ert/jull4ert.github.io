using OrderDemo.Web.Models;
using OrderDemo.Web.Services;

namespace OrderDemo.Web.Data;

public class InMemoryOrderRepository : IOrderRepository
{
    private readonly List<Order> orders =
    [
        new() { Id = 1, CustomerName = "甲公司", DepartmentId = 1, Status = OrderStatus.Submitted, Total = 1200m, CreatedAt = new DateTime(2026, 10, 1, 1, 30, 0, DateTimeKind.Utc) },
        new() { Id = 2, CustomerName = "乙公司", DepartmentId = 1, Status = OrderStatus.Shipped, Total = 560m, CreatedAt = new DateTime(2026, 10, 3, 9, 0, 0, DateTimeKind.Utc), ShippedAt = new DateTime(2026, 10, 5, 2, 0, 0, DateTimeKind.Utc) },
        new() { Id = 3, CustomerName = "丙公司", DepartmentId = 1, Status = OrderStatus.Cancelled, Total = 300m, CreatedAt = new DateTime(2026, 10, 7, 15, 0, 0, DateTimeKind.Utc) },
        new() { Id = 4, CustomerName = "丁公司", DepartmentId = 1, Status = OrderStatus.Draft, Total = 80m, CreatedAt = new DateTime(2026, 10, 12, 16, 30, 0, DateTimeKind.Utc) },
        new() { Id = 5, CustomerName = "戊公司", DepartmentId = 1, Status = OrderStatus.Submitted, Total = 4500m, CreatedAt = new DateTime(2026, 10, 15, 3, 0, 0, DateTimeKind.Utc) },
        new() { Id = 6, CustomerName = "己公司", DepartmentId = 1, Status = OrderStatus.Shipped, Total = 920m, CreatedAt = new DateTime(2026, 10, 20, 8, 0, 0, DateTimeKind.Utc), ShippedAt = new DateTime(2026, 10, 22, 8, 0, 0, DateTimeKind.Utc) },
        new() { Id = 7, CustomerName = "庚公司", DepartmentId = 2, Status = OrderStatus.Submitted, Total = 700m, CreatedAt = new DateTime(2026, 10, 2, 10, 0, 0, DateTimeKind.Utc) },
        new() { Id = 8, CustomerName = "辛公司", DepartmentId = 2, Status = OrderStatus.Shipped, Total = 150m, CreatedAt = new DateTime(2026, 10, 9, 10, 0, 0, DateTimeKind.Utc), ShippedAt = new DateTime(2026, 10, 10, 10, 0, 0, DateTimeKind.Utc) },
        new() { Id = 9, CustomerName = "壬公司", DepartmentId = 2, Status = OrderStatus.Draft, Total = 60m, CreatedAt = new DateTime(2026, 10, 18, 10, 0, 0, DateTimeKind.Utc) },
    ];

    public IReadOnlyList<Order> GetAll() => this.orders;

    public Order? Get(int id) => this.orders.FirstOrDefault(o => o.Id == id);

    public void Update(Order order)
    {
        var index = this.orders.FindIndex(o => o.Id == order.Id);
        if (index >= 0)
        {
            this.orders[index] = order;
        }
    }
}
