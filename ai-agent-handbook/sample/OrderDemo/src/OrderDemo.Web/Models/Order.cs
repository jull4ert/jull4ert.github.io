namespace OrderDemo.Web.Models;

public class Order
{
    public int Id { get; set; }

    public string CustomerName { get; set; } = "";

    public int DepartmentId { get; set; }

    public OrderStatus Status { get; set; }

    public decimal Total { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? ShippedAt { get; set; }
}
