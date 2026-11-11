using OrderDemo.Web.Data;
using OrderDemo.Web.Models;
using OrderDemo.Web.Services;

namespace OrderDemo.Tests;

public class OrderServiceTests
{
    private static OrderService CreateService() => new(new InMemoryOrderRepository());

    [Fact]
    public void List_OnlyReturnsOrdersOfTheDepartment()
    {
        var orders = CreateService().List(departmentId: 2);

        Assert.All(orders, o => Assert.Equal(2, o.DepartmentId));
        Assert.Equal(3, orders.Count);
    }

    [Fact]
    public void List_FiltersByStatus()
    {
        var orders = CreateService().List(departmentId: 1, status: OrderStatus.Shipped);

        Assert.Equal(2, orders.Count);
        Assert.All(orders, o => Assert.Equal(OrderStatus.Shipped, o.Status));
    }

    [Fact]
    public void List_IsSortedByCreatedAtDescending()
    {
        var orders = CreateService().List(departmentId: 1);

        Assert.Equal(orders.OrderByDescending(o => o.CreatedAt).Select(o => o.Id), orders.Select(o => o.Id));
    }

    [Fact]
    public void Cancel_SubmittedOrder_Succeeds()
    {
        var result = CreateService().Cancel(orderId: 1, departmentId: 1);

        Assert.True(result.Success);
    }

    [Fact]
    public void Cancel_AlreadyCancelledOrder_Fails()
    {
        var result = CreateService().Cancel(orderId: 3, departmentId: 1);

        Assert.False(result.Success);
        Assert.Equal("訂單已取消", result.Error);
    }

    [Fact]
    public void Cancel_OrderOfAnotherDepartment_Fails()
    {
        var result = CreateService().Cancel(orderId: 7, departmentId: 1);

        Assert.False(result.Success);
    }
}
