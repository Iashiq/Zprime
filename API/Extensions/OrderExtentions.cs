using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtentions
    {
        public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> query)
        {
            return query
              .Select(Order => new OrderDto
              {
                  Id = Order.Id,
                  BuyerId = Order.BuyerId,
                  OrderDate = Order.OrderDate,
                  ShippingAddress = Order.ShippingAddress,
                  DeliveryFee = Order.DeliveryFee,
                  SubTotal = Order.SubTotal,
                  OrderStatus = Order.OrderStatus.ToString(),
                  Total = Order.GetTotal(),
                  OrderItems = Order.OrderItems.Select(item => new OrderItemDto
                  {
                      ProductId = item.ItemOrdered.ProductId,
                      Name = item.ItemOrdered.Name,
                      PictureUrl = item.ItemOrdered.PictureUrl,
                      Price = item.Price,
                      Quantity = item.Quantity
                  }).ToList()

              }).AsNoTracking();
        }
    }
}